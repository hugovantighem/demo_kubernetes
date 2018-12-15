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

Test application endpoints
```
docker-compose up
curl localhost:8080
curl -d 'name=test' localhost:8080/item
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

```
ab -n 10 localhost:30155/
```



Deploying the dash board

```
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
```
http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/



## Secrets

```
echo -n 'kubernetes' | base64
a3ViZXJuZXRlcw==
echo -n 's3cr3t' | base64
czNjcjN0

kubectl create -f kubernetes/credential-secrets.yml

kubectl describe secret credential-secrets
Name:         credential-secrets
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
password:  6 bytes
username:  10 bytes
```

```
kubectl apply -f kubernetes/server-deployment.yml
deployment.apps/server configured

curl localhost:30155/secrets
{"username":"kubernetes","password":"s3cr3t"}
```
WARNINGS : 
- the values `a3ViZXJuZXRlcw==` and `czNjcjN0` in `credential-secrets.yml` are encoded not encrypted
- storing credential (like `credential-secrets.yml`) as plain text (not encrypted) in a repository, is not a good practice.

SOLUTIONS :
- use a file or a command line on the host that is only local
- push the files or credentials to a repository, but ensure they are encrypted with a passphrase, and then decrypt directly on host

```
# create files with plain text
cat secrets/admin.secret
administrator
cat secrets/password.secret
admin_password

# encrypt these files
openssl enc -aes-256-cbc -in secrets/admin.secret -out secrets/admin.dac
openssl enc -aes-256-cbc -in secrets/password.secret -out secrets/password.dac

# secrets/admin.dac and secrets/password.dac can be stored in a repository

kubectl create secret generic credential-secrets \
 --from-literal=username=$(openssl enc -aes-256-cbc -d -in secrets/admin.dac -pass pass:password) \
 --from-literal=password=$(openssl enc -aes-256-cbc -d -in secrets/password.dac -pass pass:password)

kubectl apply -f kubernetes/server-deployment.yml
curl localhost:30155/secrets
{"username":"administrator","password":"admin_password"}
```


```
openssl enc -aes-256-cbc -in secrets/file.secret -out secrets/file.dac
openssl enc -aes-256-cbc -d -in secrets/file.dac

kubectl create configmap my-config --from-literal=username=$(openssl enc -aes-256-cbc -d -in secrets/file.dac)
enter aes-256-cbc decryption password:
configmap/my-config created
kubectl describe configmaps my-config                                                                         
Name:         my-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
username:
----
test
Events:  <none>

```

```
openssl enc -aes-256-cbc -in secrets/password.secret -out secrets/password.dac
enter aes-256-cbc encryption password: password
```

`secrets/password.dac` can be decrypted using `decrypt_password.dac.sh`

```
sh ./decrypt_password.dac.sh
password
```