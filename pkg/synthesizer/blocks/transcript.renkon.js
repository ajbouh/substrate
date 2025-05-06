const modules = Behaviors.resolvePart({
  preact: import("../preact.standalone.module.js"),
  inputs: import("../inputs.js"),
});
const { makeInputs } = modules.inputs;
const { select, textinput, button } = makeInputs({ h });
const { h, html, render } = modules.preact;

const init = Events.once(modules);
((init) => {
  Events.send(ready, true);
})(init);

const records = Behaviors.collect(
  [],
  recordsUpdated,
  (now, { records: { incremental, records } }) =>
    incremental ? [...now, ...records] : records
);
console.log({ records });

const style = (() => {
  const head = document.querySelector("head");
  const script = document.createElement("script");
  script.id = "tailwindcss";
  script.src = "https://cdn.tailwindcss.com";
  const promise = new Promise((resolve) => {
    script.onload = () => {
      const style = document.createElement("style");
      style.id = "pad-css";
      style.textContent = css;
      document.head.querySelector("#pad-css")?.remove();
      document.head.appendChild(style);
      resolve(style);
    };
    head.querySelector("#tailwindcss")?.remove();
    head.appendChild(script);
  });

  const css = `
html, body {
height: 100%
}
`;

  return promise;
})(pageLoad);

const pageLoad = Behaviors.keep(Events.once(new Date()));

const session = Behaviors.collect(
  undefined,
  recordsUpdated,
  (now, { records: { incremental, records } }) => {
    return records.reduce(
      (acc, e) => {
        if (e.fields.deleted) return acc;
        if (!e?.fields?.path?.endsWith("/session")) return acc;
        return e;
      },
      incremental ? now : undefined
    );
  }
);
console.log({ session });

const sessionStart = session ? new Date(session.fields.start_utc) : undefined;
console.log({ sessionStart });

const transcript = Behaviors.collect(
  [],
  recordsUpdated,
  (now, { records: { incremental, records } }) => {
    const t = records.flatMap((evt) => {
      if (evt.fields.deleted) return [];
      if (!evt.fields?.path?.endsWith("/transcription/segmented")) return [];
      return [evt];
    });
    return incremental ? [...now, ...t] : t;
  }
);
console.log({ transcript });

const keyedBy = (keyFn, updateFn) => {
  return (now, { records: { incremental, records } }) => {
    const updates = records.reduce((map, item) => {
      // TODO remove entries for deleted items
      if (item.fields.deleted) return map;
      const key = keyFn(item);
      if (key == null) {
        return map;
      }
      const existing = now.get(key);
      map.set(key, updateFn(item, existing));
      return map;
    }, new Map());
    if (!incremental) {
      return updates;
    }
    if (updates.size == 0) {
      return now;
    }
    for (const [key, item] of now.entries()) {
      if (!updates.has(key)) {
        updates.set(key, item);
      }
    }
    return updates;
  };
};

const byId = Behaviors.collect(
  new Map(),
  recordsUpdated,
  keyedBy(
    (item) => item.id,
    (item) => item
  )
);
console.log({ byId });

const getLinked = (e, linkName) => {
  const link = e.fields.links[linkName];
  if (link == null || link.attributes == null) {
    return null;
  }
  return byId.get(link.attributes["eventref:event"]);
};

const findByLink = (e, linkName, predicate) => {
  while (e != null) {
    if (predicate(e)) {
      return e;
    }
    e = getLinked(e, linkName);
  }
  return null;
};

function hasPath(e, path) {
  return e.fields?.path?.endsWith(path);
}

const findSegmentedSource = (e) =>
  findByLink(e, "source", (e) => hasPath(e, "/transcription/segmented"));

const translations = Behaviors.collect(
  new Map(),
  recordsUpdated,
  keyedBy(
    (item) => {
      if (!hasPath(item, "/translation")) return null;
      const source = findSegmentedSource(item);
      return source?.id;
    },
    (item, existing) => {
      return [
        ...(existing || []),
        {
          lang: item.fields.target_language,
          text: item.fields.text,
        },
      ];
    }
  )
);
console.log({ translations });

const assistants = new Map();
const speakersFor = () => [];

const model = transcript.map((t) => {
  const track = t.fields.links.track?.attributes;
  return {
    transcript: t,
    translations: translations.get(t.id) || [],
    assistants: assistants.get(t.id) || [],
    tools: [],
    speakers: track
      ? speakersFor(
          track["eventref:event"],
          track["eventref:start"],
          track["eventref:end"]
        )
      : [],
  };
});
console.log({ model });

// const transcriptionEvents = records?.map((record) => record.fields);
// console.log({ transcriptionEvents });

const Topbar = h(
  "div",
  { class: "flex flex-wrap px-6 py-4", id: "topbar" },
  sessionStart
    ? h(
        "h1",
        { class: "py-1 text-xl font-bold" },
        sessionStart.toLocaleString()
      )
    : "(no session)"
);

const Entry = (entry) => {
  if (
    !entry.transcript ||
    !entry.transcript.fields ||
    !entry.transcript.fields ||
    !entry.transcript.fields.segments
  )
    return h("pre", null, JSON.stringify(entry, null, 2));
  const data = entry.transcript.fields;
  const track = data.links.track?.attributes["eventref:event"];
  const words = data.segments.flatMap((seg) => seg.words);
  return h(
    "div",
    null,
    h(
      "div",
      { class: "text text-teal-500 space-x-4" },
      entry.speakers.length == 0
        ? "unknown"
        : entry.speakers.map((s) => {
            return h(
              "span",
              { class: `text-${s.color}`, "data-speaker-id": s.id },
              s.name
            );
          })
    ),
    h(
      "div",
      { class: `text text-gray-400`, lang: data.source_language },
      words.map((w) => {
        const colors = speakersFor(track, w.start * 1000, w.end * 1000).map(
          (s) => s.color
        );
        return h(
          "span",
          {
            class:
              colors.length == 0 ? "" : `underline decoration-${colors[0]}/50`,
          },
          w.word
        );
      })
    ),
    entry.translations.map((translation) =>
      h(
        "div",
        { class: "text text-cyan-500", lang: translation.lang },
        translation.text
      )
    ),
    entry.assistants.map((asst) => {
      return h(
        "div",
        { class: "text text-fuchsia-500 whitespace-pre-wrap" },
        h("b", null, asst.name),
        " ",
        asst.text
      );
    })
  );
};

// TODO add keys to Entry list for more efficient updates
const Session = (model) => {
  return h("div", null, model.map(Entry));
};

const chatMessageUpdate = Events.receiver();
const chatMessage = Behaviors.select(
  "",
  chatMessageUpdate,
  (now, value) => value
);

const Chat = h(
  "div",
  {},
  textinput(chatMessage, (value) => Events.send(chatMessageUpdate, value)),
  button(
    () => {
      const msgTime = new Date();
      const msgTimeMs = msgTime.getTime() - sessionStart.getTime();
      Events.send(recordsWrite, [
        {
          fields: {
            path: "/bridge-demo/transcription/segmented",
            source_language: "en",
            segments: [
              {
                words: [{ word: chatMessage, start: 0, end: 0 }],
              },
            ],
            links: {
              track: {
                rel: "eventref",
                attributes: {
                  // TODO these should probably reference some "chat" track, but
                  // it's not necessary for the message to appear
                  // "eventref:event": "01JMDN5150X2F90A4SKWM0HX5T",
                  "eventref:start": msgTimeMs,
                  "eventref:end": msgTimeMs,
                  "eventref:unit": "ms",
                  "eventref:axis": "audiotrack/1",
                },
              },
            },
          },
        },
      ]);
      Events.send(chatMessageUpdate, "");
    },
    ">",
    { class: "bg-gray-600 text-white rounded px-2 py-1" }
  )
);

const App = h(
  "div",
  { class: "bg-gray-900 h-screen antialiased" },
  h("div", { class: "text-white" }, Topbar),
  // h("div", null, JSON.stringify(records)),
  h("div", { class: "flex flex-wrap px-6 py-4" }, Chat),
  h(
    "div",
    {
      class: "flex flex-wrap px-6 py-4",
    },
    Session(model)
  )
);

// http://localhost:8000/?recordstore=https://substrate-a3a1.local/events;data=sp-01JMD68PYB46TJEQDZ55XWV2PA/
// {"basis_criteria":{"prefix":{"path":[{"prefix":"/bridge-demo/"}]}}}
render(App, document.body);
