package store

import (
	"context"
	"database/sql"
	"encoding/binary"
	"fmt"
	"log/slog"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type VectorManifoldResolver interface {
	ResolveVectorManifold(ctx context.Context, id event.ID) (VectorManifold, error)
}

type VectorManifoldWriter interface {
	WriteVectorManifold(ctx context.Context, tx db.Executor, vectorManifold *event.VectorManifold) error
}

type VectorReadWriter interface {
	ReadVector(ctx context.Context, vectorID int64) (*event.Vector[float32], error)
	WriteVector(ctx context.Context, tx db.Tx, data []float32) (int64, error)
}

// TODO choose a better name for this
type VectorManifold interface {
	VectorReadWriter
	VectorManifold() event.VectorManifold

	// TODO find a different way to expose these details
	SQLiteTable() string
	SQLiteColumn() string
	SQLiteDistanceFunction() string
}

type VectorManifoldCache struct {
	cache  map[event.ID]VectorManifold
	source VectorManifoldResolver
}

func NewVectorManifoldCache(source VectorManifoldResolver) VectorManifoldResolver {
	return &VectorManifoldCache{
		cache:  map[event.ID]VectorManifold{},
		source: source,
	}
}

func (r *VectorManifoldCache) ResolveVectorManifold(ctx context.Context, id event.ID) (VectorManifold, error) {
	vr := r.cache[id]
	if vr != nil {
		return vr, nil
	}

	vr, err := r.source.ResolveVectorManifold(ctx, id)
	if err != nil {
		return nil, err
	}
	r.cache[id] = vr

	return vr, nil
}

// Serializes a float32 list into a vector BLOB that sqlite-vec accepts.
func MarshalFloat32(vector []float32) []byte {
	b := make([]byte, len(vector)*4)
	_, err := binary.Encode(b, binary.LittleEndian, vector)
	if err != nil {
		panic(err)
	}
	return b
}

func UnmarshalFloat32(b []byte) ([]float32, error) {
	target := make([]float32, len(b)/4)
	_, err := binary.Decode(b, binary.LittleEndian, &target)
	return target, err
}

type VectorStore struct {
	Table    string
	Manifold event.VectorManifold
	Querier  db.Querier

	singleVectorQuery string
}

func (r *VectorStore) Initialize() {
	r.singleVectorQuery = fmt.Sprintf(`SELECT vec from %q WHERE rowid = ? LIMIT 1`, r.Table)
}

func (r *VectorStore) VectorManifold() event.VectorManifold {
	return r.Manifold
}

func (r *VectorStore) SQLiteTable() string {
	return r.Table
}

func (r *VectorStore) SQLiteColumn() string {
	return "vec"
}

func (r *VectorStore) SQLiteDistanceFunction() string {
	return "vec_distance_" + r.Manifold.Metric
}

func (r *VectorStore) ReadVector(ctx context.Context, vectorID int64) (*event.Vector[float32], error) {
	rows, err := r.Querier.QueryContext(ctx, r.singleVectorQuery, vectorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// this is an unknown manifold id
	if !rows.Next() {
		err = rows.Err()
		if err != nil {
			return nil, fmt.Errorf("missing vector data in table: %s id: %d", r.Table, vectorID, err)
		}

		return nil, fmt.Errorf("missing vector data in table: %s id: %d", r.Table, vectorID)
	}

	var vectorData sql.RawBytes
	err = rows.Scan(&vectorData)
	if err != nil {
		return nil, err
	}

	vec := &event.Vector[float32]{
		Manifold: &r.Manifold,
	}
	vec.Data, err = UnmarshalFloat32([]byte(vectorData))
	return vec, err
}

func (v *VectorStore) WriteVector(ctx context.Context, tx db.Tx, data []float32) (int64, error) {
	b := MarshalFloat32(data)
	r, err := tx.ExecContext(ctx, fmt.Sprintf(`INSERT INTO %q (vec) VALUES (?)`, v.Table), b)
	if err != nil {
		return 0, err
	}
	return r.LastInsertId()
}

type VectorManifoldStore struct {
	Querier db.Querier
}

var _ VectorManifoldWriter = (*VectorManifoldStore)(nil)
var _ VectorManifoldResolver = (*VectorManifoldStore)(nil)

func (v *VectorManifoldStore) WriteVectorManifold(ctx context.Context, tx db.Executor, vm *event.VectorManifold) error {
	slog.Info("WriteVectorManifold", "manifold", vm)

	table := EventVectorManifoldTableName(vm.ID)

	_, err := tx.ExecContext(ctx, fmt.Sprintf(createEventVectorDataTable, table))
	if err != nil {
		return fmt.Errorf("create event vector table, %q: %w", createEventVectorDataTable, err)
	}

	_, err = tx.ExecContext(ctx, `INSERT INTO "event_vector_manifolds" (id, "table", dtype, dimensions, metric) VALUES (?, ?, ?, ?, ?)`,
		vm.ID,
		table,
		vm.DType,
		vm.Dimensions,
		vm.Metric,
	)
	return err
}

func (r *VectorManifoldStore) ResolveVectorManifold(ctx context.Context, id event.ID) (VectorManifold, error) {
	rows, err := r.Querier.QueryContext(ctx, `SELECT "table", dtype, dimensions, metric from "event_vector_manifolds" WHERE id = ? LIMIT 1`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// this is an unknown manifold id
	if !rows.Next() {
		err = rows.Err()
		if err != nil {
			return nil, fmt.Errorf("unknown vector manifold id: %s: %w", id.String(), err)
		}

		return nil, fmt.Errorf("unknown vector manifold id: %s", id.String())
	}

	vm := &event.VectorManifold{
		ID: id,
	}
	var table string
	err = rows.Scan(&table, &vm.DType, &vm.Dimensions, &vm.Metric)
	if err != nil {
		return nil, err
	}

	vs := &VectorStore{
		Table:    table,
		Manifold: *vm,
		Querier:  r.Querier,
	}
	vs.Initialize()

	return vs, nil
}
