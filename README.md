# sejutacita

API documentation on Postman
https://documenter.getpostman.com/view/1087235/UUxtDVMD

### Admin Credential
Use this admin credential to API login
```
username : admin1
password : admin1
```

## How to run
### Via Kubernetes
Kubernetes YAML files is included in this project inside kubernetes folder. Please apply the kubernetes folder, and expose the deployment
```sh
kubectl apply -f kubernetes
kubectl expose deployment sejutacita-test-deployment --type="LoadBalancer"
```

### Via Docker
This is the docker hub image: https://hub.docker.com/repository/docker/andresetiawan/sejutacita_test
Please pull the docker image and run the container
```sh
docker pull andresetiawan/sejutacita:1.0
#And then, you can do docker run command to run the image in the container
docker run --name <your desired container name> -d andresetiawan/sejutacita_test:1.0
```

### In case you want to build the Docker image from scratch
1. create .env file in project root folder, containing database credentials (since I've deployed my mongo in my own EC2 instance and open the port). I've sent the creds on Whatsapp.
2. build the image locally and run the container
```sh
docker build -t <your desired image name> .
#then run the docker container
docker run --name <your desired container name> -d andresetiawan/sejutacita_test:1.0
```

### In case you want to run with npm
1. npm install
2. create .env file in project root folder, containing database credentials (since I've deployed my mongo in my own EC2 instance and open the port). I've sent the creds on Whatsapp.
3. npm start


