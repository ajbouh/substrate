This provides an example skeleton for a quickjs reaction. It simply echos back
the arguments, including the static `cfg` parameters and any matching events.

This can be useful for testing queries, or as a starting point for building a
reaction.

```js

. events:try-reaction events: [
  {
    fields: {
      path: "/rules/defs/echo",
      conditions: [
        {basis_criteria: {
          bias: -1,
          where: { path: [{compare: "like", value: "prefix/%"}] }
        }}
      ],
      command: {
        cap: "msg",
        data: {
          cfg: {
            param1: "pass static params here for quickjs",
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
                function (args) {
                  return {
                    next: [{fields: args}]
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
