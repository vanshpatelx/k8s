echo -n "ABCD" | base64


helm install redis-cluster bitnami/redis-cluster \
  --set cluster.enabled=true \
  --set cluster.slaveCount=2 \
  --set master.persistence.enabled=true \
  --set replica.persistence.enabled=true \
  --set sentinel.persistence.enabled=true \
  --set master.persistence.size=1Gi \
  --set replica.persistence.size=1Gi \
  --set sentinel.persistence.size=1Gi \
  --set global.redis.password=ABCD \
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
  --set postgresqlPassword=ABCD \
  --set postgresqlDatabase=mydatabase \
  --set patroni.enabled=true \
  --set postgresqlExporter.enabled=true \
  --namespace postgres --create-namespace

kubectl create secret generic pg-password \
  --from-literal=password=ABCD \
  --namespace=myapp



kubectl create secret generic redis-password \
  --from-literal=password=ABCD \
  --namespace=myapp


kubectl create configmap app-config \
  --from-literal=PG_HOST=postgresql-ha-postgresql.postgres.svc.cluster.local \
  --from-literal=PG_PORT=5432 \
  --from-literal=PG_DATABASE=mydatabase \
  --from-literal=PG_USER=your_pg_user \
  --namespace=myapp

