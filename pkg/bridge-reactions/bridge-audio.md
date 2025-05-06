In substrate, go to the events service to set up reactions:

```
$ go url: "/events;data=sp-01JTH6QEYQ022KPQXS4T2FP776"
```

Create a "session" event to record the time that

```js

. events:write events: [
  {
    conflict_keys: ["path"],
    fields: {
      path: "/bridge-demo/session",
      start_utc: "2025-02-18T22:52:43.313315"
    }
  }
]

```

Create the reactions to process audio as chunks, and then send those chunks for
transcription:

```js

. events:write events: [
  {
    fields: {
      path: "/rules/defs/bridge/audio-activity",
      conditions: [
        {basis_criteria: {
          bias: -1,
          where: { path: [{compare: "like", value: "%/tracks/%/audio"}] }
        }},
        {basis_criteria: {
          bias: -1,
          where: { path: [{compare: "like", value: "%/tracks/%/pending-activity"}] }
        }}
      ],
      command: {
        cap: "msg",
        data: {
          cfg: {
            minChunkSize: 100000
          }
        },
        meta: {
          "#/data/parameters": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data/cfg",
        },
        msg_out: {
          "#/returns": "#/msg/data/returns/result",
        },
        msg: {
          cap: "reflectedmsg",
          url: "/quickjs/",
          name: "eval",
          data: {
            parameters: {
              source: `
                function chunk({ events, cfg }) {
                  const { minChunkSize, pendingExpireAfterMS } = cfg;
                  const now = Date.now();
                  const expiresUTC = now + pendingExpireAfterMS;
                  const r = events.reduce(
                    (acc, event) => {
                      const path = event.fields.path;
                      if (path.endsWith('/pending-activity')) {
                        acc.pending.set(path, event);
                        return acc;
                      }
                      if (!path.endsWith('/audio')) {
                        return acc;
                      }
                      const pendingPath = path.replace(/\/audio$/, '/pending-activity');
                      const pending = {
                        fields: {
                          ...(
                            acc.pending.get(pendingPath) || {
                              fields: {
                                path: pendingPath,
                                audio_path: path,
                                start: event.fields.ts[0]
                              }
                            }
                          ).fields,
                          end: event.fields.ts[event.fields.ts.length - 1],
                          expiresUTC
                        }
                      };
                      let chunkSize = pending.fields.end - pending.fields.start;
                      if (chunkSize >= minChunkSize) {
                        acc.events.push({
                          fields: {
                            path: path.replace(/\/audio$/, '/activity'),
                            audio_path: path,
                            start: pending.fields.start,
                            end: pending.fields.end
                          }
                        });
                        acc.pending.delete(pendingPath);
                      } else {
                        acc.pending.set(pendingPath, pending);
                      }
                      return acc;
                    },
                    {
                      pending: new Map(),
                      events: []
                    }
                  );
                  const pending = Array.from(r.pending.values()).map((event) => {
                    if (event.fields.expiresUTC > now) {
                      return event;
                    }
                    const { start, end, path, audio_path } = event.fields;
                    return {
                      fields: {
                        path: path.replace(/\/pending-activity$/, '/activity'),
                        audio_path,
                        start,
                        end
                      }
                    };
                  });
                  return { next: [...r.events, ...pending] };
                }
              `
            }
          }
        }
      }
    }
  },
  {
    fields: {
      path: "/rules/defs/bridge/audio-transcription",
      conditions: [
        {basis_criteria: {
          limit: 10,
          bias: -1,
          where: { path: [{compare: "like", value: "%/tracks/%/activity"}], audio_path: [{compare: "like", value: "%"}] }
        }}
      ],
      command: {
        cap: "msg",
        meta: {
          "#/data/parameters": {"type": "any"},
        },
        data: {
          cfg: {
            command_url: "http://substrate:8080/substrate/v1/msgindex",
            command: "faster-whisper/transcribe-url",
            stream_url_prefix: "http://substrate:8080/webrtc-stream;event_prefix=bridge-demo;sessions=sp-01JTH6QEYQ022KPQXS4T2FP776/audio/wav/",
            dest_path: "/bridge-demo/transcription/segmented",
          }
        },
        meta: {
          "#/data/parameters": {"type": "any"},
        },
        msg_in: {
          "#/msg/data/parameters/arguments/0/events": "#/data/parameters/events",
          "#/msg/data/parameters/arguments/0/cfg": "#/data/cfg",
        },
        msg_out: {
          "#/returns": "#/msg/data/returns/result",
        },
        msg: {
          cap: "reflectedmsg",
          url: "/quickjs/",
          name: "eval",
          data: {
            parameters: {
              source: `
                function x({ events, cfg: {command_url, command, stream_url_prefix, dest_path} }) {
                  return {
                    next: events.flatMap((evt) => {
                      let {start, end, audio_path} = evt.fields;
                      const track_id = audio_path.split("/").slice(-2)[0]
                      const audio_url = stream_url_prefix + track_id + "?segments=" + encodeURIComponent(JSON.stringify([{start, end}]))
                      const maxRetries = 10;
                      for (let i = 1; i <= maxRetries; i++) {
                        try {
                          const {segments} = reflector.run(command_url, command, {
                            task: "transcribe",
                            audio_url,
                            audio_metadata: {mime_type: "audio/wav"}
                          });
                          if (segments.length === 0) return [];
                          return [{
                            fields: {
                              path: dest_path,
                              segments, evt, audio_url,
                              links: {
                                source: {
                                  rel: "eventref",
                                  attributes: {
                                    "eventref:event": evt.id
                                  }
                                },
                                track: {
                                  rel: "eventref",
                                  attributes: {
                                    "eventref:event": track_id,
                                    //"eventref:start": 0,
                                    //"eventref:end": 100,
                                    //"eventref:unit": "ms",
                                    //"eventref:axis": "audiotrack/1"
                                  }
                                }
                              },
                            }
                          }];
                        } catch (error) {
                          if (i === maxRetries) {
                            return [{
                              fields: {
                                path: dest_path,
                                evt, audio_url, error,
                              }
                            }]
                          }
                        }
                      }
                    })
                  }
                }
              `
            }
          }
        }
      }
    }
  }
]

```

Load the webrtc page to start recording audio:

https://substrate-a3a1.local/webrtc-stream;event_prefix=bridge-demo;sessions=sp-01JTH6QEYQ022KPQXS4T2FP776/

Run `pkg/synthesizer/server.mjs`, then open a "transcript" panel:

http://localhost:8000/?recordstore=https://substrate-a3a1.local/events;data=sp-01JTH6QEYQ022KPQXS4T2FP776
