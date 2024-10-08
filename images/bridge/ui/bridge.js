let NanosToMillis = 1000000;
let NanosToSeconds = 1000000000;

let colorScheme = [
  "red-500",
  "lime-500",
  "violet-500",
  "orange-500",
  "green-500",
  "purple-500",
  "amber-500",
  "emerald-500",
  "fuchsia-500",
  "yellow-500",
  "pink-500",
  "blue-500",
  "rose-500",
  "indigo-500",
];

let unique = function(keyFn) {
  if (!keyFn) { keyFn = (x) => x; }
  let seen = new Set();
  return function(x) {
    let key = keyFn(x);
    if (seen.has(key)) { return false; }
    seen.add(key);
    return true;
  }
}

export function decodeMessage(cbordata) {
  const data = CBOR.decode((new Uint8Array(cbordata)).buffer);

  const events = data.Session == null ? [] : data.Session.Tracks.map(t => t.Events).filter(e => e).flat();
  const sessionStart = data.Session && new Date(data.Session.Start).getTime();

  const translations = {};
  const assistants = {};
  const tools = {};
  const speakers = [];
  const speakerNames = {};
  for (const e of events) {
    let src;
    switch (e.Type) {
    case "translation":
      src = e.Data.SourceEvent
      if (!translations.hasOwnProperty(src)) {
        translations[src] = []
      }
      translations[src].push({
        lang: e.Data.Translation.target_language,
        text: e.Data.Translation.segments.map(s => s.text).join(),
      });
      break;
    case "assistant-text":
      src = e.Data.SourceEvent
      if (!assistants.hasOwnProperty(src)) {
        assistants[src] = []
      }
      assistants[src].push({
        name: e.Data.Name,
        text: e.Data.Response,
        error: e.Data.Error,
      });
      break;
    case "tool-call":
      src = e.Data.SourceEvent
      if (!tools.hasOwnProperty(src)) {
        tools[src] = []
      }
      tools[src].push({
        name: e.Data.Name,
        call: e.Data.Call,
        response: e.Data.Response,
      });
      break;
    case "diarize-speaker-detected":
      speakers.push({
        id: e.Data.SpeakerID,
        start: e.Start,
        end: e.End,
      });
      break;
    case "diarize-speaker-name":
      speakerNames[e.Data.SpeakerID] = e.Data.Name;
      break;
    }
  }

  let uniqueSpeakers = speakers.map(s => s.id).filter(unique());
  let speakerColor = uniqueSpeakers.reduce((acc, id, i) => {
    acc[id] = colorScheme[i % colorScheme.length];
    return acc;
  }, {});

  let speakersFor = (start, end) => {
    return speakers
      .filter(s => end > s.start && start < s.end)
      .filter(unique(s => s.id))
      .map(s => {
        let name = speakerNames[s.id] || s.id;
        return { id: s.id, name, color: speakerColor[s.id]};
      });
  }

  return {
    activeSession: data.Session,
    entries: events.filter(e => e.Type === "transcription").sort((a, b) => {
      return a.Start - b.Start;
    }).map(t => {
      return {
        speakers: speakersFor(t.Start, t.End),
        lang: t.Data.source_language,
        span: {start: t.Start, end: t.End},
        start: new Date(sessionStart + (t.Start / NanosToMillis)),
        end: new Date(sessionStart + (t.End / NanosToMillis)),
        words: t.Data.segments.flatMap(s => s.words).map(w => {
          const start = t.Start+(w.start*NanosToSeconds);
          const end = t.Start+(w.end*NanosToSeconds);
          return {
            colors: speakersFor(start, end).map(s => s.color),
            start, end,
            word: w.word,
          };
        }),
        final: true,
        translations: translations[t.ID] || [],
        // right now these are in response to a single message, though in the
        // future we may have some entries that are out of band
        assistants: assistants[t.ID] || [],
        tools: tools[t.ID] || [],
      }
    }).filter(e => e.words.length > 0),
  }
}
