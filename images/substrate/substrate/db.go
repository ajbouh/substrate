package substrate

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
)

func CreateTables(ctx context.Context, db *sql.DB) error {
	tables := []string{
		createActivitiesTable,
		createEventsTable,
		createSpacesTable,
		createCollectionMembershipsTable,
	}

	for _, table := range tables {
		_, err := db.ExecContext(ctx, table)
		if err != nil {
			return wrapSQLError(err, table)
		}
	}
	return nil
}

const activitiesTable = "activities"

// DROP TABLE IF EXISTS "activities";
const createActivitiesTable = `CREATE TABLE IF NOT EXISTS "activities" (activityspec TEXT, owner TEXT, created_at_us INTEGER, service TEXT, PRIMARY KEY (activityspec));`

type ActivityWhere struct {
	ActivitySpec *string `json:"activityspec,omitempty"`
	Service      *string `json:"service,omitempty"`
}

type ActivityListRequest struct {
	ActivityWhere
	Limit   *Limit
	OrderBy *OrderBy
}

type Activity struct {
	ActivitySpec string    `json:"activityspec"`
	CreatedAt    time.Time `json:"created_at"`
	Service      string    `json:"service"`
}

func (s *Substrate) WriteActivity(ctx context.Context, Activity *Activity) error {
	return s.dbExecContext(ctx, `INSERT INTO "activities" (activityspec, created_at_us, service) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`,
		Activity.ActivitySpec, Activity.CreatedAt.UnixMicro(), Activity.Service)
}

func (q *ActivityWhere) AppendWhere(query *Query) bool {
	modified := false
	if q.Service != nil {
		query.Where = append(query.Where, activitiesTable+".service = ?")
		query.WhereValues = append(query.WhereValues, *q.Service)
		modified = true
	}
	if q.ActivitySpec != nil {
		query.Where = append(query.Where, activitiesTable+".activityspec = ?")
		query.WhereValues = append(query.WhereValues, *q.ActivitySpec)
		modified = true
	}

	if modified {
		query.FromTablesNamed[activitiesTable] = activitiesTable
	}
	return modified
}

func (s *Substrate) ListActivities(ctx context.Context, request *ActivityListRequest) ([]*Activity, error) {
	query := &Query{
		Select:          []string{`activityspec`, `created_at_us`, `service`},
		FromTablesNamed: map[string]string{activitiesTable: activitiesTable},
		WherePredicates: map[string]bool{},
		Limit:           request.Limit,
		OrderBy:         request.OrderBy,
		OrderByColumn:   activitiesTable + ".created_at_us",
	}

	request.AppendWhere(query)

	s.Mu.RLock()
	defer s.Mu.RUnlock()

	q, values := query.Render()
	rows, err := s.dbQueryContext(ctx, q, values...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := []*Activity{}
	for rows.Next() {

		var o Activity
		var createdAt int64
		err := rows.Scan(&o.ActivitySpec, &createdAt, &o.Service)
		if err != nil {
			return nil, err
		}
		o.CreatedAt = time.UnixMicro(createdAt)

		results = append(results, &o)
	}

	return results, rows.Err()
}

type SpaceListingPatch struct {
	ID string `json:"id"`

	Owner *string `json:"owner,omitempty"`
	Alias *string `json:"alias,omitempty"`
}

type SpaceWhere struct {
	Owner         *string
	Alias         *string
	ID            *string
	ForkedFromID  *string
	ForkedFromRef *string

	CollectionMembership *CollectionMembershipWhere
}

type SpaceListQuery struct {
	SpaceWhere

	SelectNestedCollections *CollectionMembershipWhere

	Limit   *Limit
	OrderBy *OrderBy
}

type Space struct {
	Owner string `json:"owner"`
	Alias string `json:"alias"`
	ID    string `json:"space"`

	CreatedAt     time.Time `json:"created_at"`
	ForkedFromID  *string   `json:"forked_from_id,omitempty"`
	ForkedFromRef *string   `json:"forked_from_ref,omitempty"`

	Memberships []*SpaceCollectionMembership `json:"memberships"`
}

type SpaceCollectionMembership struct {
	CollectionOwner string `json:"collection_owner"`
	CollectionName  string `json:"collection_name"`
	CollectionLabel string `json:"collection_label"`

	CollectionAttributes map[string]any `json:"collection_attributes"`
	CollectionIsPublic   bool           `json:"collection_public"`

	Attributes map[string]any `json:"attributes"`
	IsPublic   bool           `json:"public"`
}

type EventWhere struct {
	ActivitySpec *string `json:"viewspec,omitempty"`
	User         *string `json:"user,omitempty"`
	Service      *string `json:"service,omitempty"`
	Type         *string `json:"type,omitempty"`
}

type EventListRequest struct {
	EventWhere
	Limit   *Limit
	OrderBy *OrderBy
}

type Event struct {
	// DockerSpawn  *dockerprovisioner.SpawnEvent  `json:"docker_spawn,omitempty"`
	// DockerStatus *dockerprovisioner.StatusEvent `json:"docker_status,omitempty"`

	Response *activityspec.ActivitySpawnResponse

	ID           string    `json:"id"`
	ActivitySpec string    `json:"viewspec,omitempty"`
	URLPrefix    string    `json:"urlprefix,omitempty"`
	User         string    `json:"user"`
	Service      string    `json:"service"`
	Type         string    `json:"type"`
	Timestamp    time.Time `json:"ts"`
}

const eventsTable = "events"

// DROP TABLE IF EXISTS "events";
const createEventsTable = `CREATE TABLE IF NOT EXISTS "events" (id TEXT, viewspec TEXT, ts TEXT, type TEXT, user TEXT, service TEXT, event TEXT, PRIMARY KEY (id));`

func (s *Substrate) WriteEvent(ctx context.Context, event *Event) error {
	b, err := json.Marshal(event)
	if err != nil {
		return err
	}

	return s.dbExecContext(ctx, `INSERT INTO "events" (id, viewspec, ts, type, user, service, event) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		event.ID, event.ActivitySpec, event.Timestamp, event.Type, event.User, event.Service, string(b))
}

func (q *EventWhere) AppendWhere(query *Query) bool {
	modified := false
	if q.Service != nil {
		query.Where = append(query.Where, eventsTable+".service = ?")
		query.WhereValues = append(query.WhereValues, *q.Service)
		modified = true
	}
	if q.User != nil {
		query.Where = append(query.Where, eventsTable+".user = ?")
		query.WhereValues = append(query.WhereValues, *q.User)
		modified = true
	}
	if q.ActivitySpec != nil {
		query.Where = append(query.Where, eventsTable+".viewspec = ?")
		query.WhereValues = append(query.WhereValues, *q.ActivitySpec)
		modified = true
	}
	if q.Type != nil {
		query.Where = append(query.Where, eventsTable+".type = ?")
		query.WhereValues = append(query.WhereValues, *q.Type)
		modified = true
	}

	if modified {
		query.FromTablesNamed[eventsTable] = eventsTable
	}
	return modified
}

func (s *Substrate) ListEvents(ctx context.Context, request *EventListRequest) ([]*Event, error) {
	query := &Query{
		Select:          []string{`event`},
		FromTablesNamed: map[string]string{eventsTable: eventsTable},
		WherePredicates: map[string]bool{},
		Limit:           request.Limit,
		OrderBy:         request.OrderBy,
		OrderByColumn:   eventsTable + ".ts",
	}

	request.AppendWhere(query)

	s.Mu.RLock()
	defer s.Mu.RUnlock()

	q, values := query.Render()
	rows, err := s.dbQueryContext(ctx, q, values...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := []*Event{}
	for rows.Next() {
		var b []byte
		err := rows.Scan(&b)
		if err != nil {
			return nil, err
		}
		var o Event
		err = json.Unmarshal(b, &o)
		if err != nil {
			return nil, err
		}
		results = append(results, &o)
	}

	return results, rows.Err()
}

func (e *Event) SpawnResult() (*activityspec.ActivitySpawnResponse, error) {
	asr, err := activityspec.ParseActivitySpecRequest(e.ActivitySpec, false, e.URLPrefix)
	if err != nil {
		return nil, err
	}

	r := e.Response.ServiceSpawnResponse

	pathURL, err := url.Parse(asr.Path)
	if err != nil {
		return nil, err
	}

	return &activityspec.ActivitySpawnResponse{
		ActivitySpec: e.ActivitySpec,

		Path:    asr.Path,
		PathURL: pathURL,

		ServiceSpawnResponse: r,
	}, nil
}

const spacesTable = "spaces"
const createSpacesTable = `CREATE TABLE IF NOT EXISTS "spaces" (id TEXT, owner TEXT, alias TEXT, created_at_us INTEGER, deleted_at_us TEXT, forked_from_id TEXT, forked_from_ref TEXT, PRIMARY KEY (id), FOREIGN KEY (forked_from_id) REFERENCES spaces(id));`

func (s *Substrate) WriteSpace(ctx context.Context, space *Space) error {
	return s.dbExecContext(ctx, `INSERT INTO "spaces" (id, owner, alias, created_at_us, forked_from_id, forked_from_ref) VALUES (?, ?, ?, ?, ?, ?)`,
		space.ID, space.Owner, space.Alias, space.CreatedAt.UnixMicro(), space.ForkedFromID, space.ForkedFromRef)
}

func (w *CollectionMembershipWhere) AppendWhere(query *Query) bool {
	modified := false

	if w.IsPublic != nil {
		query.Where = append(query.Where, collectionMembershipsTable+".is_public = ?")
		query.WhereValues = append(query.WhereValues, *w.IsPublic)
		modified = true
	}

	if w.HasSpaceID {
		query.Where = append(query.Where,
			collectionMembershipsTable+".space_id NOT NULL",
			collectionMembershipsTable+".space_id != ''",
		)
		modified = true
	}

	if w.SpaceID != nil {
		query.Where = append(query.Where, collectionMembershipsTable+".space_id = ?")
		query.WhereValues = append(query.WhereValues, *w.SpaceID)
		modified = true
	}

	if w.ServiceSpec != nil {
		query.Where = append(query.Where, collectionMembershipsTable+".servicespec = ?")
		query.WhereValues = append(query.WhereValues, *w.ServiceSpec)
		modified = true
	}

	if w.HasServiceSpec {
		query.Where = append(query.Where,
			collectionMembershipsTable+".servicespec NOT NULL",
			collectionMembershipsTable+".servicespec != ''",
		)
		modified = true
	}

	if w.Service != nil {
		query.Where = append(query.Where,
			"("+collectionMembershipsTable+".servicespec = ? OR "+collectionMembershipsTable+".servicespec LIKE ?)")
		query.WhereValues = append(query.WhereValues, *w.Service, *w.Service+"[%")
		modified = true
	}

	if w.Name != nil {
		query.Where = append(query.Where, collectionMembershipsTable+".collection_name = ?")
		query.WhereValues = append(query.WhereValues, *w.Name)
		modified = true
	}

	if w.NamePrefix != nil {
		query.Where = append(query.Where, collectionMembershipsTable+".collection_name LIKE ?")
		query.WhereValues = append(query.WhereValues, *w.NamePrefix+"%")
		modified = true
	}

	if w.Owner != nil {
		query.Where = append(query.Where, collectionMembershipsTable+".collection_owner = ?")
		query.WhereValues = append(query.WhereValues, *w.Owner)
		modified = true
	}

	if modified {
		query.FromTablesNamed[collectionMembershipsTable] = collectionMembershipsTable
	}

	return modified
}

func (w *SpaceWhere) AppendWhere(query *Query) bool {
	modified := false

	if w.Owner != nil {
		query.Where = append(query.Where, spacesTable+".owner = ?")
		query.WhereValues = append(query.WhereValues, *w.Owner)
	}
	if w.Alias != nil {
		query.Where = append(query.Where, spacesTable+".alias = ?")
		query.WhereValues = append(query.WhereValues, *w.Alias)
	}
	if w.ID != nil {
		query.Where = append(query.Where, spacesTable+".id = ?")
		query.WhereValues = append(query.WhereValues, *w.ID)
	}
	if w.ForkedFromID != nil {
		query.Where = append(query.Where, spacesTable+".forked_from_id = ?")
		query.WhereValues = append(query.WhereValues, *w.ForkedFromID)
	}
	if w.ForkedFromRef != nil {
		query.Where = append(query.Where, spacesTable+".forked_from_ref = ?")
		query.WhereValues = append(query.WhereValues, *w.ForkedFromRef)
	}

	if w.CollectionMembership != nil {
		if w.CollectionMembership.AppendWhere(query) {
			modified = true
			query.WherePredicates[spacesTable+".id = collection_memberships.space_id"] = true
		}
	}

	if modified {
		query.FromTablesNamed[spacesTable] = spacesTable
	}

	return modified
}

func (s *Substrate) PatchSpace(ctx context.Context, patch *SpaceListingPatch) error {
	set := []string{}
	values := []any{}
	if patch.Owner != nil {
		set = append(set, `owner = ?`)
		values = append(values, *patch.Owner)
	}
	if patch.Alias != nil {
		// TODO need to update substratefs entry too!
		set = append(set, `alias = ?`)
		values = append(values, *patch.Alias)
	}
	query := []string{
		`UPDATE "spaces" SET`, strings.Join(set, ", "), "WHERE id = ?",
	}
	values = append(values, patch.ID)

	return s.dbExecContext(ctx, strings.Join(query, ""), values...)
}

func (s *Substrate) DeleteSpace(ctx context.Context, request *SpaceWhere) error {
	query := &Query{
		Preamble:        []string{`DELETE`},
		FromTablesNamed: map[string]string{spacesTable: spacesTable},
		WherePredicates: map[string]bool{},
	}
	request.AppendWhere(query)

	q, values := query.Render()
	return s.dbExecContext(ctx, q, values...)
}

func (s *Substrate) ListSpaces(ctx context.Context, request *SpaceListQuery) ([]*Space, error) {
	query := &Query{
		Select:          []string{"id", "owner", "alias", "created_at_us", "forked_from_id", "forked_from_ref"},
		FromTablesNamed: map[string]string{spacesTable: spacesTable},
		WherePredicates: map[string]bool{},
		OrderByColumn:   "created_at",
		OrderBy:         request.OrderBy,
		Limit:           request.Limit,
	}
	if request.SelectNestedCollections != nil {
		rootAlias := "root"
		nested := &Query{
			// Select: []string{`json_group_array(json(collection_memberships.membership))`},
			// FromTablesNamed: map[string]string{
			// 	collectionMembershipsTable: collectionMembershipsTable,
			// },
			// WherePredicates: map[string]bool{
			// 	spacesTable + ".id = " + collectionMembershipsTable + ".space_id": true,
			// },

			Select: []string{`json_group_array(json_object('root', json(root.membership), 'space', json(collection_memberships.membership)))`},
			FromTablesNamed: map[string]string{
				collectionMembershipsTable: collectionMembershipsTable,
			},
			LeftJoin: []string{
				collectionMembershipsTable + " " + rootAlias + " ON",
				rootAlias + ".collection_name = " + collectionMembershipsTable + ".collection_name", "AND",
				rootAlias + ".collection_owner = " + collectionMembershipsTable + ".collection_owner", "AND",
				rootAlias + ".space_id IS NULL", "AND",
				rootAlias + ".servicespec IS NULL",
			},
			WherePredicates: map[string]bool{
				spacesTable + ".id = " + collectionMembershipsTable + ".space_id": true,
			},
		}
		request.SelectNestedCollections.AppendWhere(nested)

		// TODO define an "AppendSelect"
		nestedQuery, nestedValues := nested.Render()
		query.SelectValues = append(query.SelectValues, nestedValues...)
		query.Select = append(query.Select, "("+nestedQuery+") as collections")
	} else {
		query.Select = append(query.Select, "null as collections")
	}
	request.AppendWhere(query)

	q, values := query.Render()

	s.Mu.RLock()
	defer s.Mu.RUnlock()

	rows, err := s.dbQueryContext(ctx, q, values...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := []*Space{}
	for rows.Next() {
		var o Space
		var createdAt int64
		var collectionsJSONB []byte
		err := rows.Scan(&o.ID, &o.Owner, &o.Alias, &createdAt, &o.ForkedFromID, &o.ForkedFromRef, &collectionsJSONB)
		if err != nil {
			return nil, err
		}
		o.CreatedAt = time.UnixMicro(createdAt)

		if collectionsJSONB != nil {
			// memberships := []*CollectionMembership{}
			// err = json.Unmarshal(collectionsJSONB, &memberships)
			// if err != nil {
			// 	return nil, err
			// }

			// o.Memberships = make([]*SpaceCollectionMembership, 0, len(memberships))
			// for _, membership := range memberships {
			// 	scm := &SpaceCollectionMembership{
			// 		CollectionOwner: membership.Owner,
			// 		CollectionName:  membership.Name,
			// 		Attributes:      membership.Attributes,
			// 		IsPublic:        membership.IsPublic,
			// 	}
			// 	o.Memberships = append(o.Memberships, scm)
			// }

			memberships := []struct {
				Root  *CollectionMembership `json:"root"`
				Space *CollectionMembership `json:"space"`
			}{}
			err = json.Unmarshal(collectionsJSONB, &memberships)
			if err != nil {
				return nil, err
			}

			o.Memberships = make([]*SpaceCollectionMembership, 0, len(memberships))
			for _, membership := range memberships {
				scm := &SpaceCollectionMembership{
					CollectionOwner: membership.Space.Owner,
					CollectionName:  membership.Space.Name,
					Attributes:      membership.Space.Attributes,
					IsPublic:        membership.Space.IsPublic,
				}
				if membership.Root != nil {
					scm.CollectionLabel = "???"
					scm.CollectionAttributes = membership.Root.Attributes
					scm.CollectionIsPublic = membership.Root.IsPublic
				}
				o.Memberships = append(o.Memberships, scm)
			}
		}
		results = append(results, &o)
	}

	return results, rows.Err()
}

const collectionMembershipsTable = "collection_memberships"

// DROP TABLE IF EXISTS "collection_memberships";
const createCollectionMembershipsTable = `CREATE TABLE IF NOT EXISTS "collection_memberships" (collection_owner TEXT, collection_name TEXT, space_id TEXT, servicespec TEXT, created_at_us INTEGER, updated_at_us INTEGER, deleted_at_us INTEGER, membership TEXT, is_public INTEGER, PRIMARY KEY (collection_owner, collection_name, space_id, servicespec), FOREIGN KEY (space_id) REFERENCES space(id));`

type Collection struct {
	Owner string `json:"owner"`
	Name  string `json:"name"`

	Label      string         `json:"label"`
	Attributes map[string]any `json:"attributes"`
	IsPublic   bool           `json:"public"`

	Root *CollectionMember `json:"-"`

	// TODO make this a separate list of services and spaces
	Members []*CollectionMember `json:"members"`
}

func findAndRemoveRootMember(members []*CollectionMember) (*CollectionMember, []*CollectionMember) {
	// Loop over members, find nil space/servicespec, call it root, copy values
	var root *CollectionMember
	index := 0
	for _, member := range members {
		if member.ServiceSpec != "" || member.SpaceID != "" {
			members[index] = member
			index++
		} else {
			root = member
		}
	}

	members = members[:index]
	return root, members
}

func (c *Collection) normalize() {
	// Loop over members, find nil space/servicespec, call it root, copy values
	c.Root, c.Members = findAndRemoveRootMember(c.Members)

	var label string
	if c.Root != nil {
		c.Attributes = c.Root.Attributes
		c.IsPublic = c.Root.IsPublic

		label = c.Attributes["system:ui:label"].(string)
	} else {
		c.Attributes = map[string]any{}

		switch c.Name {
		case "user:favories":
			c.IsPublic = true
		}
	}

	if label == "" {
		switch c.Name {
		case "user:starred":
			label = "Starred"
		default:
			label = c.Name
		}
	}
	c.Label = label

	fmt.Printf("collection.normalize() %#v\n", c)
}

type CollectionMember struct {
	SpaceID     string    `json:"space,omitempty"`
	ServiceSpec string    `json:"servicespec,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	// DeletedAt time.Time
	// UpdatedAt time.Time
	IsPublic bool `json:"public"`

	Attributes map[string]any `json:"attributes,omitempty"`
}

type CollectionMembership struct {
	Owner string `json:"owner"`
	Name  string `json:"name"`

	SpaceID     string    `json:"space,omitempty"`
	ServiceSpec string    `json:"servicespec,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	// DeletedAt time.Time
	// UpdatedAt time.Time
	IsPublic bool `json:"public"`

	Attributes map[string]any `json:"attributes,omitempty"`
}

type CollectionMembershipWhere struct {
	Owner      *string
	Name       *string
	NamePrefix *string
	IsPublic   *bool

	HasSpaceID bool
	SpaceID    *string

	HasServiceSpec bool
	Service        *string
	ServiceSpec    *string
}

type CollectionListQuery struct {
	CollectionMembershipWhere
	Limit *Limit
}

type CollectionMembershipListQuery struct {
	CollectionMembershipWhere
	Limit   *Limit
	OrderBy *OrderBy
}

func (s *Substrate) ListCollections(ctx context.Context, request *CollectionListQuery) ([]*Collection, error) {
	query := &Query{
		Preamble:        []string{`SELECT DISTINCT collection_memberships.collection_owner, collection_memberships.collection_name, json_group_array(json(collection_memberships.membership))`},
		FromTablesNamed: map[string]string{collectionMembershipsTable: collectionMembershipsTable},
		WherePredicates: map[string]bool{},
		GroupBy:         []string{collectionMembershipsTable + ".collection_owner", collectionMembershipsTable + ".collection_name"},
		Limit:           request.Limit,
	}
	request.AppendWhere(query)

	q, values := query.Render()
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	rows, err := s.dbQueryContext(ctx, q, values...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := []*Collection{}
	for rows.Next() {
		var o Collection
		var collectionsJSONB []byte
		err := rows.Scan(&o.Owner, &o.Name, &collectionsJSONB)
		if err != nil {
			return nil, err
		}
		if collectionsJSONB != nil {
			err = json.Unmarshal(collectionsJSONB, &o.Members)
			if err != nil {
				return nil, err
			}
		}

		// Find root and clean it up.
		o.normalize()

		results = append(results, &o)
	}

	return results, rows.Err()
}

func (s *Substrate) WriteCollectionMembership(ctx context.Context, membership *CollectionMembership) error {
	b, err := json.Marshal(membership)
	if err != nil {
		return err
	}

	return s.dbExecContext(ctx, `INSERT INTO "collection_memberships" (collection_owner, collection_name, space_id, servicespec, created_at_us, is_public, membership) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT DO UPDATE SET collection_owner=excluded.collection_owner, collection_name=excluded.collection_name, space_id=excluded.space_id, servicespec=excluded.servicespec, is_public=excluded.is_public, membership=excluded.membership`,
		membership.Owner, membership.Name, membership.SpaceID, membership.ServiceSpec, membership.CreatedAt.UnixMicro(), membership.IsPublic, string(b))
}

func (s *Substrate) DeleteCollectionMembership(ctx context.Context, request *CollectionMembershipWhere) error {
	query := &Query{
		Preamble:        []string{`DELETE`},
		FromTablesNamed: map[string]string{collectionMembershipsTable: collectionMembershipsTable},
		WherePredicates: map[string]bool{},
	}
	request.AppendWhere(query)

	q, values := query.Render()
	return s.dbExecContext(ctx, q, values...)
}
