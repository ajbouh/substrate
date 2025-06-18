package store

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type TriggerTx struct {
	Tx db.Tx

	VectorManifoldResolver VectorManifoldResolver
}

func (wtx *TriggerTx) execExpr(ctx context.Context, expr db.Expr) error {
	stmt, values := db.Render(expr)
	_, err := wtx.Tx.ExecContext(ctx, stmt, values...)
	return err
}

func (tx *TriggerTx) CreateTables(ctx context.Context) error {
	tables := []string{
		dropReactionTriggerTable,
		createReactionTriggerTable,
		dropReactionTriggerShadowTable,
		createReactionTriggerShadowTable,
	}
	for _, table := range tables {
		_, err := tx.Tx.ExecContext(ctx, table)
		if err != nil {
			return fmt.Errorf("error running sql %q: %w", table, err)
		}
	}
	return nil
}

func (tx *TriggerTx) ClearNotifications(ctx context.Context) error {
	_, err := tx.Tx.ExecContext(ctx, dropReactionTriggerTableRows)
	return err
}

func (tx *TriggerTx) ReadNotifications(ctx context.Context) ([]event.ID, error) {
	rows, err := tx.Tx.QueryContext(ctx, selectReactionTriggerTableRows)
	if err != nil {
		return nil, err
	}

	var ids []event.ID
	defer rows.Close()

	for rows.Next() {
		var idBytes sql.RawBytes
		err := rows.Scan(&idBytes)
		if err != nil {
			return nil, err
		}

		var id event.ID
		err = id.Scan(string(idBytes))
		if err != nil {
			return nil, err
		}

		ids = append(ids, id)
	}
	return ids, nil
}

func (tx *TriggerTx) ConsumeNotifications(ctx context.Context) ([]event.ID, error) {
	ids, err := tx.ReadNotifications(ctx)
	if err != nil {
		return ids, err
	}
	err = tx.ClearNotifications(ctx)
	return ids, err
}

func (tx *TriggerTx) Notify(ctx context.Context, id event.ID, fpk event.FingerprintKey) error {
	return tx.execExpr(ctx, renderInsertReactionNotification(id, fpk))
}

func (tx *TriggerTx) Create(ctx context.Context, trigger Trigger) error {
	if trigger.ShadowsFingerprintKey != nil || trigger.ShadowsID != nil {
		shadowExpr := renderInsertReactionShadow(trigger.ID, *trigger.ShadowsID, *trigger.ShadowsFingerprintKey)
		if err := tx.execExpr(ctx, shadowExpr); err != nil {
			return err
		}
	}

	triggerExpr, err := renderCreateEventTrigger(ctx, tx.VectorManifoldResolver, trigger)
	if err != nil {
		return err
	}

	return tx.execExpr(ctx, triggerExpr)
}

func (tx *TriggerTx) Drop(ctx context.Context, fpk event.FingerprintKey) error {
	err := tx.execExpr(ctx, renderDeleteReactionShadow(fpk))
	if err != nil {
		return err
	}

	return tx.execExpr(ctx, renderDropEventTrigger(fpk))
}
