module github.com/ajbouh/substrate/services/substrate

go 1.18

require (
	github.com/ajbouh/substrate/pkg v0.0.0-00010101000000-000000000000
	github.com/dghubble/gologin/v2 v2.4.0
	github.com/dghubble/sessions v0.4.0
	github.com/go-playground/form/v4 v4.2.0
	github.com/julienschmidt/httprouter v1.3.0
	github.com/mattn/go-sqlite3 v1.14.16
	github.com/nats-io/nats-server/v2 v2.9.20
	github.com/oklog/ulid/v2 v2.1.0
	github.com/pelletier/go-toml/v2 v2.1.0
	github.com/rs/cors v1.8.3
	github.com/sirupsen/logrus v1.9.0
)

require (
	github.com/Azure/go-ansiterm v0.0.0-20230124172434-306776ec8161 // indirect
	github.com/Microsoft/go-winio v0.6.0 // indirect
	github.com/docker/distribution v2.8.1+incompatible // indirect
	github.com/docker/docker v24.0.6+incompatible // indirect
	github.com/docker/go-connections v0.4.0 // indirect
	github.com/docker/go-units v0.5.0 // indirect
	github.com/gogo/protobuf v1.3.2 // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/google/go-github/v48 v48.2.0 // indirect
	github.com/google/go-querystring v1.1.0 // indirect
	github.com/gorilla/securecookie v1.1.1 // indirect
	github.com/klauspost/compress v1.16.5 // indirect
	github.com/minio/highwayhash v1.0.2 // indirect
	github.com/nats-io/jwt/v2 v2.4.1 // indirect
	github.com/nats-io/nkeys v0.4.4 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	github.com/opencontainers/go-digest v1.0.0 // indirect
	github.com/opencontainers/image-spec v1.0.3-0.20220114050600-8b9d41f48198 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	golang.org/x/crypto v0.9.0 // indirect
	golang.org/x/mod v0.6.0 // indirect
	golang.org/x/net v0.10.0 // indirect
	golang.org/x/oauth2 v0.5.0 // indirect
	golang.org/x/sys v0.8.0 // indirect
	golang.org/x/time v0.3.0 // indirect
	golang.org/x/tools v0.2.0 // indirect
	google.golang.org/appengine v1.6.7 // indirect
	google.golang.org/protobuf v1.28.1 // indirect
)

replace github.com/ajbouh/substrate/pkg => ../../pkg
