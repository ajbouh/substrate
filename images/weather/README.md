Dummy "weather" service to demonstrate adding new commands to bridge.

In bridge, you can add it to the session with the command-panel, or in
the console:

```
window.substrate.r0.commands.run(
	'workingset:add_url',
	{url: 'http://substrate:8080/weather', key: 'weather'}
).then(console.log)
```

It can be directly invoked as `workingset:weather:hourly` in the command-panel,
or via voice command like

> bridge, what's the weather in <location>?

The forecast currently just returns a canned response based on the example from
this API, but could be expanded to wrap this or another similar service:
https://open-meteo.com/
