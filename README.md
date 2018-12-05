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

```
docker push leyougue/demo:1.0.1
```

```
kubectl apply -f kubernetes/server-deployment.yml
kubectl get pods                                 
NAME                     READY     STATUS    RESTARTS   AGE
server-57f79fb4c-x29rg   1/1       Running   0          3s
```
```
kubectl apply -f kubernetes/server-service.yml 
service/server-service created
➜  demo_kubernetes git:(master) ✗ kubectl get services
NAME             TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes       ClusterIP   10.96.0.1      <none>        443/TCP          63d
server-service   NodePort    10.105.81.18   <none>        8080:31217/TCP   45s

curl localhost:31217                          
Wed Dec 05 2018 22:04:41 GMT+0000 (UTC)
```
