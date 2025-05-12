# Bridge text-handling reactions

This is an iteration of the prototypes from `bridge-text-pipeline.md` where
the definitions have been combined into a smaller set of `event:write` calls.

These have been updated more recently in terms of schema & syntax, though are
lacking the documentation from the earlier document.

```js

events:write events: [
  {
    conflict_keys: ["path"],
    fields: {
      path: "/bridge/demo/session",
      start_utc: "2025-02-18T22:52:43.313315"
    }
  }
]

```

```js

events:write events: [
  {
    fields: {
      path: "/bridge/demo/tracks",
      links: {
        session: {
          rel: "eventref",
          attributes: {
            "eventref:event": "01JQCRKE4EJNEYEBJVMKWA1Z85",
            "eventref:start": 0,
            "eventref:unit": "ms",
          }
        }
      }
    }
  }
]

track = '01JQCRMKKW9GCZBS6XHZRX4H3X'

```

Manually create a "segmented" transcription event which we'll use for testing
reactions.

```js
events:write events: [
  {
    fields: {
      path: "/bridge/demo/transcription/segmented",
      source_language: "en",
      segments: [
        {
          words: [
            { word: "Hello ", start: 0, end: 5 },
            { word: "world", start: 6, end: 11 },
          ],
        }
      ],
      links: {
        track: {
          rel: "eventref",
          attributes: {
            "eventref:event": "01JQCRMKKW9GCZBS6XHZRX4H3X",
            "eventref:start": 0,
            "eventref:end": 100,
            "eventref:unit": "ms",
            "eventref:axis": "audiotrack/1"
          }
        }
      }
    }
  }
]
```

We can create a Spanish transcription to test translation.

```js
. events:write events: [
  {
    fields: {
      path: "/bridge/demo/transcription/segmented",
      source_language: "es",
      segments: [
        {
          words: [
            { word: "Hola ", start: 0, end: 5 },
            { word: "mundo", start: 6, end: 11 },
          ],
        }
      ],
      links: {
        track: {
          rel: "eventref",
          attributes: {
            "eventref:event": "01JQCRMKKW9GCZBS6XHZRX4H3X",
            "eventref:start": 0,
            "eventref:end": 100,
            "eventref:unit": "ms",
            "eventref:axis": "audiotrack/1"
          }
        }
      }
    }
  }
]

events:write events: [
  {
    fields: {
      path: "/bridge/demo/transcription/flattened",
      source_language: "es",
      text: "hola, como estas",
      links: {
        track: {
          rel: "eventref",
          attributes: {
            "eventref:event": "01JMDN5150X2F90A4SKWM0HX5T",
            "eventref:start": 0,
            "eventref:end": 100,
            "eventref:unit": "ms",
            "eventref:axis": "audiotrack/1"
          }
        }
      }
    }
  }
]
```

Create a transcription which requests calling bridge with a prompt.

```js
events:write events: [
  {
    fields: {
      path: "/bridge/demo/transcription/flattened",
      source_language: "en",
      text: "hey bridge, write me a poem",
      links: {
        track: {
          rel: "eventref",
          attributes: {
            "eventref:event": "01JMDN5150X2F90A4SKWM0HX5T",
            "eventref:start": 0,
            "eventref:end": 100,
            "eventref:unit": "ms",
            "eventref:axis": "audiotrack/1"
          }
        }
      }
    }
  }
]
```

```js
events:write events: [
  {
    fields: {
      path: "/bridge/demo/transcription/flattened",
      source_language: "en",
      text: "hey bridge, what is the weather in 94114?",
      links: {
        track: {
          rel: "eventref",
          attributes: {
            "eventref:event": "01JMDN5150X2F90A4SKWM0HX5T",
            "eventref:start": 0,
            "eventref:end": 100,
            "eventref:unit": "ms",
            "eventref:axis": "audiotrack/1"
          }
        }
      }
    }
  }
]
```

# Reactions

```js

events:write events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/transcription/flattened",
      conditions: [
        {basis_criteria: { compare: { path: [{compare: "=", value: "/bridge/demo/transcription/segmented"}] } }}
      ],
      command: {
        data: {
          dest_path: "/bridge/demo/transcription/flattened"
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data",
        },
        msg_out: {
          "#/data/returns/next": "#/msg/data/returns/result/next",
        },
        msg: {
          cap: "reflect",
          data: {
            url: "/quickjs/",
            name: "eval",
            parameters: {
              source: `
                function ({events, cfg: {dest_path}}) {
                  return {
                    next: events.flatMap((evt) => {
                      const {segments, source_language} = evt.fields;
                      if (!segments) {
                        return [];
                      }
                      return [{
                        fields: {
                          path: dest_path,
                          source_language,
                          text: segments.flatMap((seg) => seg.words).map((w) => w.word).join(""),
                          links: {
                            source: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            }
                          }
                        }
                      }]
                    })
                  }
                }
              `,
            }
          }
        }
      }
    }
  },
  {
    fields: {
      path: "/rules/defs/bridge/demo/translation/any-to-en3",
      conditions: [
        {basis_criteria: {compare: {
          path: [{compare: "=", value: "/bridge/demo/transcription/flattened"}],
          source_language: [{compare: "<>", value: "en"}]
        }}},
      ],
      command: {
        data: {
          dest_path: "/bridge/demo/translation",
          command_url: "http://substrate:8080/substrate/v1/msgindex",
          command: "seamlessm4t/translate",
          target_language: "en"
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data",
        },
        msg_out: {
          "#/data/returns/next": "#/msg/data/returns/result/next",
        },
        msg: {
          cap: "reflect",
          data: {
            url: "/quickjs/",
            name: "eval",
            parameters: {
              source: `
                function ({events, cfg: {dest_path, command_url, command, target_language}}) {
                  return {
                    next: events.map((evt) => {
                      let {source_language, text} = evt.fields;
                      const {segments, ...translation} = reflector.run(command_url, command, {
                        source_language, text, target_language,
                      });
                      const translated_text = segments.map((seg) => seg.text).join("");
                      return {
                        fields: {
                          path: dest_path,
                          text: translated_text,
                          ...translation,
                          links: {
                            source: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            },
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
  },
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/chat-prompt",
      conditions: [
        {basis_criteria: {compare: {
          path: [{compare: "=", value: "/bridge/demo/transcription/flattened"}]
        }}},
      ],
      command: {
        data: {
          dest_path: "/bridge/demo/assistant/prompt",
          response_path: "/bridge/demo/assistant/response",
          filter_text: "bridge",
          name: "bridge",
          template: `
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
A chat between ASSISTANT (named bridge) and a USER.

bridge is a conversational, vocal, artificial intelligence assistant.

bridge's job is to converse with humans to help them accomplish goals.

bridge is able to help with a wide variety of tasks from answering questions to assisting the human with creative writing.

Overall bridge is a powerful system that can help humans with a wide range of tasks and provide valuable insights as well as taking actions for the human.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
\${user_input}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
          `
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data",
        },
        msg_out: {
          "#/data/returns/next": "#/msg/data/returns/result/next",
        },
        msg: {
          cap: "reflect",
          data: {
            url: "/quickjs/",
            name: "eval",
            parameters: {
              source: `
                function ({events, cfg: {dest_path, response_path, filter_text, assistant_name, template}}) {
                  return {
                    next: events.flatMap((evt) => {
                      let {text} = evt.fields;
                      if (text.toLowerCase().indexOf(filter_text) == -1) {
                        return [];
                      }
                      let prompt = template.replace("\${user_input}", text);
                      return [{
                        fields: {
                          path: dest_path,
                          response_path,
                          assistant_name,
                          prompt,
                          links: {
                            source: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            },
                          },
                        }
                      }];
                    })
                  }
                }
              `,
            }
          }
        }
      }
    }
  },
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/prompt-response",
      conditions: [
        {basis_criteria: {compare: {
          path: [{compare: "=", value: "/bridge/demo/assistant/prompt"}]
        }}},
      ],
      command: {
        data: {
          command_url: "http://substrate:8080/substrate/v1/msgindex",
          command: "llama-3-8b-instruct-awq/completion",
          prompt_params: {
            max_tokens: 3000
          }
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data",
        },
        msg_out: {
          "#/data/returns/next": "#/msg/data/returns/result/next",
        },
        msg: {
          cap: "reflect",
          data: {
            url: "/quickjs/",
            name: "eval",
            parameters: {
              source: `
                function ({events, cfg: {command_url, command, prompt_params}}) {
                  return {
                    next: events.map((evt) => {
                      let {assistant_name, prompt, links, response_path, context} = evt.fields;
                      const completion = reflector.run(command_url, command, {
                        prompt,
                        ...prompt_params
                      });
                      return {
                        fields: {
                          path: response_path,
                          assistant_name,
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
  },
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/tool-select-prompt",
      conditions: [
        {basis_criteria: {compare: {
          path: [{compare: "=", value: "/bridge/demo/transcription/flattened"}]
        }}},
      ],
      command: {
        data: {
          dest_path: "/bridge/demo/assistant/prompt",
          response_path: "/bridge/demo/tool/offer",
          filter_text: "bridge",
          tools_reflect_url: "/weather/",
          template: `
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a function calling AI model.
You are provided with function signatures within <tools></tools> XML tags.
You may call one or more functions to assist with the user query.
Don't make assumptions about what values to plug into functions.
Here are the available tools:
<tools>\${tools_json}</tools>

Use the following pydantic model json schema for each tool call you will make:
{"title": "FunctionCall", "type": "object", "properties": {"arguments": {"title": "Arguments", "type": "object"}, "name": {"title": "Name", "type": "string"}}, "required": ["arguments", "name"]}

For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:
<tool_call>
{"arguments": <args-dict>, "name": <function-name>}
</tool_call><|eot_id|>
<|start_header_id|>user<|end_header_id|>

\${user_input}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>`
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data",
        },
        msg_out: {
          "#/data/returns/next": "#/msg/data/returns/result/next",
        },
        msg: {
          cap: "reflect",
          data: {
            url: "/quickjs/",
            name: "eval",
            parameters: {
              source: `
                function ({events, cfg: {dest_path, response_path, filter_text, template, tools_reflect_url}}) {
                  const index = reflector.reflect(tools_reflect_url);
                  // TODO probably need to convert the structure here
                  const tools_json = JSON.stringify(index);
                  return {
                    next: events.flatMap((evt) => {
                    	// TODO filter first to avoid reflect if we don't have matching events
                      let {text} = evt.fields;
                      if (text.toLowerCase().indexOf(filter_text) == -1) {
                        return [];
                      }
                      let prompt = template.replace("\${user_input}", text).replace("\${tools_json}", tools_json);
                      return [{
                        fields: {
                          path: dest_path,
                          response_path,
                          prompt,
                          context: {
                            tools_reflect_url,
                          },
                          links: {
                            source: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            },
                          },
                        }
                      }];
                    })
                  }
                }
              `,
            }
          }
        }
      }
    }
  },
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/tool-call-split",
      conditions: [
        {basis_criteria: {compare: {
          path: [{compare: "=", value: "/bridge/demo/tool/offer"}]
        }}},
      ],
      command: {
        data: {
          dest_path: "/bridge/demo/tool/offer-parsed",
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data",
        },
        msg_out: {
          "#/data/returns/next": "#/msg/data/returns/result/next",
        },
        msg: {
          cap: "reflect",
          data: {
            url: "/quickjs/",
            name: "eval",
            parameters: {
              source: `
                function ({events, cfg: {dest_path}}) {
                  const cut = (s, sep) => {
                    const i = s.indexOf(sep);
                    if (i === -1) {
                      return [s, "", false];
                    }
                    return [s.slice(0, i), s.slice(i + sep.length), true];
                  }
                  const cutInside = (s, open, close) => {
                    let r = [];
                    while (true) {
                      const [_, a, ok] = cut(s, open);
                      if (!ok) {
                        break;
                      }
                      const [b, c, ok2] = cut(a, close);
                      if (!ok2) {
                        break;
                      }
                      r.push(b);
                      s = c;
                    }
                    return r;
                  }
                  return {
                    next: events.flatMap((evt) => {
                      const choices = evt.fields.completion.choices.map(({text}) => {
                        return cutInside(text, "<tool_call>", "</tool_call>").map(JSON.parse);
                      });
                      return [{
                        fields: {
                          path: dest_path,
                          choices,
                          context: evt.fields.context,
                          links: {
                            source: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            },
                          },
                        }
                      }];
                    })
                  }
                }
              `,
            }
          }
        }
      }
    }
  },
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/tool-call-trigger",
      conditions: [
        {basis_criteria: {compare: {
          path: [{compare: "=", value: "/bridge/demo/tool/offer-parsed"}]
        }}},
      ],
      command: {
        data: {
          dest_path: "/bridge/demo/tool/trigger",
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data",
        },
        msg_out: {
          "#/data/returns/next": "#/msg/data/returns/result/next",
        },
        msg: {
          cap: "reflect",
          data: {
            url: "/quickjs/",
            name: "eval",
            parameters: {
              source: `
                function ({events, cfg: {dest_path}}) {
                  isEmpty = (obj) => {
                    for (const prop in obj) {
                      if (Object.hasOwn(obj, prop)) {
                        return false;
                      }
                    }
                    return true;
                  }
                  return {
                    next: events.flatMap((evt) => {
                      const {choices, context} = evt.fields;
                      if (choices == null || context == null) { return []; }
                      const [choice, extra_choices] = choices;
                      if (choice == null || extra_choices != null) { return []; }
                      const [command, extra_commands] = choice;
                      if (command == null || extra_commands != null) { return []; }

                      const {tools_reflect_url} = context;
                      if (tools_reflect_url == null) { return []; }

                      // temporary hack while there's a bug calling commands with empty arguments
                      if (!command.arguments || isEmpty(command.arguments)) {
                        return [];
                      }

                      const result = reflector.run(tools_reflect_url, command.name, command.arguments);

                      return [{
                        fields: {
                          path: dest_path,
                          result,
                          command,
                          context,
                          links: {
                            source: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            },
                          },
                        }
                      }];
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
