Redis => master => deployment => 1 => set password
Redis => slave => statefulset => replica 2 => set pssword, replica set
Service => both => clusterIP
Express => Deployment => Send HOST, PORT, PASSWORD as ENV
Service => clusterIP, we cant access it
but we use port forwading


kubectl apply -f redis-master.yaml
kubectl apply -f redis-slave.yaml
kubectl apply -f master-service.yaml
kubectl apply -f express-deployment.yaml
kubectl apply -f service.yaml

kubectl port-forward svc/express-redis-app 3000:3000 -n redis

kubectl delete -f redis-master.yaml
kubectl delete -f redis-slave.yaml
kubectl delete -f master-service.yaml
kubectl delete -f express-deployment.yaml
kubectl delete -f service.yaml


