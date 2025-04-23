// http://localhost:9998/?host=substrate-b95b.local&proto=https&recordstore=https://substrate-b95b.local/events;data=substrate-bootstrap-dev

const ready = Events.receiver();

const surfaceName = (() => {
    const url = new URL(baseURI);
    return url.searchParams.get("surface") || 'default.surface';
})();

const key = "bootstrap"
const surfacePath = `/surfaces/${surfaceName}`

const bootstrapSurfaceStart = surfaceStarter.start({path: surfacePath})

const querysetUpdated = Events.collect(undefined,
    ready, (now, _) => bootstrapSurfaceStart.queryset,
);

const newSurfaceRequest = Events.collect(undefined, recordsUpdated, (now, {surface: {incremental, records}={}}) => records ? records.length === 0 : undefined);
((newSurfaceRequest) => {
    newSurfaceRequest && Events.send(recordsWrite, bootstrapSurfaceStart.write)
})(newSurfaceRequest);
console.log({newSurfaceRequest});

/* globals Events Behaviors Renkon */
