# Simple demo for kubernetes usage

Run a hello world Node server.

Each request write current datetime to a file and return its content.

Run image using docker
```
docker build -t leyougue/demo:1.0.0 .
docker run --rm -p 8080:8080 leyougue/demo:1.0.0
```

Send request to the server
```
curl localhost:8080
Wed Dec 05 2018 21:27:14 GMT+0000 (UTC)
```

Publish image to repo
```
docker push leyougue/demo:1.0.1
```


```
docker-compose up
curl -X POST -d 'name=test' localhost:8080/item
```

Run image using kubernetes
```
kubectl apply -f kubernetes/server-deployment.yml
kubectl get pods                                 
NAME                     READY     STATUS    RESTARTS   AGE
server-57f79fb4c-x29rg   1/1       Running   0          3s
```

Expose the service
```
kubectl apply -f kubernetes/server-service.yml 
service/server-service created
kubectl get services
NAME             TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes       ClusterIP   10.96.0.1      <none>        443/TCP          63d
server-service   NodePort    10.105.81.18   <none>        8080:31217/TCP   45s
```

Data is persisted to volume
```
curl localhost:31217
Wed Dec 05 2018 22:23:40 GMT+0000 (UTC)
cat /tmp/data/message.txt 
Wed Dec 05 2018 22:23:40 GMT+0000 (UTC)
```

Data is mounted into each pod when recreated
```
kubectl delete deployments server                
deployment.extensions "server" deleted
kubectl apply -f kubernetes/server-deployment.yml
deployment.apps/server created
curl localhost:31217                             
Wed Dec 05 2018 22:23:40 GMT+0000 (UTC)
Wed Dec 05 2018 22:25:34 GMT+0000 (UTC)
```

