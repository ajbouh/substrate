const fs = require("fs");

const API_URL = 'http://127.0.0.1:8080'

let slot_id = -1;

async function chat_completion(instruction, question) {
    const n_keep = await tokenize(instruction).length
    const chat = []

    const result = await fetch(`${API_URL}/completion`, {
        method: 'POST',
        body: JSON.stringify({
            prompt: format_prompt5(chat, instruction, question),
            temperature: 0.25,
            top_k: 40,
            top_p: 0.9,
            n_keep: n_keep,
            n_predict: 256,
            cache_prompt: false,
            slot_id,
            stop: ["\n### Human:"], // stop completion after generating this
            grammar: null,
            stream: true,
        })
    });

    if (!result.ok) {
        return
    }

    let answer = ''

    for await (let chunk of result.body) {
        const ts = Buffer.from(chunk).toString('utf8').split("\n\n");
        let done = false;
        for (let i = 0; i < ts.length; i++) {
            const t = ts[i];
            console.log("t", t);
            if (t.startsWith('data: ')) {
                let message;
                try {
                    message = JSON.parse(t.substring(6).trim())
                } catch (e) {
                    console.log("\ncannot parse:", t);
                    return;
                }
                slot_id = message.slot_id
                answer += message.content
                process.stdout.write(message.content)
                if (message.stop) {
                    if (message.truncated) {
                        chat.shift()
                    }
                    done = true;
                    break;
                }
            }
        }
        if (done) {
            break;
        }
    }

    process.stdout.write('\n')
    chat.push({ human: question, assistant: answer.trimStart() })
    return chat;
}

function format_prompt(chat, instruction, question) {
    return `${instruction}\n${
        chat.map(m =>`### Human: ${m.human}\n### Assistant: ${m.assistant}`).join("\n")
    }\n### Human: ${question}\n### Assistant:`
}

function format_prompt2(chat, instruction, question) {
    return `
BEGININPUT
${question}
ENDINPUT
BEGININSTRUCTION
Summarize the input in around 130 words.
ENDINSTRUCTION`.trim();
}

function format_prompt3(chat, instruction, question) {
    return `
BEGININPUT
BEGINCONTEXT
${question}
ENDCONTEXT
ENDINPUT
BEGININSTRUCTION
${instruction}
ENDINSTRUCTION`.trim();
}

function format_prompt4(chat, instruction, question) {
    return `
[INST]
${instruction}
${question}
[/INST]
`.trim();
}

function format_prompt5(chat, instruction, question) {
    return `${instruction}\n${question}`
}

async function tokenize(content) {
    const result = await fetch(`${API_URL}/tokenize`, {
        method: 'POST',
        body: JSON.stringify({ content })
    })

    if (!result.ok) {
        return []
    }

    return await result.json().tokens
}

function loadText(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

async function makeChunks(fileName) {
    let text = await loadText(fileName);
    let paragraphs = [];

    let limit = Math.floor(4096 * 0.7);
    let overlap = Math.floor(4096 * 0.05);

    let index = 0;

    while (index <= text.length) {
        paragraphs.push(text.slice(index, index + limit));
        index = index + limit - overlap;
    }
    return paragraphs;
}

async function makeList(chunk) {
    const instruction = `You output a plain text. Each line represents a description of a historical event or artifact created. A line begins with year or date, followed by a ":", and the description of event or artifact.  First, extract names of historical events and artifacts mentioned. If you know the year of an invention or artifact mention in text, add them. For example, if the year of an event is 1994, and the event is "Introduction of CompactFlash", the line in output is
1994: Introduction of CompactFlash`;

    // const instruction = `First, extract names of historical events and artifacts mentioned. If you know the year or the time period of an invention or artifact mention in text, Do not include anything that is not mentioned in the text. The format of output for each event is one line that starts with the year or time period, followed by a colon and the description of the event.`;

    const completion = await chat_completion(instruction, chunk);
    return completion;
}

async function main() {
    if (process.argv.length < 3) {
        console.log("provide the name of the text file");
        return;
    }

    let list = [];

    let fileName = process.argv[process.argv.length - 1];
    let chunks = await makeChunks(fileName);

    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        let result = await makeList(chunk);
        if (result) {
            list.push(result[0].assistant);
        } else {
            console.log("could not handle chunk number:" + i);
        }
    }

    console.log("output",list);
}

main();

/* globals fetch */
