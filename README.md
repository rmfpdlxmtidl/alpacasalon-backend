# ๐ฆ ์ํ์นด์ด๋กฑ (Alpacasalon) Backend

์ํ์นด๊ฐ ๋ชจ์ฌ ๊ณต๊ฐํด์ฃผ๊ณ  ์ฆ๊ฒ๊ฒ ์๊ธฐํ๋ ๊ณต๊ฐ

## Requires

- macOS 11.5
- [Git](https://git-scm.com/downloads) 2.32
- [Node](https://hub.docker.com/_/node) 16 Alpine
- [Yarn](https://yarnpkg.com/getting-started/install#about-global-installs) berry
- [Visual Studio Code](https://code.visualstudio.com/Download) 1.63
- [PostgreSQL](https://hub.docker.com/_/postgres) 14 Alpine
- [Docker](https://www.docker.com/get-started) 20.10
- Docker Compose 1.29

```bash
git --version
node --version
yarn --version
code --version
docker --version
docker-compose --version
```

์ ๋ช๋ น์ด๋ฅผ ํตํด ํ๋ก์ ํธ์ ํ์ํ ๋ชจ๋  ํ๋ก๊ทธ๋จ์ด ์ค์น๋์ด ์๋์ง ํ์ธํฉ๋๋ค.

## Project structure

![images/architecture.webp](images/architecture.webp)

## Quick start

### Download codes

```bash
git clone https://github.com/rmfpdlxmtidl/alpacasalon-backend.git
cd alpacasalon-backend
git checkout main
yarn
```

ํ๋ก์ ํธ๋ฅผ ๋ค์ด๋ก๋ ๋ฐ๊ณ  ํด๋น ํด๋๋ก ์ด๋ํ ํ ์ ์ ํ ๋ธ๋์น(`main` ๋ฑ)๋ก ์ด๋ํ๊ณ  ํ๋ก์ ํธ์ ํ์ํ ์ธ๋ถ ํจํค์ง๋ฅผ ์ค์นํฉ๋๋ค.

๊ทธ๋ฆฌ๊ณ  ํ๋ก์ ํธ ํด๋์์ VSCode๋ฅผ ์คํํ๋ฉด ์ค๋ฅธ์ชฝ ์๋์ '๊ถ์ฅ ํ์ฅ ํ๋ก๊ทธ๋จ ์ค์น' ์๋ฆผ์ด ๋จ๋๋ฐ, ํ๋ก์ ํธ์์ ๊ถ์ฅํ๋ ํ์ฅ ํ๋ก๊ทธ๋จ(ESLint, Prettier ๋ฑ)์ ๋ชจ๋ ์ค์นํฉ๋๋ค.

### Create environment variables

๋ฃจํธ ํด๋์ `.env`, `.env.development`, `.env.development.local`, `.env.local`, `.env.test` ํ์ผ์ ์์ฑํ๊ณ  ํ๋ก์ ํธ์์ ์ฌ์ฉ๋๋ ํ๊ฒฝ ๋ณ์๋ฅผ ์ค์ ํฉ๋๋ค.

### Initialize database

```bash
yarn import ์ต์
```

๊ทธ๋ฆฌ๊ณ  `import` ์คํฌ๋ฆฝํธ๋ฅผ ์คํํด [`database/initialization.sql`](database/initialization.sql)์ CSV ํ์ผ๋ก ๋์ด ์๋ ๋๋ฏธ๋ฐ์ดํฐ๋ฅผ ๋ฃ์ด์ค๋๋ค.

### Start Node.js server

```shell
$ yarn dev
```

TypeScript ํ์ผ์ ๊ทธ๋๋ก ์ฌ์ฉํด Nodemon์ผ๋ก ์๋น์ค๋ฅผ ์คํํฉ๋๋ค.

or

```shell
$ yarn build && yarn start
```

TypeScript ํ์ผ์ JavaScript๋ก ํธ๋์คํ์ผํ ํ Node.js๋ก ์๋น์ค๋ฅผ ์คํํฉ๋๋ค.

or

```shell
$ docker-compose up --detach --build --force-recreate
```

(Cloud Run ํ๊ฒฝ๊ณผ ๋์ผํ) Docker ํ๊ฒฝ์์ Node.js ์๋ฒ๋ฅผ ์คํํฉ๋๋ค.

## Google Cloud Platform

### Cloud Run

Cloud Run + Cloud Build๋ฅผ ํตํด GitHub์ commit์ด push๋  ๋๋ง๋ค Cloud Run์ ์๋์ผ๋ก ๋ฐฐํฌํฉ๋๋ค.

### Cloud SQL (For production database)

#### Configure database

```sql
CREATE USER alpacasalon CREATEDB;
-- \c postgres alpacasalon
CREATE DATABASE alpacasalon OWNER alpacasalon TEMPLATE template0 LC_COLLATE "C" LC_CTYPE "ko_KR.UTF-8";
-- \c alpacasalon postgres
-- ALTER SCHEMA public OWNER TO alpacasalon;
```

#### Connect to Cloud SQL with proxy

```
PROJECT_NAME=ํ๋ก์ ํธID
CONNECTION_NAME=$PROJECT_NAME:๋ฆฌ์ :์ธ์คํด์คID

gcloud auth login
gcloud config set project $PROJECT_NAME

curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64
chmod +x cloud_sql_proxy
./cloud_sql_proxy -instances=$CONNECTION_NAME=tcp:54321

psql "host=127.0.0.1 port=54321 sslmode=disable dbname=$POSTGRES_DB user=$POSTGRES_USER"
```

#### Database schema update

```bash
yarn export-db .env
initialization.sql
CSV ๋ฐ์ดํฐ ๊ตฌ์กฐ ์์ 
yarn import-db .env
```

### Compute Engine (For development database)

#### Connect to Compute Engine via SSH

```bash
GCP_ID=GCP๊ณ์ ์ด๋ฆ
GCE_ID=GCE์ธ์คํด์ค์ด๋ฆ

gcloud init
gcloud components update
gcloud compute ssh $GCP_ID@$GCE_ID
```

#### Run PostgreSQL container

```bash
# Set variables
DOCKER_VOLUME_NAME=๋์ปค๋ณผ๋ฅจ์ด๋ฆ
POSTGRES_HOST=DB์๋ฒ์ฃผ์
POSTGRES_USER=DB๊ณ์ ์ด๋ฆ
POSTGRES_PASSWORD=DB๊ณ์ ์ํธ
POSTGRES_DB=DB์ด๋ฆ

# generate the server.key and server.crt https://www.postgresql.org/docs/14/ssl-tcp.html
openssl req -new -nodes -text -out root.csr \
  -keyout root.key -subj "/CN=Alpacasalon"
chmod og-rwx root.key

openssl x509 -req -in root.csr -text -days 3650 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -signkey root.key -out root.crt

openssl req -new -nodes -text -out server.csr \
  -keyout server.key -subj "/CN=$POSTGRES_HOST"

openssl x509 -req -in server.csr -text -days 365 \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out server.crt

# set postgres (alpine) user as owner of the server.key and permissions to 600
sudo chown 0:70 server.key
sudo chmod 640 server.key

# set client connection policy
echo "
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# 'local' is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust

hostssl all all all scram-sha-256
" > pg_hba.conf

# start a postgres docker container, mapping the .key and .crt into the image.
sudo docker volume create $DOCKER_VOLUME_NAME
sudo docker run \
  -d \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e LANG=ko_KR.UTF8 \
  -e LC_COLLATE=C \
  -e POSTGRES_INITDB_ARGS=--data-checksums \
  --name postgres \
  -p 5432:5432 \
  --restart=always \
  --shm-size=256MB \
  -v "$PWD/server.crt:/var/lib/postgresql/server.crt:ro" \
  -v "$PWD/server.key:/var/lib/postgresql/server.key:ro" \
  -v "$PWD/pg_hba.conf:/var/lib/postgresql/pg_hba.conf" \
  -v $DOCKER_VOLUME_NAME:/var/lib/postgresql/data \
  postgres:14-alpine \
  -c ssl=on \
  -c ssl_cert_file=/var/lib/postgresql/server.crt \
  -c ssl_key_file=/var/lib/postgresql/server.key \
  -c hba_file=/var/lib/postgresql/pg_hba.conf
```

๋์ปค๋ฅผ ํตํด PostgreSQL ์ปจํ์ด๋์ ๋์ปค ๋ณผ๋ฅจ์ ์์ฑํ๊ณ , OpenSSL์ ์ด์ฉํด ์์ฒด ์๋ช๋ ์ธ์ฆ์๋ฅผ ์์ฑํด์ SSL ์ฐ๊ฒฐ์ ํ์ฑํํฉ๋๋ค.

#### Test connection

```bash
# Set variables
POSTGRES_HOST=DB์๋ฒ์ฃผ์
POSTGRES_USER=DB๊ณ์ ์ด๋ฆ
POSTGRES_DB=DB์ด๋ฆ

psql "host=$POSTGRES_HOST port=5432 dbname=$POSTGRES_DB user=$POSTGRES_USER sslmode=verify-ca"
```

### Cloud Function

#### Slack

```bash
# https://github.com/rmfpdlxmtidl/google-cloud-build-slack
export SLACK_WEBHOOK_URL=
export PROJECT_ID=
./setup.sh
```

## Scripts

#### `test`

์คํ ์ค์ธ GraphQL ์๋ฒ์ ํ์คํธ์ฉ GraphQL ์ฟผ๋ฆฌ๋ฅผ ์์ฒญํ๊ณ  ์๋ต์ ๊ฒ์ฌํฉ๋๋ค. ์ด ์คํฌ๋ฆฝํธ๋ฅผ ์คํ ํ๊ธฐ ์ ์ `localhost` ๋๋ ์๊ฒฉ์์ GraphQL API ์๋ฒ๋ฅผ ์คํํด์ผ ํฉ๋๋ค.

#### `generate-db`

```bash
$ yarn generate-db {ํ๊ฒฝ ๋ณ์ ํ์ผ ์์น}
```

PostgreSQL ๋ฐ์ดํฐ๋ฒ ์ด์ค ๊ตฌ์กฐ๋ฅผ ๋ฐํ์ผ๋ก TypeScript ๊ธฐ๋ฐ ์๋ฃํ์ด ๋ด๊ธด ํ์ผ์ ์์ฑํฉ๋๋ค.

#### `export`

```bash
$ yarn export ์ต์
```

PostgreSQL ๋ฐ์ดํฐ๋ฒ ์ด์ค์ ์๋ ๋ชจ๋  ์คํค๋ง์ ๋ชจ๋  ํ์ด๋ธ์ CSV ํ์ผ๋ก ์ ์ฅํฉ๋๋ค. ๋๋ฏธ ๋ฐ์ดํฐ CSV ํ์ผ์ ๋ณ๊ฒฝํ๊ธฐ ์ ์ ์ํํฉ๋๋ค.

#### `import`

```bash
$ yarn import ์ต์
```

CSV ํ์ผ์ PostgreSQL ๋ฐ์ดํฐ๋ฒ ์ด์ค์ ์ฝ์ํฉ๋๋ค.

## Slack

```
https://slack.github.com/

# https://github.com/integrations/slack#subscribing-and-unsubscribing
/github subscribe rmfpdlxmtidl/alpacasalon-backend commits:* reviews comments
/github unsubscribe rmfpdlxmtidl/alpacasalon-backend deployments
```
