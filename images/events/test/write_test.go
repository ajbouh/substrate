package events_test

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/ajbouh/substrate/images/events/units"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

var eventJSON = `{
	"events": [
	  {
		"fields": {
		  "path": "/bridge/audio-events/tracks/01JRV5CMG8VAV4QFRDSKE376GY/audio",
		  "ts": [
			987471346,
			987472306,
			987473266,
			987474226,
			987475186,
			987476146,
			987477106,
			987478066,
			987479026,
			987479986,
			987480946
		  ],
		  "ix": [
			0,
			85,
			167,
			257,
			343,
			424,
			512,
			601,
			693,
			784,
			886
		  ],
		  "sz": [
			85,
			82,
			90,
			86,
			81,
			88,
			89,
			92,
			91,
			102,
			101
		  ],
		  "encoding": {
			"mime_type": "audio/opus",
			"sample_rate": 48000,
			"channels": 2
		  },
		  "track": "01JRV5CMG8VAV4QFRDSKE376GY"
		},
		"data": "kG8TgDrbnfIOYtCzvt4AAREAywB4JxibjeOT+ioAyW/buUBOp5WUgYx5/3T8usJUQeNtKEnEKlloc2cppN/eu4Iah4XDf5bbs41zFrIeQncdTn26nJBvE4E626GyDmLQs77eAAERAMwAeCGjoNMK3j0szHzyDEo9ZfJUtY4Au5vj6t9j/6evAey5Nsg1NzEv2hNp8TtKDmqb+IDe4S3ATBlzvdDARa2QbxOCOtulcg5i0LO+3gABEQDNAHgertYuIcwCihPG5+n5bFrfnYq7qks9OIavVJ/5kklRqJ0VT+aBgd5RXYkfZfWKNcLOH2TCODaHY6JuxjCJP2uART6FHJ6QbxODOtupMg5i0LO+3gABEQDOAHgersmRrMMAw8y9/aHQ2T4Ft+PTSy0/1NSKDSCznXz/aZJp0lznDdaA7pxRY/azhI9CBcXeJXwJZqx7q6EBduPLrpBvE4Q626zyDmLQs77eAAERAM8AeB6tA8QmoOqQdBJEbGK4rAqYSvHzrzZswC7CMzXtEihkoWC+b/eWw31X1Uc7/i+SFDMXK6M7qDIS01uWW5BvE4U627CyDmLQs77eAAERANAAeAKw0u1YycPO4vSHozAXmgOsKdxT3xeXsnsghd/4P3VVV1U1yp89M8Lb+PCXOw3n9zOAYKnFgovT1NsNMm04ACquJ5+QbxOGOtu0cg5i0LO+3gABEQDRAHgbfQEKBolrGOsTbIE1Xey18W4mtuZXYO46S2sewKdGl6FUzpzxIz+avKmfElfob0YD9xLz/O248EL6IGKbiIdXt545r5BvE4c627gyDmLQs77eAAERANIAeBuJw5rQzZpOBhtbhro+ibY/z/mqAfXdeMel9pCw6S4C9njwlu6gyMaV1XOfBHVQZoufJyiOQrkfvrENsXPha4A1UwrsPpiukG8TiDrbu/IOYtCzvt4AAREA0wB4G4oTGuLs4dotSvn1PmzW+OtbwIhG1UOe1s+u0EEW+k7feLm166hSkdW+kHH7RlOSrA97QoB+Gj+d0AiFJxr9EYK+Obvm7ZBvE4k627+yDmLQs77eAAERANQAeIBUDyh/phx5P5gEsy5CXtxsoveC9Ln2CyIiWAVo8ynQ8E8C/dCl7eNSoPPtVceds59GlScH8AKlelXhB8SUjrtNMertL/BWYUxvM16KsFPfr5BvE4o628NyDmLQs77eAAERANUAeIQAIYGHyOkjg/t8v5AIG8WiAacV3ZsO6W9nFrOEzlpJGdbS4MLN/4wt1bQZ1CdjFMwvXX2MnwIlbhlbSKNrgj5eKxAfk6QEABZ8sUlC1b5t",
		"encoding": "base64",
		"vector": null,
		"conflict_keys": null
	  }
	]
  }`

func TestCallEvent(t *testing.T) {
	h := InitEvents(t.Name(), t.TempDir())
	srv := httptest.NewServer(h)
	defer srv.Close()

	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)
	env := client.Env

	var input commands.Fields
	err := json.Unmarshal([]byte(eventJSON), &input)
	if err != nil {
		t.Fatalf("error unmarshalling input: %v", err)
	}

	response := callURL[units.WriteEventsReturns](t, env, srv.URL, "events:write", input)
	t.Logf("Response: %#v", response)
}
