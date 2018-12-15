#!/bin/sh

kubectl create secret generic credential-secrets \
 --from-literal=username=$(openssl enc -aes-256-cbc -d -in secrets/admin.dac -pass pass:password) \
 --from-literal=password=$(openssl enc -aes-256-cbc -d -in secrets/password.dac -pass pass:password)
