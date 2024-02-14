### Build container
Requires Docker VM to have 16GB+ RAM. The image will be almost 18GB.
```
docker build -t translator .
```
### Run container
```
docker run --rm -it -p 8092:8000 translator
```
### Run test
```
go run test.go
```