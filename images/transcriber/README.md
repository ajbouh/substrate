### Build container
Final image will be bit over 4GB.
```
docker build -t transcriber .
```
### Run container
```
docker run --rm -it -p 8090:8000 transcriber
```
### Run test (uses port 8090)
```
go run test.go
```