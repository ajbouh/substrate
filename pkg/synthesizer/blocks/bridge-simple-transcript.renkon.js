const {h, render, html} = import("./preact.standalone.module.js");

Events.send(ready, true);

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

const style = (() => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.id = 'tailwindcss';
  script.src = 'https://cdn.tailwindcss.com';
  
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
})(sessionStart);

const sessionStart = Behaviors.keep(Events.once(Date.now()));

const speakersFor = () => ["unknown"];

const transcriptionEvents = records?.map(record => record.fields);
console.log({transcriptionEvents});

const translations = {map: new Map()};

const model = Behaviors.collect([], transcriptionEvents, (old, ts) => {
  const now = [];
  for (let t of ts) {
    const transcribed = t?.transcribed?.data;
    if (!transcribed) {continue;}
    const time = t.transcribed.time;
    const sentenceId = t.id;
    if (transcribed.segments.length === 0) {console.log("silent"); continue;}
    now.push({
      transcript: {fields: transcribed},
      translations: [],
      assistants: [],
      tools: [],
      speakers: speakersFor(),
      sentenceId
    });
  };
  return now;
});

const Topbar = h('div', {"class":"flex flex-wrap px-6 py-4","id":"topbar"},
  sessionStart ? h("h1", {"class":"py-1 text-xl font-bold"},
    sessionStart.toLocaleString(),
  ) : null,
)

const Entry = (entry, translations) => {
  if (!entry.transcript || !entry.transcript.fields || !entry.transcript.fields || !entry.transcript.fields.segments) return null;
  const data = entry.transcript.fields;
  const track = [];
  const translation = translations.map.get(entry.sentenceId);
  const words = data.segments
    .flatMap((seg) => seg.words);
  return h('div', null,
    h("div", {"class": "text text-teal-500 space-x-4"}, entry.speakers.length == 0 ? "unknown" : entry.speakers.map(s => {
      return h("span", {"class": `text-${s.color}`, "data-speaker-id": s.id}, s.name);
    })),
    h("div", {"class": `text text-gray-400`, lang: data.source_language},
      words.map(w => {
        const colors = speakersFor(track, w.start*1000, w.end*1000).map(s => s.color);
        return h('span', {
          "class": colors.length == 0 ? "" : `underline decoration-${colors[0]}/50`,
        }, w.word)
      })
    ),
   translation ? h("div", {"class": "text text-cyan-500", lang: translation.lang},
        translation,
      ) : null,    
    entry.assistants.map(asst => {
      return h("div", {"class": "text text-fuchsia-500 whitespace-pre-wrap"},
        h('b', null, asst.name), ' ', asst.text,
      );
    }),
  );
}

// TODO add keyed entries
const Session = (model, translations, style) => { return h('div', null, model.map((e) => Entry(e, translations))) };

const App = h('div', {"class": "flex flex-row bg-gray-900 text-white antialiased"},
  h('div', {'class': 'flex flex-col h-screen grow'},
    Topbar,
    h('div', {"class":"grow px-6 mt-4 overflow-auto"},
      Session(model, translations),
    ),
  ),
)

render(
  App,
  document.body,
)
