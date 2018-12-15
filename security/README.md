# Tests for security

```
adduser super
su super
cd
echo s3crEt > password.secret
cat password.secret
s3crEt
openssl enc -aes-256-cbc -in password.secret -out password.dac
openssl enc -aes-256-cbc -in password.secret -out password.dac
enter aes-256-cbc encryption password: test
Verifying - enter aes-256-cbc encryption password: test

openssl enc -aes-256-cbc -d -in password.dac -pass pass:test
s3crEt

cat <<EOT >> decrypt.sh
#!/bin/sh
openssl enc -aes-256-cbc -d -in password.dac -pass pass:test
EOT

sh ./decrypt.sh

su -c 'cd && sh ./decrypt.sh' super
s3crEt

ssh super@localhost -p 2222 sh ./decrypt.sh
s3crEt
```