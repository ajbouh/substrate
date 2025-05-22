export function pad() {
    // Initialization

    const {h, html, render} = import("./preact.standalone.module.js");

    const renkon = (() => {
        const renkon = document.createElement("div");
        renkon.id = "renkon";
        renkon.innerHTML = `
<div id="buttonBox">
   <input class="menuButton" id="padTitle"></input>
   <button class="menuButton" id="addCodeButton">code</button>
   <button class="menuButton" id="addRunnerButton">runner</button>
   <div class="spacer"></div>
   <button class="menuButton" id="showGraph">show graph</button>
   <button class="menuButton" id="saveButton">save</button>
   <button class="menuButton" id="loadButton">load</button>
</div>
<div id="pad"><div id="mover"></div></div>
<div id="overlay"></div>
<div id="navigationBox">
   <div class="navigationButton"><div id="homeButton" class="navigationButtonImage"></div></div>
   <div class="navigationButton with-border"><div id="zoomInButton" class="navigationButtonImage"></div></div>
   <div class="navigationButton with-border"><div id="zoomOutButton" class="navigationButtonImage"></div></div>
</div>

`.trim();

        document.body.querySelector("#renkon")?.remove();
        document.body.appendChild(renkon);
        return renkon;
    })();

    // Stringify

    /*
  Copyright 2020 Croquet Corporation.
  Copyright 2025 Yoshiki Ohshima

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

    function stringifyInner(node, seen) {
        if (node === undefined) return undefined;
        if (typeof node === 'number') return Number.isFinite(node) ? `${node}` : 'null';
        if (typeof node !== 'object') return JSON.stringify(node, null, 4);

        let out;
        if (Array.isArray(node)) {
            out = '[';
            for (let i = 0; i < node.length; i++) {
                if (i > 0) out += ',';
                out += stringifyInner(node[i], seen) || 'null';
            }
            return out + ']';
        }

        if (node === null) return 'null';

        if (seen.has(node)) {
            throw new TypeError('Converting circular structure to JSON');
        }

        seen.add(node);

        if (node.constructor === window.Map) {
            let replacement = {__map: true, values: [...node]};
            return stringifyInner(replacement, seen);
        }

        if (node.constructor === window.Set) {
            let replacement = {__set: true, values: [...node]};
            return stringifyInner(replacement, seen);
        }

        let keys = Object.keys(node).sort();
        out = '';
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = stringifyInner(node[key], seen, out);
            if (!value) continue;
            if (out !== '') out += ',\n';
            out += JSON.stringify(key) + ':' + value;
        }
        seen.delete(node);
        return '{' + out + '}';
    }

    function stringify(obj) {
        let seen = new Set();
        return stringifyInner(obj, seen);
    }

    function parse(string) {
        return JSON.parse(string, (_key, value) => {
            if (typeof value === "object" && value !== null && value.__map) {
                return new Map(value.values);
            } else if (typeof value === "object" && value !== null && value.__set) {
                return new Set(value.values);
            }
            return value;
        });
    }

    function stringifyCodeMap(map) {
        function replace(str) {
            return str.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("$", "\\$");
        }

        return "\n{__codeMap: true, value: " + "[" +
            [...map].map(([key, value]) => ("[" + "`" + replace(key) + "`" + ", " + "`" +  replace(value) + "`" + "]")).join(",\n") + "]" + "}"
    }

    function parseCodeMap(string) {
        const array = eval("(" + string + ")");
        return new Map(array.value);
    }

    // Data Structure

    // [id:string]
    const windows = Behaviors.select(
        [],
        loadRequest, (now, data) => {
            console.log("windows loaded");
            return data.windows
        },
        newWindowRequest, (now, spec) => [...now, `${spec.id}`],
        remove, (now, removeCommand) => now.filter((e) => e != removeCommand.id),
    );

    // {map: Map<id, type:"code"|"runner">
    const windowTypes = Behaviors.select(
        {map: new Map()},
        loadRequest, (now, data) => {
            console.log("windowTypes loaded");
            return data.windowTypes;
        },
        newWindowRequest, (now, spec) => {
            now.map.set(`${spec.id}`, spec.type);
            return {map: now.map};
        },
        Events.change(windows), (now, windows) => {
            const keys = [...now.map.keys()];
            const news = windows.filter((e) => !keys.includes(e));
            const olds = keys.filter((e) => !windows.includes(e));

            olds.forEach((id) => now.map.delete(`${id}`));
            news.forEach((id) => now.map.set(`${id}`, "code"));
            return {map: now.map};
        }
    );

    // {id, x: number, y: number, width: number, height: number}
    const positions = Behaviors.select(
        {map: new Map()},
        loadRequest, (now, data) => {
            console.log("positions loaded");
            return data.positions
        },
        Events.change(windowTypes), (now, types) => {
            const keys = [...now.map.keys()];
            const typeKeys = [...types.map.keys()];
            const news = typeKeys.filter((e) => !keys.includes(e));
            const olds = keys.filter((e) => !typeKeys.includes(e));

            const newX = (-padView.x + typeKeys.length * 5 + 40) / padView.scale;
            const newY = (-padView.y + typeKeys.length * 5 + 45) / padView.scale;

            const newWindow = (id, type) => {
                return {
                    id,
                    x: newX,
                    y: newY,
                    width: type === "code" ? 300 : 800,
                    height: type === "code" ? 200 : 400
                }
            };
            olds.forEach((id) => now.map.delete(`${id}`));
            news.forEach((id) => now.map.set(`${id}`, newWindow(id, types.map.get(id))));
            return {map: now.map};
        },
        moveOrResize, (now, command) => {
            if (command.type === "move" || command.type === "resize") {
                const v = {...now.map.get(command.id), ...command};
                v.width = Math.max(120, v.width);
                v.height = Math.max(120, v.height);
                now.map.set(command.id, v);
                return {map: now.map};
            }
            return now;
        },
    );

    const findMax = (map)  => {
        let maxId = -1;
        let max = -1;
        for (let [id, value] of map) {
            if (value > max) {
                maxId = id;
                max = value;
            }
        }
        return {maxId, max};
    };

    const zIndex = Behaviors.select(
        {map: new Map()},
        loadRequest, (now, data) => {
            console.log("zIndex loaded");
            if (data.zIndex) return data.zIndex;
            return {map: new Map(data.windows.map((w, i) => [w, i + 100]))};
        },
        Events.change(windows), (now, command) => {
            const keys = [...now.map.keys()];
            const news = command.filter((e) => !keys.includes(e));
            const olds = keys.filter((e) => !command.includes(e));

            const {maxId:_maxId, max} = findMax(now.map);
            let z = max < 0 ? 100 : max + 1;
            olds.forEach((id) => now.map.delete(id));
            news.forEach((id) => now.map.set(id, z++));
            return {map: now.map};
        },
        moveOrResize, (now, command) => {
            if (command.type === "move") {
                const z = now.map.get(command.id);

                const {maxId, max} = findMax(now.map);
                if (maxId !== command.id) {
                    now.map.set(maxId, z);
                    now.map.set(command.id, max);
                }
                return {map: now.map};
            }
            return now
        },
    );

    const titles = Behaviors.select(
        {map: new Map()},
        loadRequest, (now, loaded) => {
            console.log("titles loaded");
            return loaded.titles || {map: new Map()};
        },
        Events.change(windows), (now, command) => {
            const keys = [...now.map.keys()];
            const news = command.filter((e) => !keys.includes(e));
            const olds = keys.filter((e) => !command.includes(e));

            olds.forEach((id) => now.map.delete(id));
            news.forEach((id) => now.map.set(id, {id, state: false, title: "untitled"}));
            return {map: now.map};
        },
        titleEditChange, (now, change) => {
            const id = change.id;
            const v = {...now.map.get(id), ...change};
            now.map.set(id, v);
            return {map: now.map};
        }
    );

    const windowEnabled = Behaviors.select(
        {map: new Map()},
        loadRequest, (now, loaded) => {
            console.log("windowEnabled loaded");
            return loaded.windowEnabled || {map: new Map()};
        },
        Events.change(windows), (now, command) => {
            const keys = [...now.map.keys()];
            const news = command.filter((e) => !keys.includes(e));
            const olds = keys.filter((e) => !command.includes(e));

            olds.forEach((id) => now.map.delete(id));
            news.forEach((id) => now.map.set(id, {id, enabled: true}));
            return {map: now.map};
        },
        enabledChange, (now, change) => {
            // console.log("enabledChange", change);
            const id = change.id;
            const v = {...now.map.get(id), ...change};
            now.map.set(id, v);
            return {map: now.map};
        }
    );

    const windowContents = Behaviors.select(
        {map: new Map()},
        loadRequest, (now, loaded) => {
            for (let editor of now.map.values()) {
                editor.dom.remove();
            }
            now.map.clear();

            for (let [id, type] of loaded.windowTypes.map) {
                let elem;
                if (type === "code") {
                    elem = newEditor(id, loaded.code.get(id));
                } else {
                    elem = newRunner(id);
                }
                now.map.set(id, elem);
            }
            return {map: now.map};
        },
        Events.change(windowTypes), (now, types) => {
            const keys = [...now.map.keys()];
            const typeKeys = [...types.map.keys()];
            const news = typeKeys.filter((e) => !keys.includes(e));
            const olds = keys.filter((e) => !typeKeys.includes(e));
            olds.forEach((id) => {
                const editor = now.map.get(id);
                editor.dom.remove();
                now.map.delete(id)
            });
            news.forEach((id) => {
                const type = types.map.get(id);
                now.map.set(id, type === "code" ? newEditor(id) : newRunner(id));
            });
            return {map: now.map};
        }
    );

    const init = Events.once("code");

    const newId = Events.select(
        0,
        loadRequest, (now, request) => {
            const max = Math.max(...request.windows.map((w) => Number.parseInt(w)));
            return max;
        },
        Events.or(addCode, addRunner, init), (now, _type) => now + 1
    );

    const newWindowRequest = Events.change({id: newId, type: Events.or(addCode, addRunner, init), padView});

    const padView = Behaviors.select(
        {x: 0, y: 0, scale: 1},
        padViewChange, (now, view) => {
            let {x, y, scale} = view;

            if (scale < 0.1) {scale = 0.1;}
            if (scale > 20) {scale = 20;}
            return {...now, ...{x, y, scale}};
        }
    );

    const padTitle = Behaviors.select(
        "untitled",
        loadRequest, (now, data) => {
            console.log("padTitle loaded");
            return data.padTitle || "untitled"
        },
        titleChange, (now, request) => request
    );

    const titleChange = Events.observe((notify) => {
        const change = (evt) => {
            notify(evt.target.value);
        };

        renkon.querySelector("#padTitle").addEventListener("input", change);
        return () => {renkon.querySelector("#padTitle").removeEventListener("change", change);}
    });

    const _padTitleUpdater = ((padTitle) => {
        if (renkon.querySelector("#padTitle").value !== padTitle) {
            renkon.querySelector("#padTitle").value = padTitle;
        }
    })(padTitle);

    // New Component

    const newEditor = (id, doc) => {
        const mirror = window.CodeMirror;

        const config = {
            // eslint configuration
            languageOptions: {
                globals: mirror.globals,
                parserOptions: {
                    ecmaVersion: 2022,
                    sourceType: "module",
                },
            },
            rules: {
            },
        };

        const getDecl = (state, pos) => {
            const showDependency = Renkon.resolved.get("showGraph")?.value;
            if (!showDependency || showDependency !== "showDeps") {return;}
            let decls;
            try {
                decls = Renkon.findDecls(state.doc.toString());
            } catch(e) {
                console.log("Dependency analyzer encountered an error in source code:");
                return;
            }
            const head = pos !== undefined ? pos : state.selection.ranges[0]?.head;
            if (typeof head !== "number") {return;}
            const decl = decls.find((d) => d.start <= head && head < d.end);
            if (!decl) {return;}
            const programState = new Renkon.constructor(0);
            programState.setLog(() => {});
            programState.setupProgram([decl.code]);
            const keys = [...programState.nodes.keys()];
            const last = keys[keys.length - 1];
            const deps = [];
            for (const k of keys) {
                const is = programState.nodes.get(k).inputs;
                deps.push(...is.filter((n) => !/_[0-9]/.exec(n)));
            }
            return {deps, name: last}
        }

        const wordHover = mirror.hoverTooltip((view, pos, _side) => {
            let node = getDecl(view.state, pos);
            if (!node) return null;
            const {deps, name} = node;
            return {
                pos,
                above: true,
                create() {
                    let dom = document.createElement("div");
                    dom.textContent = `${deps} -> ${name}`;
                    dom.className = "cm-tooltip-dependency cm-tooltip-cursor-wide";
                    return {dom};
                }
            };
        });

        const editor = new mirror.EditorView({
            doc: doc || `console.log("hello")`,
            extensions: [
                mirror.basicSetup,
                mirror.javascript({typescript: true}),
                mirror.EditorView.lineWrapping,
                mirror.EditorView.editorAttributes.of({"class": "editor"}),
                mirror.keymap.of([mirror.indentWithTab]),
                mirror.linter(mirror.esLint(new mirror.eslint.Linter(), config)),
                wordHover,
            ],
        });
        editor.dom.id = `${id}-editor`;
        return editor;
    };

    const newRunner = (id) => {
        const runnerIframe = document.createElement("iframe");
        runnerIframe.srcdoc = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <style>
.dock {
    position: fixed;
    top: 0px;
    right: 0px;
    width: 30%;
    height: 80%;
    display: flex;
    box-shadow: 10px 10px 5px #4d4d4d, -10px -10px 5px #dddddd;
    transition: left 0.5s;
    background-color: white;
    z-index: 1000000;
    overflow-y: scroll;
}

.dock #inspector {
    flex-grow: 1;
    margin: 0px 20px 0px 20px;
    background-color: #ffffff;
    border: 1px solid black;
}

</style>
        <script type="module">
            import {ProgramState, CodeMirror, newInspector} from "./renkon-web.js";
            window.thisProgramState = new ProgramState(0);
            window.CodeMirror = CodeMirror;
            window.newInspector = newInspector;

            window.onmessage = (evt) => {
                if (evt.data && Array.isArray(evt.data.code)) {
                    window.thisProgramState.updateProgram(evt.data.code, evt.data.path);
                    if (window.thisProgramState.evaluatorRunning === 0) {
                        window.thisProgramState.evaluator();
                    }
                }
                if (evt.data && typeof evt.data.inspector === "boolean") {
                    if (window.thisProgramState) {
                        if (document.body.querySelector(".dock")) {
                            document.body.querySelector(".dock").remove();
                            return;
                        }
                        const dock = document.createElement("div");
                        dock.classList.add("dock");
                        const dom = document.createElement("div");
                        dom.id = "renkonInspector";

                        dock.appendChild(dom);
                        document.body.appendChild(dock);
                        const result = thisProgramState.order.map((id) => {
                            return [id, thisProgramState.resolved.get(id)]
                        });
                        newInspector(Object.fromEntries(result), dom);
                   }
                }
            };
        </script>
    </head>
    <body></body>
</html>`;
        runnerIframe.classList = "runnerIframe";
        runnerIframe.id = `runner-${id}`;
        return {dom: runnerIframe};
    };

    // User Interaction

    const addCode = Events.listener(renkon.querySelector("#addCodeButton"), "click", () => "code");
    const addRunner = Events.listener(renkon.querySelector("#addRunnerButton"), "click", () => "runner");
    const save = Events.listener(renkon.querySelector("#saveButton"), "click", (evt) => evt);
    const load = Events.listener(renkon.querySelector("#loadButton"), "click", (evt) => evt);

    const home = Events.listener(renkon.querySelector("#homeButton"), "click", () => "home");
    const zoomIn = Events.listener(renkon.querySelector("#zoomInButton"), "click", () => "zoomIn");
    const zoomOut = Events.listener(renkon.querySelector("#zoomOutButton"), "click", () => "zoomOut");
    const navigationAction = Events.or(home, zoomIn, zoomOut);

    const padViewChange = Events.receiver();

    const _padViewUpdate = ((padView) => {
        const mover = document.querySelector("#mover");
        const pad = document.querySelector("#pad");
        mover.style.setProperty("left", `${padView.x}px`);
        mover.style.setProperty("top", `${padView.y}px`);
        mover.style.setProperty("transform", `scale(${padView.scale})`);
        mover.style.setProperty("width", `${padView.width}px`);
        mover.style.setProperty("height", `${padView.height}px`);

        pad.style.setProperty("background-position", `${padView.x}px ${padView.y}px`);
        pad.style.setProperty("background-size", `${64 * padView.scale}px ${64 * padView.scale}px`);
    })(padView);

    const wheel = Events.listener(renkon.querySelector("#pad"), "wheel", (evt) => {
        let pinch;
        if (isSafari) {
            pinch = (Number.isInteger(evt.deltaX) && !Number.isInteger(evt.deltaY)) || evt.metaKey;
        } else {
            pinch = evt.ctrlKey || evt.metaKey;
        }
        const strId = evt.target.id;
        if (pinch) {
            evt.preventDefault();
            if (strId === "pad") {
                evt.stopPropagation();
            }
        }
        evt.preventDefault();
        return evt;
    });

    const _handleWheel = ((wheel, padView) => {
        let pinch;
        if (isSafari) {
            pinch = (Number.isInteger(wheel.deltaX) && !Number.isInteger(wheel.deltaY)) || wheel.metaKey;
        } else {
            pinch = wheel.ctrlKey || wheel.metaKey;
        }
        const strId = wheel.target.id;

        let deltaX = wheel.deltaX;
        let deltaY = wheel.deltaY;
        let zoom = padView.scale;

        let absDeltaY = Math.min(30, Math.abs(deltaY));
        let diff = Math.sign(deltaY) * absDeltaY;

        let desiredZoom = zoom * (1 - diff / 200);

        const xInMover = (wheel.clientX - padView.x) / padView.scale;
        const newX = wheel.clientX - xInMover * desiredZoom;

        const yInMover = (wheel.clientY - padView.y) / padView.scale;
        const newY = wheel.clientY - yInMover * desiredZoom;

        if (strId === "pad") {
            if (pinch) {
                Events.send(padViewChange, {x: newX, y: newY, scale: desiredZoom});
            } else {
                Events.send(padViewChange, {x: padView.x - deltaX, y: padView.y - deltaY, scale: padView.scale});
            }
        }
    })(wheel, padView);

    Events.listener(renkon.querySelector("#buttonBox"), "wheel", preventDefault);
    Events.listener(renkon.querySelector("#navigationBox"), "wheel", preventDefault);

    Events.listener(document.body, "gesturestart", preventDefaultSafari);
    Events.listener(document.body, "gesturechange", preventDefaultSafari);
    Events.listener(document.body, "gestureend", preventDefaultSafari);

    const isSafari = window.navigator.userAgent.includes("Safari") && !window.navigator.userAgent.includes("Chrome");
    const isMobile = !!("ontouchstart" in window);

    const pointercancel = Events.listener(renkon.querySelector("#pad"), "pointercancel", pointerLost);
    const lostpointercapture = Events.listener(renkon.querySelector("#pad"), "lostpointercapture", pointerLost);

    const preventDefault = (evt) => {
        evt.preventDefault();
        return evt;
    };

    const preventDefaultSafari = (evt) => {
        if (!isSafari || isMobile) {
            evt.preventDefault();
        }
        return evt;
    };

    const pointerLost = (evt) => {
        evCache.clear();
        evt.preventDefault();
        return {type: "lost"};
    };

    const _handleNavigationAction = ((navigationAction, positions, padView) => {
        if (navigationAction === "zoomIn") {
            Events.send(padViewChange, {x: padView.x, y: padView.y, scale: padView.scale * 1.1});
        } else if (navigationAction === "zoomOut") {
            Events.send(padViewChange, {x: padView.x, y: padView.y, scale: padView.scale * 0.9});
        } else if (navigationAction === "home") {
            let minLeft = Number.MAX_VALUE;
            let minTop = Number.MAX_VALUE;
            let maxRight = Number.MIN_VALUE;
            let maxBottom = Number.MIN_VALUE;

            if (positions.map.size === 0) {
                Events.send(padViewChange, {x: 0, y: 0, scale: 1});
                return;
            }
            for (let [_, position] of positions.map) {
                minLeft = Math.min(position.x, minLeft);
                minTop = Math.min(position.y, minTop);
                maxRight = Math.max(position.x + position.width, maxRight);
                maxBottom = Math.max(position.y + position.height, maxBottom);
            }

            const pad = document.body.querySelector("#pad").getBoundingClientRect();

            const scaleX = pad.width / (maxRight - minLeft);
            const scaleY = pad.height / (maxBottom - minTop);
            const scale = Math.min(1, scaleX, scaleY) * 0.9;

            const centerX = (maxRight + minLeft) / 2;
            const centerY = (maxBottom + minTop) / 2;

            let x = pad.width / 2 - centerX * scale;
            let y = pad.height / 2 - centerY * scale;

            Events.send(padViewChange, {x, y, scale});
        }
    })(navigationAction, positions, padView);

    const showGraph = Behaviors.collect(
        "showGraph",
        Events.listener(renkon.querySelector("#showGraph"), "click", (evt) => evt),
        (now, _click) => {
            if (now === "showGraph") {return "showDeps";}
            if (now === "showDeps") {return "hide";}
            if (now === "hide") {return "showGraph"}
            return now;
        }
    );

    ((showGraph) => {
        let str;
        if (showGraph === "showGraph") {str = "show graph";}
        if (showGraph === "showDeps") {str = "show deps";}
        if (showGraph === "hide") {str = "hide graph"}
        document.querySelector("#showGraph").textContent = str;
    })(showGraph);

    const _onRun = ((runRequest, windowContents, windowEnabled) => {
        const id = runRequest.id;
        const iframe = windowContents.map.get(id);
        const code = [...windowContents.map]
            .filter(([id, obj]) => obj.state && windowEnabled.map.get(id).enabled)
            .map(([_id, editor]) => editor.state.doc.toString());
        iframe.dom.contentWindow.postMessage({code: code, path: id});
    })(runRequest, windowContents, windowEnabled);

    const _onInspect = ((inspectRequest) => {
        const id = inspectRequest.id;
        const iframe = windowContents.map.get(id);
        iframe.dom.contentWindow.postMessage({inspector: true, path: id});
    })(inspectRequest);

    const remove = Events.receiver();
    const titleEditChange = Events.receiver();
    const enabledChange = Events.receiver();
    const runRequest = Events.receiver();
    const inspectRequest = Events.receiver();

    const dblClick = Events.listener(renkon.querySelector("#pad"), "dblclick", (evt) => evt);

    const _goTo = ((padView, positions, dblClick) => {
        const strId = dblClick.target.id;
        if (!strId.endsWith("-titleBar")) {return;}
        const id = Number.parseInt(strId);
        const position = positions.map.get(`${id}`);

        const pad = document.body.querySelector("#pad").getBoundingClientRect();

        const scaleX = pad.width / position.width;
        const scaleY = pad.height / position.height;
        const scale = Math.min(scaleX, scaleY) * 0.95;
        const x = pad.width / 2 - (position.x + position.width / 2) * scale;
        const y = pad.height / 2 - (position.y + position.height / 2) * scale;

        Events.send(padViewChange, {x, y, scale});
    })(padView, positions, dblClick);

    const rawPadDown = Events.listener(renkon.querySelector("#pad"), "pointerdown", (evt) => {
        const strId = evt.target.id;
        if (strId.endsWith("-title") && (evt.target.getAttribute("contenteditable") === "true")) {
            return evt;
        }
        if (strId) {
            evt.preventDefault();
            evt.stopPropagation();
        }
        return evt;
    }, {queued: true});

    // this is an odd ball that gets mutated by padDownState and padUp
    const evCache = new Map();

    const padDown = Events.collect(undefined, rawPadDown, (old, evts) => {
        let type;
        let id;
        if (evts.length <= 2 && evts[0].isPrimary) {
            let primary = evts[0];
            const strId = primary.target.id;
            if (!strId) {return {...old, type: ""};}
            let x = primary.clientX;
            let y = primary.clientY;
            if (strId === "pad") {
                type = "padDragDown";
                id = strId;
            } else {
                id = `${Number.parseInt(strId)}`;
                if (strId.endsWith("-titleBar")) {
                    type = "moveDown";
                } else if (strId.endsWith("-resize")) {
                    type = "windowResizeDown";
                }
            }
            if (type) {
                primary.target.setPointerCapture(primary.pointerId);
                if (strId === "pad") {
                    evCache.set("primary", {x, y});
                }
                if (evts.length === 1) {
                    return {
                        id, target: primary.target, type, x: primary.clientX, y: primary.clientY
                    };
                }
            } else {
                return {...old, type: ""};
            }
        }

        let secondary;
        if (evCache.get("primary")) {
            if (evts.length === 1 && evCache.size === 1 && !evts[0].isPrimary) {
                secondary = evts[0];
            }
            if (evts.length === 2 && evCache.size === 1 && !evts[1].isPrimary) {
                secondary = evts[1];
            }
        }
        if (!secondary) {return old;}

        const strId = secondary.target.id;
        if (strId !== "pad") {return {type: "stuck", secondary: secondary.pointerId};}
        let primary =  evCache.get("primary");
        let x = secondary.clientX;
        let y = secondary.clientY;
        let dx = primary.x - secondary.clientX;
        let dy = primary.y - secondary.clientY;
        let origDiff = Math.sqrt(dx * dx + dy * dy);
        evCache.set(secondary.pointerId, {origDiff, origScale: padView.scale, x, y});
        return {type: "pinch", secondary: secondary.pointerId};
    });

    const padUp = Events.listener(renkon.querySelector("#pad"), "pointerup", (evt) => {
        // console.log("ev1", evCache);
        evt.target.releasePointerCapture(evt.pointerId);
        evCache.clear();
        // console.log("ev2", evCache);
        return {type: "pointerup", x: evt.clientX, y: evt.clientY};
    });

    const downOrUpOrResize = Events.or(padDown, padUp, pointercancel, lostpointercapture, windowResize);

    const _padMove = Events.listener("#pad", "pointermove", moveCompute);

    const windowResize = Events.receiver();
    const moveOrResize = Events.receiver();

    const moveCompute = ((downOrUpOrResize, positions, padView) => {
        if (downOrUpOrResize.type === "moveDown" || downOrUpOrResize.type === "windowResizeDown") {
            const start = positions.map.get(downOrUpOrResize.id);
            const scale = padView.scale;
            const downPoint = {x: downOrUpOrResize.x, y: downOrUpOrResize.y};
            const type = downOrUpOrResize.type === "moveDown" ? "move" : "resize";
            return (move) => {
                const diffX = (move.clientX - downPoint.x) / scale;
                const diffY = (move.clientY - downPoint.y) / scale;
                const result = {id: downOrUpOrResize.id, type};
                if (type === "move") {
                    result.x = start.x + diffX;
                    result.y = start.y + diffY;
                } else {
                    result.width = start.width + diffX;
                    result.height = start.height + diffY;
                }
                Events.send(moveOrResize, result);
                return move;
            }
        } else if (downOrUpOrResize.type === "padDragDown") {
            const start = padView;
            const scale = start.scale;
            const downPoint = {x: downOrUpOrResize.x, y: downOrUpOrResize.y};
            const type = "padDrag";
            return (move) => {
                const diffX = move.clientX - downPoint.x;
                const diffY = move.clientY - downPoint.y;
                const result = {id: downOrUpOrResize.id, type, scale};
                result.x = start.x + diffX;
                result.y = start.y + diffY;
                Events.send(padViewChange, result);
                return move;
            };
        } else if (downOrUpOrResize.type === "pinch") {
            return (move) => {
                const keys = [...evCache.keys()];
                const primary = evCache.get("primary");
                if (!primary) {
                    // the first finger has been lifted
                    return move;
                }
                const otherKey = keys.find((k) => k !== "primary");
                const secondary = evCache.get(otherKey);
                const isPrimary = move.isPrimary;

                if (isPrimary) {
                    const newRecord = {...primary};
                    newRecord.x = move.clientX;
                    newRecord.y = move.clientY;
                    evCache.set("primary", newRecord);
                } else {
                    const newRecord = {...secondary};
                    newRecord.x = move.clientX;
                    newRecord.y = move.clientY;
                    evCache.set(otherKey, newRecord);
                }

                const origDiff = secondary.origDiff;
                const origScale = secondary.origScale;

                const pX = isPrimary ? move.clientX : primary.x;
                const pY = isPrimary ? move.clientY : primary.y;

                const sX = isPrimary ? secondary.x : move.clientX;
                const sY = isPrimary ? secondary.y : move.clientY;

                const newDiff = Math.sqrt((pX - sX) ** 2 + (pY - sY) ** 2);

                const newScale = (newDiff / origDiff) * origScale;

                const newCenterX = (pX - sX) / 2 + sX;
                const newCenterY = (pY - sY) / 2 + sY;

                const xInMover = (newCenterX - padView.x) / padView.scale;
                const newX = newCenterX - xInMover * newScale;

                const yInMover = (newCenterY - padView.y) / padView.scale;
                const newY = newCenterY - yInMover * newScale;

                Events.send(padViewChange, {x: newX, y: newY, scale: newScale});
                return move;
            }
        } else if (["pointerup", "lost", "stuck"].includes(downOrUpOrResize.type)) {
            return (move) => move;
        }
    })(downOrUpOrResize, positions, padView);

    // Rendering

    const inputHandler = (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault();
            evt.stopPropagation();
            Events.send(titleEditChange, {
                id: `${Number.parseInt(evt.target.id)}`,
                title: evt.target.textContent,
                state: false
            });
        }
    };

    const windowDOM = (id, position, zIndex, title, windowContent, type, windowEnabled) => {
        return h("div", {
            key: `${id}`,
            id: `${id}-win`,
            "class": "window",
            style: {
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${position.width}px`,
                height: `${position.height}px`,
                zIndex: `${zIndex}`,
            },
            ref: (ref) => {
                if (ref) {
                    if (ref.querySelector(".windowHolder") !== windowContent.dom.parentNode) {
                        ref.querySelector(".windowHolder").appendChild(windowContent.dom);
                    }
                }
            },
            onPointerEnter: (evt) => Events.send(hovered, `${Number.parseInt(evt.target.id)}`),
            onPointerLeave: (_evt) => Events.send(hovered, null)
        }, [
            h("div", {
                id: `${id}-titleBar`,
                "class": "titleBar",
            }, [
                h("div", {
                    id: `${id}-enabledButton`,
                    disabled: !!(windowEnabled && !windowEnabled.enabled),
                    style: {
                        display: `${type !== "code" ? "none" : "inheirt"}`
                    },
                    "class": "titlebarButton enabledButton",
                    onClick: (evt) => {
                        //console.log(evt);
                        Events.send(enabledChange, {id: `${Number.parseInt(evt.target.id)}`, enabled: !windowEnabled || !windowEnabled.enabled});
                    },
                }),
                h("div", {
                    id: `${id}-runButton`,
                    "class": "titlebarButton runButton",
                    type,
                    onClick: (evt) => {
                        //console.log(evt);
                        Events.send(runRequest, {id: `${Number.parseInt(evt.target.id)}`});
                    },
                }),
                h("div", {
                    id: `${id}-inspectorButton`,
                    "class": "titlebarButton inspectorButton",
                    type,
                    onClick: (evt) => {
                        //console.log(evt);
                        Events.send(inspectRequest, {id: `${Number.parseInt(evt.target.id)}`});
                    },
                }),
                h("div", {
                    id: `${id}-title`,
                    "class": "title",
                    contentEditable: `${title.state}`,
                    onKeydown: inputHandler,
                }, title.title),
                h("div", {
                    id: `${id}-edit`,
                    "class": `titlebarButton editButton`,
                    onClick: (evt) => {
                        // console.log(evt);
                        Events.send(titleEditChange, {id: `${Number.parseInt(evt.target.id)}`, state: !title.state});
                    },
                }, []),
                h("div", {
                    id: `${id}-close`,
                    "class": "titlebarButton closeButton",
                    onClick: (evt) => {
                        Events.send(remove, {id: `${Number.parseInt(evt.target.id)}`, type: "remove"})
                    }
                }),
            ]),
            h("div", {
                id: `${id}-resize`,
                "class": "resizeHandler",
            }, []),
            h("div", {
                id: `${id}-windowHolder`,
                blurred: `${type !== "code" ? false : (windowEnabled ? !windowEnabled.enabled : false)}`,
                "class": "windowHolder",
            }, [])
        ])
    };

    const windowElements = ((windows, positions, zIndex, titles, windowContents, windowTypes, windowEnabled) => {
        return h("div", {id: "owner", "class": "owner"}, windows.map((id) => {
            return windowDOM(id, positions.map.get(id), zIndex.map.get(id), titles.map.get(id), windowContents.map.get(id), windowTypes.map.get(id), windowEnabled.map.get(id));
        }));
    })(windows, positions, zIndex, titles, windowContents, windowTypes, windowEnabled);

    const _windowRender = render(windowElements, document.querySelector("#mover"));

    /// Save and Load

    const loadRequest = Events.receiver();

    const _saver2 = ((windows, positions, zIndex, titles, windowContents, windowTypes, padTitle, windowEnabled) => {
        const code = new Map([...windowContents.map].filter(([_id, editor]) => editor.state).map(([id, editor]) => ([id, editor.state.doc.toString()])));
        const myTitles = new Map([...titles.map].map(([id, obj]) => ([id, {...obj, state: false}])));
        const data1 = stringify({
            version: 2,
            windows,
            positions,
            zIndex,
            titles: {map: myTitles},
            windowTypes,
            padTitle,
            windowEnabled
        });

        const data2 = stringifyCodeMap(code);

        const div = document.createElement("a");
        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(data1) + encodeURIComponent(data2);
        div.setAttribute("href", dataStr);
        div.setAttribute("download", `${padTitle}.renkon`);
        div.click();
    })(windows, positions, zIndex, titles, windowContents, windowTypes, padTitle, windowEnabled, save);

    const _loader = (() => {
        const input = document.createElement("div");
        input.innerHTML = `<input id="imageinput" type="file" accept=".json .renkon">`;
        const imageInput = input.firstChild;

        imageInput.onchange = () => {
            const file = imageInput.files[0];
            if (!file) {imageInput.remove(); return;}
            new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsArrayBuffer(file);
            }).then((data) => {
                const result = new TextDecoder("utf-8").decode(data);
                loadData(result, imageInput);
            });
            imageInput.value = "";
        };
        imageInput.oncancel = () => imageInput.remove();
        document.body.appendChild(imageInput);
        imageInput.click();
    })(load);

    const nameFromUrl = (() => {
        const maybeUrl = new URL(window.location).searchParams.get("file");
        if (maybeUrl) {
            return maybeUrl;
        }
        return undefined;
    })();

    const loadData = (result, maybeImageInput) => {
        const index = result.indexOf("{__codeMap: true, value:");
        if (index < 0) {
            const loaded = parse(result);
            if (loaded.version === 1) {
                Events.send(loadRequest, loaded);
                maybeImageInput?.remvoe();
                return;
            }
            console.log("unknown type of data");
            maybeImageInput?.remvoe();
            return;
        }

        const data1 = result.slice(0, index);
        const data2 = result.slice(index);

        const loaded = parse(data1);

        if (loaded.version === 2) {
            const code = parseCodeMap(data2);
            loaded.code = code;
            Events.send(loadRequest, loaded);
            maybeImageInput?.remove();
            return;
        }
        console.log("unknown type of data");
        maybeImageInput.remove();
    }

    const _loadFromUrl = fetch(nameFromUrl).then((resp) => resp.text()).then((result) => {
        loadData(result, null);
    });

    // Graph Visualization

    const analyzed = ((windowContents, windowEnabled, trigger, showGraph) => {
        if (!showGraph) {return new Map()}
        if (trigger === null) {return new Map()}
        if (typeof trigger === "object" && trigger.id) {return new Map();}
        const programState = new Renkon.constructor(0);
        programState.setLog(() => {});

        const code = [...windowContents.map].filter(([id, editor]) => editor.state && windowEnabled.map.get(id)?.enabled).map(([id, editor]) => ({blockId: id, code: editor.state.doc.toString()}));
        try {
            programState.setupProgram(code);
        } catch(e) {
            console.log("Graph analyzer encountered an error in source code:");
            return new Map();
        }

        const nodes = new Map();
        for (let jsNode of programState.nodes.values()) {
            let ary = nodes.get(jsNode.blockId);
            if (!ary) {
                ary = [];
                nodes.set(jsNode.blockId, ary);
            }
            ary.push({inputs: jsNode.inputs, outputs: jsNode.outputs});
        }

        const exportedNames = new Map();
        const importedNames = new Map();
        for (let [id, subNodes] of nodes) {
            const exSet = new Set();
            exportedNames.set(id, exSet);

            const inSet = new Set();
            importedNames.set(id, inSet);

            for (let subNode of subNodes) {
                let outputs = subNode.outputs;
                if (outputs.length > 0 && !/^_[0-9]/.exec(outputs)) {
                    exSet.add(outputs);
                }
                for (let inString of subNode.inputs) {
                    if (!/^_[0-9]/.exec(inString)) {
                        inSet.add(inString);
                    }
                }
            }
        }

        // {edgesOut: [{id: "defined name", dest: '2'}, ...],
        //  edgesIn: [{id: "defined name", origin: '2'}, ...]}
        const edges = new Map();

        for (let [id, _] of nodes) {
            const exporteds = exportedNames.get(id);
            const importeds = importedNames.get(id);

            const edgesOut = [];
            const edgesIn = [];
            const exports = new Set();

            for (let exported of exporteds) {
                for (let [destId, destSet] of importedNames) {
                    if (destSet.has(exported) && id !== destId) {
                        edgesOut.push({id: exported, dest: destId});
                        exports.add(exported);
                    }
                }
            }
            for (let imported of importeds) {
                for (let [sourceId, sourceSet] of exportedNames) {
                    if (sourceSet.has(imported) && id !== sourceId) {
                        edgesIn.push({id: imported, origin: sourceId});
                    }
                }
            }
            edges.set(id, {edgesOut, edgesIn, exports: [...exports]});
        }

        return edges;
    })(windowContents, windowEnabled, Events.or(remove, hovered), showGraph === "showGraph");

    const line = (p1, p2, color, label) => {
        let pl;
        let pr;
        if (p1.x < p2.x) {
            pl = p1;
            pr = p2;
        } else {
            pl = p2;
            pr = p1;
        }
        const c0 = `${pl.x} ${pl.y}`;
        const c1 = `${pl.x + (pr.x - pl.x) * 0.5} ${pl.y + (pr.y - pl.y) * 0.2}`;
        const c2 = `${pr.x - (pr.x - pl.x) * 0.2} ${pl.y + (pr.y - pl.y) * 0.6}`;
        const c3 = `${pr.x} ${pr.y}`;
        return html`<path d="M ${c0} C ${c1} ${c2} ${c3}" stroke="${color}" fill="transparent" stroke-width="2" stroke-linecap="round"></path><text x="${p1.x + 5}" y="${p1.y}">${label}</text>`;
    };

    const hovered = Events.receiver();
    const hoveredB = Behaviors.keep(hovered);

    const graph = ((positions, padView, analyzed, hoveredB, showGraph) => {
        if (hoveredB === null) {return [];}
        if (!showGraph) {return [];}

        const edges = analyzed.get(hoveredB);

        if (!edges) {return [];} // runner does not have edges

        const outEdges = edges.edgesOut.map((edge) => {
            const ind = edges.exports.indexOf(edge.id);
            let p1 = positions.map.get(hoveredB);
            p1 = {x: p1.x + p1.width, y: p1.y};
            p1 = {x: p1.x, y: p1.y + ind * 20 + 10};
            p1 = {x: p1.x * padView.scale + padView.x, y: p1.y * padView.scale + padView.y};
            let p2 = positions.map.get(edge.dest);
            p2 = {x: p2.x, y: p2.y + 10};
            p2 = {x: p2.x * padView.scale + padView.x, y: p2.y * padView.scale + padView.y};
            return line(p1, p2, "#d88", edge.id);
        });

        const inEdges = edges.edgesIn.map((edge) => {
            const exporter = analyzed.get(edge.origin);
            const ind = exporter.exports.indexOf(edge.id);
            let p1 = positions.map.get(edge.origin);
            p1 = {x: p1.x + p1.width, y: p1.y};
            p1 = {x: p1.x, y: p1.y + ind * 20 + 10};
            p1 = {x: p1.x * padView.scale + padView.x, y: p1.y * padView.scale + padView.y};
            let p2 = positions.map.get(hoveredB);
            p2 = {x: p2.x, y: p2.y + 10};
            p2 = {x: p2.x * padView.scale + padView.x, y: p2.y * padView.scale + padView.y};
            return line(p1, p2, "#88d", edge.id);
        });

        return html`<svg viewBox="0 0 ${window.innerWidth} ${window.innerHeight}" xmlns="http://www.w3.org/2000/svg">${outEdges}${inEdges}</svg>`;
    })(positions, padView, analyzed, hoveredB, showGraph === "showGraph");

    const _graphRender = render(graph, document.querySelector("#overlay"));

    // CSS

    const css = `
@font-face {
    font-family: "OpenSans-Regular";
    src: url("./assets/fonts/open-sans-v17-latin-ext_latin-regular.woff2") format("woff2");
}

@font-face {
  font-family: 'OpenSans-SemiBold';
  src: url("./assets/fonts/open-sans-v17-latin-ext_latin-600.woff2") format('woff2');
}

html, body, #renkon {
    overflow: hidden;
    height: 100%;
    margin: 0px;
}

html, body {
  overscroll-behavior-x: none;
  touch-action: none;
}

#pad {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAjElEQVR4XuXQAQ0AAAgCQfoHpYbOGt5vEODSdgovd3I+gA/gA/gAPoAP4AP4AD6AD+AD+AA+gA/gA/gAPoAP4AP4AD6AD+AD+AA+gA/gA/gAPoAP4AP4AD6AD+AD+AA+gA/gA/gAPoAP4AP4AD6AD+AD+AA+gA/gA/gAPoAP4AP4AD6AD+AD+AA+wIcWxEeefYmM2dAAAAAASUVORK5CYII=);
}

#mover {
    pointer-events: none;
    position:absolute;
    transform-origin: 0px 0px;
}

#owner {
    position: absolute;
    pointer-events: initial;
}

.editor {
    height: 100%;
    border-radius: 0px 0px 6px 6px;
}

#overlay {
    pointer-events: none;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10000;
}

.window {
    position: absolute;
    background-color: #eee;
    border-radius: 6px;
    box-shadow: inset 0 2px 2px 0 rgba(255, 255, 255, 0.8), 1px 1px 8px 0 rgba(0, 35, 46, 0.2);
}

#buttonBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    row-gap: 8px;
    left: 0px;
    top: 0px;
    width: 100%;
    padding-bottom: 8px;
    padding-top: 8px;
    border-bottom: 1px solid black;
    background-color: white;
    position: absolute;
    z-index: 200000;
}

#padTitle {
    margin-left: 24px;
}

.spacer {
    flex-grow: 1;
}

.menuButton {
    font-family: 'OpenSans-SemiBold';
    color: black;
    margin-left: 4px;
    margin-right: 4px;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid #555;
}
                   

.runnerIframe {
    width: 100%;
    height: 100%;
    border: 2px solid black;
    box-sizing: border-box;
    border-radius: 0px 0px 6px 6px;
    background-color: #fff;
    user-select: none;
}

.titleBar {
    background-color: #bbb;
    width: 100%;
    height: 28px;
    display: flex;
    border: 2px ridge #ccc;
    box-sizing: border-box;
    border-radius: 6px 6px 0px 0px;
    cursor: -webkit-grab;
    cursor: grab;
}

.title {
    font-family: OpenSans-Regular;
    pointer-events: none;
    margin-left: 10px;
    flex-grow: 1;
    margin-right: 20px;
    padding-left: 10px;
}

.title[contentEditable="true"] {
    background-color: #eee;
    pointer-events: all;
    user-select: all;
}

.titlebarButton {
    height: 19px;
    width: 19px;
    margin: 2px;
    margin-top: 2px;
    pointer-events: all;
    border-radius: 4px;
    background-position: center;
    cursor: pointer;
}

.titlebarButton:hover {
    background-color: #eee;
}

.closeButton {
    background-image: url("data:image/svg+xml,%3Csvg%20id%3D%22Layer_1%22%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M8.48%2C12.25C6.4%2C10.17%2C4.37%2C8.16%2C2.35%2C6.15c-.34-.34-.68-.69-1-1.05a2.34%2C2.34%2C0%2C0%2C1%2C.17-3.26%2C2.3%2C2.3%2C0%2C0%2C1%2C3.25-.09C7%2C3.93%2C9.23%2C6.14%2C11.45%2C8.34a5.83%2C5.83%2C0%2C0%2C1%2C.43.58c.36-.4.62-.71.9-1%2C2-2%2C4.12-4%2C6.12-6.08a2.51%2C2.51%2C0%2C0%2C1%2C3.41%2C0%2C2.37%2C2.37%2C0%2C0%2C1%2C0%2C3.43c-2.18%2C2.22-4.39%2C4.41-6.58%2C6.62-.11.1-.21.22-.34.35l.44.48L22.09%2C19A2.7%2C2.7%2C0%2C0%2C1%2C23%2C20.56a2.49%2C2.49%2C0%2C0%2C1-1.29%2C2.54A2.36%2C2.36%2C0%2C0%2C1%2C19%2C22.69c-2-2-4-4-6.06-6-.33-.33-.62-.68-1-1.12-1.63%2C1.66-3.17%2C3.25-4.73%2C4.82-.79.8-1.6%2C1.59-2.42%2C2.36a2.32%2C2.32%2C0%2C0%2C1-3.21-.1%2C2.3%2C2.3%2C0%2C0%2C1-.19-3.25c2.14-2.2%2C4.31-4.36%2C6.48-6.54Z%22%20fill%3D%22%234D4D4D%22%2F%3E%3C%2Fsvg%3E");
}

.editButton {
    background-image: url("data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3C!--%20Generator%3A%20Sketch%2064%20(93537)%20-%20https%3A%2F%2Fsketch.com%20--%3E%3Ctitle%3Eicon%2Fmaterial%2Fedit%3C%2Ftitle%3E%3Cdesc%3ECreated%20with%20Sketch.%3C%2Fdesc%3E%3Cg%20id%3D%22icon%2Fmaterial%2Fedit%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20id%3D%22ic-round-edit%22%3E%3Cg%20id%3D%22Icon%22%20fill%3D%22%234D4D4D%22%3E%3Cpath%20d%3D%22M3%2C17.46%20L3%2C20.5%20C3%2C20.78%203.22%2C21%203.5%2C21%20L6.54%2C21%20C6.67%2C21%206.8%2C20.95%206.89%2C20.85%20L17.81%2C9.94%20L14.06%2C6.19%20L3.15%2C17.1%20C3.05%2C17.2%203%2C17.32%203%2C17.46%20Z%20M20.71%2C7.04%20C20.8972281%2C6.85315541%2021.002444%2C6.59950947%2021.002444%2C6.335%20C21.002444%2C6.07049053%2020.8972281%2C5.81684459%2020.71%2C5.63%20L18.37%2C3.29%20C18.1831554%2C3.10277191%2017.9295095%2C2.99755597%2017.665%2C2.99755597%20C17.4004905%2C2.99755597%2017.1468446%2C3.10277191%2016.96%2C3.29%20L15.13%2C5.12%20L18.88%2C8.87%20L20.71%2C7.04%20Z%22%20id%3D%22Icon-Shape%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Crect%20id%3D%22ViewBox%22%20fill-rule%3D%22nonzero%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2224%22%20height%3D%2224%22%3E%3C%2Frect%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

.runButton {
    background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%234D4D4D%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C!--%20Box%20outline%20--%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%222%22%20ry%3D%222%22%2F%3E%3C!--%20Right-pointing%20triangle%20(play%20icon)%20--%3E%3Cpath%20d%3D%22M9%207L17%2012L9%2017Z%22%20fill%3D%22%234D4D4D%22%20stroke%3D%22none%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
    display: none;
    pointer-events: none;
}

.runButton[type="runner"] {
    display: inherit;
    pointer-events: all;
}

.resizeHandler {
    position: absolute;
    background-color: rgba(0.1, 0.1, 0.1, 0.1);
    width: 20px;
    height: 20px;
    bottom: -10px;
    right: -10px;
    border-radius: 6px;
    z-index: 10000;
    cursor: se-resize;
}

.resizeHandler:hover {
    background-color: rgba(0.1, 0.4, 0.1, 0.3);
}

.windowHolder {
    height: calc(100% - 24px);
}

.windowHolder[blurred="true"] {
    filter: blur(4px)
}

#navigationBox {
    display: flex;
    flex-direction: column;
    right: 20px;
    gap: 10px;
    bottom: 80px;
    align-items: center;
    width: 40px;
    border: 1px solid black;
    background-color: #d2d2d2;
    position: absolute;
    z-index: 200000;
    border-radius: 8px;
    box-shadow: 4px 5px 8px -2px rgba(0,0,0,.15);
}

.navigationButton {
    width: 30px;
    height: 30px;
    display: flex;
    cursor: pointer;
}

.with-border {
    border: 1px solid #4D4D4D;
    border-radius: 15px;
    background-color: white;
}

.navigationButton:hover {
    background-color: #eaeaea;
}

.navigationButton:first-child {
    margin-top: 10px;
}

.navigationButton:last-child {
    margin-bottom: 10px;
}

.navigationButtonImage {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
}

#zoomInButton {
    background-image: url("data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Ctitle%3Eicon%2Fmaterial%2Fview_zoom-in%3C%2Ftitle%3E%3Cg%20id%3D%22icon%2Fmaterial%2Fview_zoom-in%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20id%3D%22ic-baseline-add%22%3E%3Cg%20id%3D%22Icon%22%20fill%3D%22%234D4D4D%22%3E%3Cpolygon%20id%3D%22Icon-Path%22%20points%3D%2219%2013%2013%2013%2013%2019%2011%2019%2011%2013%205%2013%205%2011%2011%2011%2011%205%2013%205%2013%2011%2019%2011%22%3E%3C%2Fpolygon%3E%3C%2Fg%3E%3Crect%20id%3D%22ViewBox%22%20fill-rule%3D%22nonzero%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2224%22%20height%3D%2224%22%3E%3C%2Frect%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

#zoomOutButton {
    background-image: url("data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Ctitle%3Eicon%2Fmaterial%2Fview_zoom-out%3C%2Ftitle%3E%3Cg%20id%3D%22icon%2Fmaterial%2Fview_zoom-out%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20id%3D%22ic-baseline-minus%22%3E%3Cg%20id%3D%22Icon%22%20fill%3D%22%234D4D4D%22%3E%3Cpolygon%20id%3D%22Icon-Path%22%20points%3D%2219%2012.998%205%2012.998%205%2010.998%2019%2010.998%22%3E%3C%2Fpolygon%3E%3C%2Fg%3E%3Crect%20id%3D%22ViewBox%22%20fill-rule%3D%22nonzero%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2224%22%20height%3D%2224%22%3E%3C%2Frect%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

#homeButton {
    background-image: url("data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Ctitle%3Eicon%2Fview-centered%3C%2Ftitle%3E%3Cg%20id%3D%22icon%2Fview-centered%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20id%3D%22Group-3%22%20transform%3D%22translate(2.000000%2C%204.000000)%22%20fill%3D%22%234D4D4D%22%3E%3Cpath%20d%3D%22M0%2C9%20L3%2C9%20L3%2C7%20L0%2C7%20L0%2C9%20Z%20M17%2C9%20L20.001%2C9%20L20.001%2C7%20L17%2C7%20L17%2C9%20Z%20M9%2C3%20L11%2C3%20L11%2C0%20L9%2C0%20L9%2C3%20Z%20M13%2C9%20L11%2C9%20L11%2C11%20L9%2C11%20L9%2C9%20L7%2C9%20L7%2C7%20L9%2C7%20L9%2C5%20L11%2C5%20L11%2C7%20L13%2C7%20L13%2C9%20Z%20M9%2C16%20L11%2C16%20L11%2C13%20L9%2C13%20L9%2C16%20Z%20M13%2C0%20L13%2C2%20L18%2C2%20L18%2C5%20L20%2C5%20L20%2C0%20L13%2C0%20Z%20M18%2C14%20L13%2C14%20L13%2C16%20L20%2C16%20L20%2C11%20L18%2C11%20L18%2C14%20Z%20M0%2C5%20L2%2C5%20L2%2C2%20L7%2C2%20L7%2C0%20L0%2C0%20L0%2C5%20Z%20M2%2C11%20L0%2C11%20L0%2C16%20L7%2C16%20L7%2C14%20L2%2C14%20L2%2C11%20Z%22%20id%3D%22Fill-1%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

.enabledButton {
    background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%234D4D4D%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C!--%20Box%20outline%20--%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%222%22%20ry%3D%222%22%20stroke-width%3D%222%22%2F%3E%3C!--%20Thicker%20checkmark%20--%3E%3Cpath%20d%3D%22M5.5%2012.5L10.5%2017.5L18.5%207.5%22%20stroke-width%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

.enabledButton[disabled="true"] {
    background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%222%22%20ry%3D%222%22%20fill%3D%22none%22%20stroke%3D%22%234D4D4D%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
}

.inspectorButton {
    background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%234D4D4D%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C!--%20Line%201%20--%3E%3Ccircle%20cx%3D%225%22%20cy%3D%227%22%20r%3D%221.5%22%20fill%3D%22%234D4D4D%22%20stroke%3D%22none%22%2F%3E%3Cline%20x1%3D%228%22%20y1%3D%227%22%20x2%3D%2219%22%20y2%3D%227%22%2F%3E%3C!--%20Line%202%20--%3E%3Ccircle%20cx%3D%225%22%20cy%3D%2212%22%20r%3D%221.5%22%20fill%3D%22%234D4D4D%22%20stroke%3D%22none%22%2F%3E%3Cline%20x1%3D%228%22%20y1%3D%2212%22%20x2%3D%2219%22%20y2%3D%2212%22%2F%3E%3C!--%20Line%203%20--%3E%3Ccircle%20cx%3D%225%22%20cy%3D%2217%22%20r%3D%221.5%22%20fill%3D%22%234D4D4D%22%20stroke%3D%22none%22%2F%3E%3Cline%20x1%3D%228%22%20y1%3D%2217%22%20x2%3D%2219%22%20y2%3D%2217%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
    display: none;
    pointer-events: none;
}

.inspectorButton[type="runner"] {
    display: inherit;
    pointer-events: all;
}

.cm-tooltip-lint {
   font-size: 12px;
}

.cm-tooltip-dependency {
    background-color: #66b;
    color: white;
    border: none;
    padding: 2px 7px;
    border-radius: 4px;
}

.cm-tooltip-cursor-wide {
   text-wrap: nowrap;
}
`;

    ((css) => {
        const renkon = document.querySelector("#renkon");
        const style = document.createElement("style");
        style.id = "pad-css";
        style.textContent = css;
        renkon.querySelector("#pad-css")?.remove();
        renkon.appendChild(style);
    })(css);
    return [];
}

/* globals Events Behaviors Renkon */
