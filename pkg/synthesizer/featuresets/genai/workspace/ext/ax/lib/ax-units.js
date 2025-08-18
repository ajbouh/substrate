
export function axAIUnit({url, createChatCompletion}) {
    // look for the chat completion url compute the "base url"
    // hack, there are better ways to initialize and there are probably better ways to get the url we need.
    let createChatCompletionURL
    if (!url) {
        createChatCompletionURL = createChatCompletion.url
        url = createChatCompletionURL.replace(/\/chat\/completions$/, '')
    }

    return {
        source: JSON.stringify({
            apiURL: url,
            apiKey: 'dummy', // todo don't harcode this
            modelInfo: [],
            supportFor: {streaming: false}, // todo don't hardcode this
            config: {model: '/res/model/huggingface/local'}, // todo don't harcode this
        }),
        type: 'ax/ai',
    }
}

// export async function axOptimizerUnit() {
//     new AxMiPRO({
//       studentAI: ai,
//       optimizerEndpoint: `${server}/ax-optimizer`, // todo don't harcode this
//       onProgress: (update) => {
//         console.log(`Trial ${update.round}: ${update.currentScore.toFixed(3)}`);
//       },
//     }),
// }