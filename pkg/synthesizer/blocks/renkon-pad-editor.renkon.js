// Based on bootstrap in renkon-pad/index.html
const bootstrapModules = Behaviors.resolvePart({
    pad: import("./blocks/renkon-pad/pad.js"),
    padExtenions: import("./blocks/renkon-pad/pad-extensions.js"),
});

// it would be better if we could load these simultaneously, but renkon-pad doesn't export "getFunctionBody", so we can't
// use setupProgram directly and Renkon.merge only accepts one function. A consequence of this is the editor initially thinks
// there is no data to load and shows the "default program".
Renkon.merge(bootstrapModules.pad.pad);
Renkon.merge(bootstrapModules.padExtenions.extensions);
