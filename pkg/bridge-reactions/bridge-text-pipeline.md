# Bridge text-handling reactions

Prototypes for a series of reactions for producing events used in Bridge.

These reactions are meant to chain off of the transcriptions produced by the
process defined in `bridge-audio.md`.

WARNING: these have not been updated with the latest changes like the reaction
criteria schema, and `msg` format, so they're not currently functional.
The definitions in `bridge-text-pipeline-combined.md` are a bit more updated,
though are missing more documentation of what each reaction is for.

Create new space to store the event data:

```js
spaces:new
{
  created_at: ""
  href: "/substrate/v1/spaces/sp-01JMD68PYB46TJEQDZ55XWV2PA"
  space_id: "sp-01JMD68PYB46TJEQDZ55XWV2PA"
}
```

Using the space ID we can load the streaming events to watch as new events are
generated:

sp-01JMD68PYB46TJEQDZ55XWV2PA

https://substrate-a3a1.local/events;data=sp-01JMD68PYB46TJEQDZ55XWV2PA/stream/events

Go to the events service in navigator to set up more reactions:

```
$ go url: "/events;data=sp-01JRXG9ZRSH0T932MWNWC0KSAF/"
$ go url: "/events;data=sp-01JMD68PYB46TJEQDZ55XWV2PA/"
```

For bridge, we'll start with an event to record the start time of the session.
It's not used here yet, but will be important for the UI to show timestamps.

```js
. events:write events: [
  {
    conflict_keys: ["path", "type"],
    fields: {
      path: "/bridge/demo/session",
      type: "session",
      start_utc: "2025-02-18T22:52:43.313315"
    }
  }
]

{
  data_sha256s: Array(1) [null]
  fields_sha256s: Array(1) ["d183df48e17dccc568747edaa424592fb9f24bcd721ce4b2687982228784d2e9"]
  ids: Array(1) [
    0: "01JMDN2XHJ6346KY6FMSYG83P2"
  ]
}
```

We'll also record a "track" as a placeholder for now, but would be used to
associate audio events from the same stream.

```js
. events:write events: [
  {
    fields: {
      path: "/bridge/demo/tracks",
      links: {
        session: {
          rel: "eventref",
          attributes: {
            "eventref:event": "01JMDN2XHJ6346KY6FMSYG83P2",
            "eventref:start": 10000,
            "eventref:unit": "ms",
          }
        }
      }
    }
  }
]

{
  data_sha256s: Array(1) [null]
  fields_sha256s: Array(1) ["36edbbd3ec127115bb941bf4dfa33c4ec0e1b6505303b99f878685903036960c"]
  ids: Array(1) ["01JMDN5150X2F90A4SKWM0HX5T"]
}
```

Manually create a "segmented" transcription event which we'll use for testing
reactions.

```js
. events:write events: [
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

{
  data_sha256s: Array(1) [null]
  fields_sha256s: Array(1) ["e6fda670bfac493ed042b1176a0ba7d9424498825143697612b336a4a93cc4e6"]
  ids: Array(1) ["01JMDP5J477K7FZ6KYD3C13B7Y"]
}
```

Create a reaction to combine the text output from a "segmented" transcription
into a "flattened" text-only record. Some of the reactions will use this for
simplicity.

```js
. events:write events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/transcription/flattened",
      conditions: [
        { compare: { path: [{compare: "=", value: "/bridge/demo/transcription/segmented"}] } }
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
          "#/msg/data/parameters/arguments/0/dest_path": "#/data/dest_path",
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
                function ({events, dest_path}) {
                  return {
                    next: events.flatMap((evt) => {
                      const {segments, path, links, source_language, ...fields} = evt.fields;
                      if (!segments) {
                        return [];
                      }
                      return [{
                        fields: {
                          path: dest_path,
                          source_language,
                          text: segments.flatMap((seg) => seg.words).map((w) => w.word).join(""),
                          links: {
                            segmented: {
                              rel: "eventref",
                              attributes: {
                                "eventref:event": evt.id
                              }
                            },
                            ...links
                          },
                          ...fields,
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
  }
]
```

# Translation

We can create a Spanish transcription to test translation.

```js
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

Set up a translation reaction to look for any transcriptions which are not
in English, and attempt to translate them.

```js
events:write events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/translation/any-to-en3",
      conditions: [
        {compare: {
          path: [{compare: "=", value: "/bridge/demo/transcription/flattened"}],
          source_language: [{compare: "<>", value: "en"}]
        }},
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
          "#/msg/data/parameters/arguments/0/data": "#/data",
          "#/msg/data/parameters/arguments/0/command_url": "#/data/command_url",
          "#/msg/data/parameters/arguments/0/command": "#/data/command",
          "#/msg/data/parameters/arguments/0/target_language": "#/data/target_language"
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
                function ({events, dest_path, command_url, command, target_language}) {
                  return {
                    next: events.map((evt) => {
                      let {source_language, text} = evt.fields;
                      const {segments, ...translation} = reflector.run(command_url, command, {
                        source_language, text, target_language,
                      });
                      const translated_text = segments.map((seg) => seg.text).join("");
                      const {segmented} = evt.fields.links;
                      return {
                        fields: {
                          path: dest_path,
                          text: translated_text,
                          ...translation,
                          links: {
                            segmented,
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
  }
]
```

# Assistant

[] should we have another input stream for events that are manually entered for the assistant? one could take transcrpitions with a word and put it into the chat stream

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

Look for transcriptions containing the name "bridge", and turn it into a prompt
using a simple text-substitution template.

```js
events:write events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/chat-prompt",
      conditions: [
        {compare: {
          path: [{compare: "=", value: "/bridge/demo/transcription/flattened"}]
        }},
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
${user_input}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
          `
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/dest_path": "#/data/dest_path",
          "#/msg/data/parameters/arguments/0/response_path": "#/data/response_path",
          "#/msg/data/parameters/arguments/0/template": "#/data/template",
          "#/msg/data/parameters/arguments/0/filter_text": "#/data/filter_text"
          "#/msg/data/parameters/arguments/0/assistant_name": "#/data/name"
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
                function ({events, dest_path, response_path, filter_text, assistant_name, template}) {
                  return {
                    next: events.flatMap((evt) => {
                      let {text} = evt.fields;
                      if (text.toLowerCase().indexOf(filter_text) == -1) {
                        return [];
                      }
                      let prompt = template.replace("${user_input}", text);
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
  }
]
```

Look for any "prompt" events and submit them to llama-3 for completion.

```js
events:write events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/prompt-response",
      conditions: [
        {compare: {
          path: [{compare: "=", value: "/bridge/demo/assistant/prompt"}]
        }},
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
          "#/msg/data/parameters/arguments/0/command_url": "#/data/command_url",
          "#/msg/data/parameters/arguments/0/command": "#/data/command",
          "#/msg/data/parameters/arguments/0/prompt_params": "#/data/prompt_params"
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
                function ({events, command_url, command, prompt_params}) {
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
  }
]
```

# Tool call

a sample user-input event that should trigger a tool call to look up the weather

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

we should be able to produce the prompts from JS, but will need to convert the
JSON structure from REFLECT def index to something that works with the prompt

though maybe we use a filter to process messages incoming, look for filter text
and create an event that records the user prompt, and list of available tools

then separate reaction to handle submitting that to tool-call

```js
events:try-reaction events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/tool-select-prompt",
      conditions: [
        {compare: {
          path: [{compare: "=", value: "/bridge/demo/transcription/flattened"}]
        }},
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
<tools>${tools_json}</tools>

Use the following pydantic model json schema for each tool call you will make:
{"title": "FunctionCall", "type": "object", "properties": {"arguments": {"title": "Arguments", "type": "object"}, "name": {"title": "Name", "type": "string"}}, "required": ["arguments", "name"]}

For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:
<tool_call>
{"arguments": <args-dict>, "name": <function-name>}
</tool_call><|eot_id|>
<|start_header_id|>user<|end_header_id|>

${user_input}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>`
        },
        meta: {
          "#/data/parameters/events": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/dest_path": "#/data/dest_path",
          "#/msg/data/parameters/arguments/0/response_path": "#/data/response_path",
          "#/msg/data/parameters/arguments/0/template": "#/data/template",
          "#/msg/data/parameters/arguments/0/filter_text": "#/data/filter_text",
          "#/msg/data/parameters/arguments/0/tools_reflect_url": "#/data/tools_reflect_url",
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
                function ({events, dest_path, response_path, filter_text, template, tools_reflect_url}) {
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
                      let prompt = template.replace("${user_input}", text).replace("${tools_json}", tools_json);
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
  }
]
```

take the LLM output and just split out the `<tool_call>` results into objects
that could be run as a command

```js
events:try-reaction events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/tool-call-split",
      conditions: [
        {compare: {
          path: [{compare: "=", value: "/bridge/demo/tool/offer"}]
        }},
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
          "#/msg/data/parameters/arguments/0/dest_path": "#/data/dest_path",
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
                function ({events, dest_path}) {
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
  }
]
```

now call the offer if there is exactly one choice available

```js
events:try-reaction events: [
  {
    fields: {
      path: "/rules/defs/bridge/demo/assistant/tool-call-trigger",
      conditions: [
        {compare: {
          path: [{compare: "=", value: "/bridge/demo/tool/offer-parsed"}]
        }},
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
          "#/msg/data/parameters/arguments/0/dest_path": "#/data/dest_path",
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
                function ({events, dest_path}) {
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
