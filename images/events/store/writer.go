package store

import (
	"context"
	"crypto/sha256"
	"hash"
	"log/slog"
	"sync"
	"time"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type LatestMaxID event.ID

func (id LatestMaxID) ID() event.ID {
	return event.ID(id)
}

type EventStoreAlarm struct {
	Time time.Time
	ID   event.ID
}

type Writer struct {
	EventDataWriter      EventDataWriter
	VectorManifoldWriter VectorManifoldWriter

	EventDataSource        EventDataSource
	VectorManifoldResolver VectorManifoldResolver

	LatestMaxIDNotifiers []notify.Notifier[LatestMaxID]

	Txer db.Txer

	newDigester func() hash.Hash

	nextAlarmMu sync.Mutex
	nextAlarm   *EventStoreAlarm

	EventIDSource EventStoreIDSource
}

var _ event.Writer = (*Writer)(nil)
var _ notify.Notifier[db.Ready[db.Txer]] = (*Writer)(nil)

func (es *Writer) Initialize() {
	es.newDigester = sha256.New
}

func (es *Writer) Notify(ctx context.Context, init db.Ready[db.Txer]) {
	es.initializeDB(context.Background(), init.Ready)
}

func (es *Writer) initializeDB(ctx context.Context, txer db.Txer) error {
	return txer.Tx(ctx, func(tx db.Tx) error {
		triggerTx := &TriggerTx{
			Tx:                     tx,
			VectorManifoldResolver: NewVectorManifoldCache(es.VectorManifoldResolver),
		}
		querier := es.querierForTx(tx)

		err := triggerTx.CreateTables(ctx)
		if err != nil {
			return err
		}

		maxID, err := querier.QueryMaxID(ctx)
		if err != nil {
			return err
		}

		triggers, err := QueryReactionQueryTriggers(ctx, querier, maxID)
		if err != nil {
			return err
		}

		for _, trigger := range triggers {
			if trigger.Err != nil {
				slog.Info("ignoring invalid trigger", "err", trigger.Err, "id", trigger.ID)
				continue
			}

			err := triggerTx.Create(ctx, trigger)
			if err != nil {
				return err
			}
		}

		return nil
	})
}

func (es *Writer) querierForTx(tx db.Tx) *Querier {
	return &Querier{
		DBQuerier:              tx,
		EventDataSource:        es.EventDataSource,
		VectorManifoldResolver: es.VectorManifoldResolver,
	}
}

func (es *Writer) WriteEvents(ctx context.Context,
	since event.ID,
	set *event.PendingEventSet,
	cb event.WriteNotifyFunc) error {

	var lastMaxID *event.ID
	err := es.Txer.Tx(ctx, func(tx db.Tx) error {
		querier := es.querierForTx(tx)
		wtx := &WriteTx{
			NewDigester:  es.newDigester,
			NextIDSource: es.EventIDSource,

			Tx:      tx,
			Querier: querier,

			EventDataWriter:        es.EventDataWriter,
			VectorManifoldWriter:   es.VectorManifoldWriter,
			VectorManifoldResolver: NewVectorManifoldCache(es.VectorManifoldResolver),

			Since: since,
			NotifyWrite: func(i int, id event.ID, dataSize int64, dataSha256 []byte) {
				lastMaxID = &id
			},
		}
		err := wtx.Begin(ctx, set)
		if err != nil {
			return err
		}

		// query next alarm if we wrote anything
		if lastMaxID != nil {
			if trigger, ok, err := QueryNextReactionAlarmTrigger(ctx, querier, *lastMaxID); err != nil {
				return err
			} else if ok {
				es.resetAlarm(trigger.Alarm, trigger.ID)
			}
		}

		return nil
	})

	if err != nil {
		return err
	}

	if lastMaxID != nil {
		notify.Notify(ctx, es.LatestMaxIDNotifiers, LatestMaxID(*lastMaxID))
	}
	return nil
}

func (es *Writer) resetAlarm(alarm time.Time, id event.ID) {
	slog.Info("todo resetAlarm", "alarm", alarm, "id", id)

	// todo
	// es.nextAlarmMu.Lock()
	// defer es.nextAlarmMu.Unlock()

	// delay := max(0, alarm.Sub(time.Now()))
	// es.nextAlarm = time.AfterFunc(delay, func() {
	// 	reactionrun.RunID(ctx, querier, id)
	// })
}
