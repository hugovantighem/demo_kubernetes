#!/bin/sh

openssl enc -aes-256-cbc -d -in secrets/password.dac -pass pass:password 