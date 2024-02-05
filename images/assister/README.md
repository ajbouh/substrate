### Build container
LocalAI without model is already LARGE, but with model is 40GB.
```
docker build -t assister .
```
### Run container
```
docker run --rm -it -p 8091:8080 assister
```
### Sanity check with curl
```
curl -v http://localhost:8091/v1/completions -H "Content-Type: application/json" -d '{
     "model": "airoboros-l2-13b-2.1.ggmlv3.Q2_K.bin",
     "prompt": "A long time ago in a galaxy far, far away",
     "temperature": 0.7
   }'
```
### Run test
Requires openai Python package. Uses port 8091.
```
python3.8 fcheck.py
```

