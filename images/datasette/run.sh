#!/bin/sh

: ${PORT:=8080}
: ${HOST:='0.0.0.0'}

export PORT
export HOST

: ${SUBSTRATE_LENS_PARAM_db:=db.sqlite}
: ${DATASETTE_DB:=/spaces/data/$SUBSTRATE_LENS_PARAM_db}

exec datasette serve -p $PORT --host $HOST $DATASETTE_DB
