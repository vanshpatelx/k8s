secret 
redis-password : 1234


kubectl create secret generic redis-password --from-literal=password=1234
kubectl create secret generic mysecretpassword --from-literal=password=1234

kubectl create secret generic redis-password --from-literal=password=1234 --namespace=myapp
kubectl create secret generic pg-password --from-literal=password=1234 --namespace=myapp

kubectl create configmap app-config \
  --from-literal=REDIS_HOST=redis-cluster-master.redis.svc.cluster.local \
  --from-literal=REDIS_PORT=6379 \
  --from-literal=PG_HOST=postgresql-ha-postgresql.postgres.svc.cluster.local \
  --from-literal=PG_PORT=5432 \
  --from-literal=PG_DATABASE=mydatabase \
  --from-literal=PORT=3000 \
  --namespace=myapp


helm install redis-cluster bitnami/redis-cluster 
  --set cluster.enabled=true \
  --set cluster.slaveCount=2 \
  --set persistence.enabled=true \
  --set persistence.size=1Gi \
  --set usePassword=true \
  --set passwordFromSecret=redis-password \
  --set redis.conf.appendonly=yes \
  --set redis.conf.appendfsync=everysec \
  --set redis.conf.save='900 1 300 10 60 10000' \
  --set sentinel.enabled=true \
  --set sentinel.masterSet=redis-cluster \
  --set sentinel.replicas=3 \
  --set redis.exporter.enabled=true \
  --namespace redis --create-namespace


helm install postgresql-ha bitnami/postgresql-ha \
  --set replicaCount=2 \
  --set persistence.enabled=true \
  --set persistence.size=1Gi \
  --set postgresqlPassword=mysecretpassword \
  --set postgresqlDatabase=mydatabase \
  --set patroni.enabled=true \
  --set postgresqlExporter.enabled=true \
  --namespace postgres --create-namespace


kubectl create secret generic redis-password --from-literal=password=1234
kubectl create secret generic mysecretpassword --from-literal=password=1234
kubectl create secret generic mydatabase --from-literal=database=1234
