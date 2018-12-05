# Simple demo for kubernetes usage

Run a hello world Node server.

Each request write current datetime to a file and return its content.

```
docker build -t leyougue/demo:1.0.0 .
docker run --rm -p 8080:8080 leyougue/demo:1.0.0
```

```
curl localhost:8080
Wed Dec 05 2018 21:27:14 GMT+0000 (UTC)
```
