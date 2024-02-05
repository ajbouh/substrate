# Work in progress

### Build container
```
docker build -t transcriber .
```
### Run container
```
docker run --rm -it -p 8000:8000 transcriber
```
### Run test
```
go run test.go
```