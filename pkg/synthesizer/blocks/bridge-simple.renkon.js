/*globals Events Behaviors ready recordsUpdated recordsWrite */

Events.send(ready, true);

// const transcriptionQuery = {compare: {type: [{compare: "=", value: "transcription"}]}};
// const translationQuery = {compare: {type: [{compare: "=", value: "translation"}]}};


const style = (() => {
  const css = `
html, body {
height: 100%
}
`
    document.head.querySelector("#pad-css")?.remove();
    const style = document.createElement("style");
    style.id = "pad-css";
    style.textContent = css;
    document.head.appendChild(style);
    return style;
})();

const languages = ["eng", "en"];

const {toBase64} = import("./blocks/bridge-simple/toBase64.js");
const {LocalMedia} = import("./blocks/bridge-simple/localmedia.js");

const {reflect, sender} = import(`./blocks/bridge-simple/msg.js`);

const hostName = `https://substrate-3533.local`;

const msgindex = reflect(`${hostName}/substrate/v1/msgindex`);
const msgSender = sender();
const sendmsg = (msg, data) => {
    return msgSender(msg, data).then((obj) => obj.data.returns);
}

const audioContext = Behaviors.collect(undefined, trigger, (old, _now) => {
    if (old === undefined) {
        return new window.AudioContext();
    }
    return old;
});

const trigger = Events.listener(document.querySelector("body"), "click", (evt) => evt);

const localMedia = new LocalMedia({
    videoSource: false,
    onstreamchange: (_stream) => {
    }
});

const streams = localMedia.setup();

const source = ((audioContext, localMedia, _streams) => {
    // console.log("in source", audioContext, localMedia);
    return new window.MediaStreamAudioSourceNode(audioContext, {mediaStream: localMedia.stream})
})(audioContext, localMedia, streams);

const processor = ((audioContext) => {
    return audioContext.audioWorklet.addModule(`./blocks/bridge-simple/audio-samples.js`).then(() => {
        const worklet = new window.AudioWorkletNode(audioContext, "processor");
        worklet.addEventListener("processorerror", console.log);
        return worklet;
    })
})(audioContext);

const inputs = Events.observe((notifier) => {
    processor.port.onmessage = (event) => {
        notifier(event.data);
    }
    source.connect(processor);
    return () => source.disconnect(processor);
}, {queued: true});

const voiceChunk = Events.receiver();

// console.log("voiceChunk", voiceChunk);

const _speaking = Behaviors.collect({time: 0, data: [], speaking: false}, inputs, ((old, current) => {
    const max = Math.max(...current.map((c) => c.max));
    const currentTime = current[current.length - 1].currentTime;
    const newInput = current.map((c) => c.input);

    if (old.speaking) {
        const newData = [...old.data, ...newInput];
        if (max < 0.01) {
            if (currentTime > old.time + 0.5) {
                Events.send(voiceChunk, {time: currentTime, data: newData});
                return {time: currentTime, data: newData, speaking: false};
            }
            return {time: old.time, data: newData, speaking: old.speaking};
        }
        return {time: currentTime, data: newData, speaking: old.speaking};
    }

    if (max < 0.01) {
        return old;
    }

    return {time: currentTime, data: newInput, speaking: true};
}));

const {audioBufferToWav} = import("./blocks/bridge-simple/wav.js");

const wav = ((voiceChunk) => {
    return {timelabel: voiceChunk.time, wav: chunkToWav(voiceChunk.data)};
})(voiceChunk);

console.log("wav", wav);

const chunkToWav = (data) => {
    const zip = (pairs) => {
        const length = pairs[0][0].length * pairs.length;
        const a = new Float32Array(length);
        const b = new Float32Array(length);
        let index = 0;
        for (let i = 0; i < pairs.length; i++) {
            a.set(pairs[i][0], index);
            b.set(pairs[i][1], index);
            index += pairs[i][0].length;
        }
        return [a, b];
    };
    return audioBufferToWav(44100, zip(data));
};

/*
  const saveWav = ((wav) => {
  let div = document.createElement("a");
  const blob = new Blob([wav.wav], {type: "audio/wav"});
  let fileURL = URL.createObjectURL(blob);
  div.setAttribute("href", fileURL);
  div.setAttribute("download", `wav-${Date.now()}.wav`);
  div.click();
  })(wav);
*/

const transcriber = (wav) => {
    const audio_data = toBase64(new Uint8Array(wav.wav));
    const audio_metadata = {mime_type: "audio/wav"};
    const task = "transcribe";
    const parameters = {audio_data, audio_metadata, task};
    const msg = msgindex['faster-whisper/transcribe-data'];
    console.log("transcriber", wav.timelabel)
    return {time: wav.timelabel, data: sendmsg(msg, {parameters})};
};

const translator = (request) => {
    const data = request.fields.transcribed.data;
    const words = data.segments.flatMap((seg) => seg.words);
    const parameters = {
        source_language: data.target_language,
        target_language: languages[0],
        text: words.map(w => w.word).join("")
    };
    const msg = msgindex['seamlessm4t/translate'];
    return {translated: sendmsg(msg, {parameters}), eventId: request.id};
};

const translationRequests = (transcriptionWithId) => {
    const transcriptions = transcriptionWithId.records;
    if (!Array.isArray(transcriptions)) {return;}
    const t = transcriptions[0];
    if (!t?.fields?.transcribed) {return;}
    if (!languages.includes(t.fields?.transcribed.data.target_language)) {
        return t;
    }
    return;
}

const transcribedP = transcriber(wav);
const transcribed = Events.resolvePart(transcribedP);
// const transcriptionId = Behaviors.collect(0, transcribed, (old, _new) => old + 1);
const transcriptionWithId = {transcribed, type: "transcription"};
console.log("transcriptionWithId", transcriptionWithId);

Events.send(recordsWrite, [{fields: transcriptionWithId}]);
/*
const transcriptionSource = Behaviors.collect(null, Events.change(transcrptionQueryUrl), (old, queryUrl) => {
    old?.close();
    return new window.EventSource(queryUrl);
    });
    */

const transcriptionEvents = recordsUpdated;
console.log("transcriptionEvents", transcriptionEvents);

const requestTranslation = translationRequests(transcriptionEvents);
const translatedP = translator(requestTranslation);
const translated = Events.resolvePart(translatedP);
const translatedWithId = {...translated, eventId: translated.eventId, type: "translation"};

Events.send(recordsWrite, [{fields: translatedWithId}]);
console.log("translatedWithId", translatedWithId);
