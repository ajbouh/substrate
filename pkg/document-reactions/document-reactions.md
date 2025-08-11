Testing reaction to process LLM prompts

```
$ go url: "/events;data=sp-01JTPF6XH6H4ACGYJWFNGA2ACS"
```

Set up an event which contains the prompt input we want to test:

```js

. events:write events: [
  {
    fields: {
      path: "/tests/poem/prompt",
      response_path: "/tests/poem/result",
      prompt: `
      <|begin_of_text|><|start_header_id|>system<|end_header_id|>
A chat between ASSISTANT (named bridge) and a USER.

bridge is a conversational, vocal, artificial intelligence assistant.

bridge's job is to converse with humans to help them accomplish goals.

bridge is able to help with a wide variety of tasks from answering questions to assisting the human with creative writing.

Overall bridge is a powerful system that can help humans with a wide range of tasks and provide valuable insights as well as taking actions for the human.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
write me a poem<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
      `
    }
  }
]

```

Reaction should pass the prompt to llama-3 model, and write the response.
However, I'm getting a "400 Bad Request" from llama-3, the logs only show:

```
INFO:     10.89.1.2:39848 - "POST /v1/completions HTTP/1.1" 400 Bad Request
```

Setting `cfg.debug` to `true` just echoes out the parameters to `reflector.run`
to make sure it seems like the right values.

```js

. events:try-reaction events: [
  {
    fields: {
      path: "/rules/defs/prompt-response",
      conditions: [
        {basis_criteria: {
          bias: -1,
          where: { path: [{compare: "like", value: "%/prompt"}] }
        }},
      ],
      command: {
        cap: "msg",
        data: {
          cfg: {
            debug: false,
            command_url: "http://substrate:8080/substrate/v1/msgindex",
            command: "llama-3-8b-instruct-awq/completion",
            prompt_params: {
              max_tokens: 3000
            }
          }
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data/cfg"
        },
        msg_out: {
          "#/returns": "#/msg/data/returns/result",
        },
        msg: {
          cap: "reflectedmsg",
          url: "/quickjs/",
          name: "eval",
          data: {
            url: "/quickjs/",
            parameters: {
              source: `
                function ({events, cfg}) {
                  const { command_url, command, prompt_params } = cfg;
                  return {
                    next: events.map((evt) => {
                      let {prompt, links, response_path, context} = evt.fields;
                      if (cfg.debug) {
                        return {
                          fields: {
                            command_url, command, args: {
                              prompt,
                              ...prompt_params
                            }
                          }
                        }
                      }
                      const completion = reflector.run(command_url, command, {
                        prompt,
                        ...prompt_params
                      });
                      return {
                        fields: {
                          path: response_path,
                          completion,
                          context,
                          links: {
                            prompt: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            },
                            source: links.source,
                          },
                        }
                      };
                    })
                  }
                }
              `,
            }
          }
        }
      }
    }
  }
]

```

Running the corresponding command directly in navigator gives a successful response:

```js
/substrate/v1/msgindex llama-3-8b-instruct-awq/completion max_tokens: 3000 prompt: `
      <|begin_of_text|><|start_header_id|>system<|end_header_id|>
A chat between ASSISTANT (named bridge) and a USER.

bridge is a conversational, vocal, artificial intelligence assistant.

bridge's job is to converse with humans to help them accomplish goals.

bridge is able to help with a wide variety of tasks from answering questions to assisting the human with creative writing.

Overall bridge is a powerful system that can help humans with a wide range of tasks and provide valuable insights as well as taking actions for the human.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
write me a poem<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
      `
```
