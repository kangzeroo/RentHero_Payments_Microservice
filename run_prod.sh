docker run --log-opt max-size=500m -d -it -p 7107:7107 --name=payments_microservice payments_microservice npm run prod -- --host=0.0.0.0
