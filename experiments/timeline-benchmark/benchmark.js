const fs = require("fs");
//const API_URL = 'http://127.0.0.1:8080'
const API_URL = 'http://substrate.home.arpa:8081'
/*

Run this with a command:

# node benchmark.js test.txt expected.txt

Both test.txt and expected.txt are line oriented text. Each line is in the form of:

<year or date>: <description>

for example

1994: Introduction of CompactFlash

We check if entries in "text" are in "expected", and also test does not have excess entries.
The result is with three numbers. (1) total number of entries, (2) missed entries, (3) excess entries. If we compute one score, it'd be:

(1) - ((2) + (3)) / (1)

*/

function load(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

/*
function parse(text) {
    let lines = text.split("\n");
    return lines.map((line) => {
        let colon = line.indexOf(":");
        if (colon < 0) {return null;}
        let head = line.slice(0, colon);
        let tail = line.slice(colon + 1);

        if (head.length < 1) {return null;}
        if (tail.length < 1) {return null;}

        return {
            date: head,
            description: tail
        };
    }).filter(a => a);
}

*/

async function compare(tests, corrects) {
    // let format = (obj) => `${obj.date}: ${obj.description}`;
    let answer = {hit: {}, notMissed: {}};

    for (let j = 0; j < tests.length; j++) {
        let sample = tests[j];
        let count = 0;
        for (let i = 0; i < corrects.length; i++) {
            const correct = corrects[i];
            let result = await test(sample, correct);
            console.log("result", result.trim());
            if (/^.*yes[^a-z]*$/i.test(result.trim()) ||
                /^[^a-z]*yes/i.test(result.trim())) {
                count++;
                console.log(`yes, ${sample}, ${correct}`);
                answer.notMissed[i] = true;
            } else {
                console.log(`no, ${sample}, ${correct}`);
            }
        }
        answer.hit[j] = count;
    }
    return answer;
}

async function test(t, c) {
    let instruction = `I will give you two entries describing historical events. I want you to confirm if these two entries describe the same event. Please consider the year provided, the nature of the event, and any specific details mentioned in both descriptions to make your analysis. I'll give you a few example. If the two entries are "1994: Introduction of CompactFlash" and "1994: CompactFlash was introduced by SanDisk", then the answer you give me is "yes". If the two entries are "1945: Article "As We May Think" by Vannevar Bush" and "1945: Creation of the ENIAC" then the answer is "no". Your answer should be one word, yes or no. The answer should be strictly in one word "yes" or "no", without any markup or other text.`;

    let question = `Here are two entries: "${t}" and "${c}" What is your answer?`;

    const result = await chat_completion(instruction, question);
    return result;
}

async function chat_completion(instruction, question) {
    const n_keep = await tokenize(instruction).then((tokens) => tokens.length);
    const chat = [];
    const slot_id = -1;

    const prompt = format_prompt5(chat, instruction, question);

    const result = await fetch(`${API_URL}/completion`, {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
            frequency_penalty: 0,
            grammar: "",
            image_data: [],
            mirostat: 0,
            mirostat_eta: 0.1,
            mirostat_tau: 5,
            n_predict: 4006,
            n_probs: 0,
            n_keep,
            presence_penalty: 0,
            prompt,
            temperature: 0.7,
            repeat_last_n: 256,
            repeat_penalty: 1.18,
            cache_prompt: false,
            slot_id,
            stop: ['</s>', 'Llama:', 'User:'],
            stream: false,
            tfs_z: 1,
            top_k: 40,
            top_p: 0.5,
            typical_p: 1,
        })
    })

    if (!result.ok) {
        return
    }

    const text = await result.text();

    try {
        let json = JSON.parse(text.trim());
        return json.content;
    } catch (e) {
        console.log(e);
    }
}

function format_prompt5(chat, instruction, question) {
    return `${instruction}\n\nUser: ${question}\n\nLLama:`
}

async function tokenize(content) {
    const result = await fetch(`${API_URL}/tokenize`, {
        method: 'POST',
        body: JSON.stringify({ content })
    })

    if (!result.ok) {
        return []
    }

    return result.json().then((json) => {
        return json.tokens;
    });
}

async function main() {
    if (process.argv.length < 4) {
        console.log("provide the name of the test file and correct file");
        return;
    }

    let correctFileName = process.argv[process.argv.length - 1];
    let testFileName = process.argv[process.argv.length - 2];


    const tests = (await load(testFileName)).split("\n").filter((l) => l.length > 0);
    const corrects = (await load(correctFileName)).split("\n").filter((l) => l.length > 0);

    const results = await compare(tests, corrects);
    let total = corrects.length;
    let hit = Object.keys(results.hit).map((k) => results.hit[k]).reduce((a, b) => a + b, 0);
    let notMissed = Object.keys(results.notMissed).length;
    let missed = total - notMissed;
    console.log(results);
    console.log(`total = ${total}, hit = ${hit}, missed = ${missed}`);
}

main();

/* globals fetch */
