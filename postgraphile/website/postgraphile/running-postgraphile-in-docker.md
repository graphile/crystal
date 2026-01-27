---
title: Running PostGraphile in Docker
---

:::warning[Untested!]

This guide has been updated for PostGraphile V5, but has not yet been tested.
Exercise caution, and please report any issues.

:::

The following guide describes how to run a network of Docker containers on a
local machine, including one container for a PostgreSQL database and one
container for PostGraphile. A the end of this guide, you will have a GraphQL API
exposing data from a PostgreSQL database, both running locally on your machine
in separate Docker containers. It has been developed and tested on:

- Linux
- Windows Pro
- Windows Home

## Requirements

This requires to have Docker and Docker Compose installed on your workstation.
If you are new to Docker and need to install it, you can refer to their
[official documentation](https://docs.docker.com/) or follow the steps below.

- [Install Docker and Docker Compose on Linux](#install-docker-and-docker-compose-on-linux)
- [Install Docker on Windows Pro](#install-docker-on-windows-pro)
- [Install Docker on Windows Home](#install-docker-on-windows-home)

:::note

If you use Docker Desktop for Windows, it comes automatically with
Docker Compose.

:::

### Install Docker and Docker Compose on Linux

#### Docker

Add the Docker repository to your Linux repository. Execute the following
commands in a terminal window.

```shell
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

Install Docker Community Edition.

```shell
sudo apt-get update
sudo apt-get install docker-ce
```

Add your user to the docker group to setup its permissions. **Make sure to
restart your machine after executing this command.**

```shell
sudo usermod -a -G docker <username>
```

Test your Docker installation. Executing the following command will
automatically download the `hello-world` Docker image if it does not exist and
run it.

```shell
docker run hello-world
```

Remove the `hello-world` image once you're done.

```shell
docker image ls
docker rmi -f hello-world
```

#### Docker Compose

Docker Compose helps you to run a network of several containers at once thanks
to configuration files instead of providing all arguments in the command line
interface. It makes it easier to manage your containers as command lines can
become very long and unreadable due to the high number of arguments. Execute the
following command in a terminal window.

```shell
sudo apt install docker-compose
```

### Install Docker on Windows Pro

#### Docker Desktop for Windows

Install Docker Community Edition for Windows from the following the URL:
[Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows).
Just follow the default installation settings. It comes automatically with
Docker Compose.

### Install Docker on Windows Home

#### Docker Toolbox for Windows

Install Docker Toolbox for Windows from the following the URL:
[Docker Toolbox for Windows](https://docs.docker.com/toolbox/overview). Just
follow the default installation settings. It comes automatically with Docker
Compose.

## Create PostgreSQL Container

### Setup Environment Variables

Create a new file `.env` at the root of the repository with the content below.
This file will be used by Docker to load configuration parameters into
environment variables. In particular:

- `POSTGRES_DB`: name of the database to be created in the PostgreSQL container.
- `POSTGRES_USER`: default admin user created upon database initialization.
- `POSTGRES_PASSWORD`: password of the default admin user.

```ini
# DB
# Parameters used by db container
POSTGRES_DB=forum_example
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me
```

:::note

A better way to manager the database password would be to use
[Docker Secrets](https://docs.docker.com/engine/reference/commandline/secret/).

:::

### Create Database Initialization Files

Create a new folder `db` at the root of the repository. It will be used to store
the files necessary to create the PostgreSQL container. In the `db` folder,
create a new subfolder `init` which will contain the SQL files used to
initialize the PostgreSQL database. Files located in the `init` folder will be
executed in sequence order when PostgreSQL initialize the database.

In this guide we will use a simple forum example. The database will contain two
tables: `user` and `post`. There is a relationship between `user` and `post` as
one user can have one or several posts. It is a "one-to-many" relationship (one
parent, many children). The `author_id` column in the `post` will be used as a
foreign key of the `user` table.

Create a first file `00-database.sql` containing the database schema definition
as below.

```sql
\connect forum_example;

/*Create user table in public schema*/
CREATE TABLE public.user (
    id SERIAL PRIMARY KEY,
    username TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE public.user IS
'Forum users.';

/*Create post table in public schema*/
CREATE TABLE public.post (
    id SERIAL PRIMARY KEY,
    title TEXT,
    body TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER NOT NULL REFERENCES public.user(id)
);

COMMENT ON TABLE public.post IS
'Forum posts written by a user.';
```

For the sake of the example, we will also create a second file `01-data.sql` to
populate the database with some dummy data.

```sql
\connect forum_example;

/*Create some dummy users*/
insert into public.user (username) values
('Benjie'),
('Singingwolfboy'),
('Lexius');

/*Create some dummy posts*/
insert into public.post (title, body, author_id) values
('First post example', 'Lorem ipsum dolor sit amet', 1),
('Second post example', 'Consectetur adipiscing elit', 2),
('Third post example', 'Aenean blandit felis sodales', 3);
```

### Create PostgreSQL Dockerfile

The Dockerfile is used by Docker as a blueprint to build Docker images. Docker
containers are later on created based on these Docker images. More information
is available on the official
[Postgres Docker Images](https://hub.docker.com/_/postgres) but the standard
Dockerfile for PostgreSQL is extremely simple. In the folder `db` (not in the
folder `init`), create a new file named `Dockerfile` with the following content.

```dockerfile
FROM postgres:14-alpine
COPY ./init/ /docker-entrypoint-initdb.d/
```

The first line `FROM postgres:14-alpine` indicates to build the Docker image based
on the official PostgreSQL Docker image running in an Alpine Linux container.
The second line `COPY ./init/ /docker-entrypoint-initdb.d/` will copy the
database initialization files (SQL) into the folder `docker-entrypoint-initdb.d`
located in the Docker container. This folder is read by PostgreSQL upon database
initialization and all its content is executed.

### Create Docker Compose File

Docker command lines can be verbose with a lot of parameters so we will use
Docker Compose to orchestrate the execution of our containers. Create a new file
`docker-compose.yml` at the root of the repository with the following content.

```yml
version: "3.3"
services:
  db:
    container_name: forum-example-db
    restart: always
    image: forum-example-db
    build:
      context: ./db
    volumes:
      - db:/var/lib/postgresql/data
    env_file:
      - ./.env
    networks:
      - network
    ports:
      - 5432:5432

networks:
  network:

volumes:
  db:
```

#### Parameters description

| Parameter          | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **db**             | Names of the services run by Docker Compose.                                                                                                                                                                                                                                                                                                                                                            |
| **container_name** | Guess what? It's the container name!                                                                                                                                                                                                                                                                                                                                                                    |
| **image**          | Name of the image to use to run the container.                                                                                                                                                                                                                                                                                                                                                          |
| **build**          | When a build context is provided, Docker Compose will build a custom image using the Dockerfile located in the context folder.                                                                                                                                                                                                                                                                          |
| **context**        | Indicates the folder where to find the Dockerfile to build the image.                                                                                                                                                                                                                                                                                                                                   |
| **volumes**        | Mapping between the Docker volume and the PostgreSQL folder in your container, in format `docker_volume:container_folder`. All the files generated in the `container_folder` will be copied in the `docker_volume` so that you can preserve and retrieve your data when stopping/restarting the container. The Docker volume is automatically created when running the db container for the first time. |
| **env_file**       | Path to the configuration file containing environment variables for the container. See [Setup Environment Variables](#setup-environment-variables) above.                                                                                                                                                                                                                                               |
| **networks**       | Networks are used to group and connect containers as part of a same network.                                                                                                                                                                                                                                                                                                                            |
| **ports**          | Port, mapping between the port of your host machine and the port of your container, in format `host_port:container_port`                                                                                                                                                                                                                                                                                |
| **command**        | Command to be executed after the container starts. Each argument must be provided in a separate list item.                                                                                                                                                                                                                                                                                              |

At this stage, the repository should look like this:

```
/
├─ db/
|  ├─ init/
|  |  ├─ 00-database.sql
|  |  └─ 01-data.sql
|  └─ Dockerfile
├─ .env
└─ docker-compose.yml
```

## Create PostGraphile Container

### Update Environment Variables

Update the file `.env` to add the `DATABASE_URL` which will be used by
PostGraphile to connect to the PostgreSQL database.

```ini
[...]
# GRAPHQL
# Parameters used by graphql container
DATABASE_URL=postgres://postgres:change_me@db:5432/forum_example
```

:::note

The `DATABASE_URL` follows the syntax
`postgres://<user>:<password>@db:5432/<db_name>`.

:::

### Create PostGraphile Dockerfile

Create a new folder `graphql` at the root of the repository. It will be used to
store the files necessary to create the PostGraphile container.

In `graphql`, create a `package.json` and lockfile (for example
`package-lock.json`) that install PostGraphile, then add a `graphile.config.ts`
to configure it.

```json title="graphql/package.json"
{
  "name": "postgraphile-docker",
  "private": true,
  "type": "module",
  "dependencies": {
    "postgraphile": "^5.0.0"
  }
}
```

```ts title="graphql/graphile.config.ts"
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from "postgraphile/adaptors/pg";

export default {
  extends: [PostGraphileAmberPreset],
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
  grafserv: {
    host: "0.0.0.0",
    port: 5678,
  },
};
```

Create a new file `Dockerfile` in the `graphql` folder with the following
content.

```dockerfile title="graphql/Dockerfile"
FROM node:24-alpine
LABEL description="Instant high-performance GraphQL API for your PostgreSQL database https://github.com/graphile/postgraphile"

# Set app folder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy config and plugins
COPY graphile.config.ts ./
COPY plugins ./plugins

EXPOSE 5678
ENTRYPOINT ["npx", "--no-install", "postgraphile"]
```

### Update Docker Compose File

Update the file `docker-compose.yml` under the `services` section to include the
GraphQL service.

```yml
version: "3.3"
services:
    db: [...]

    graphql:
        container_name: forum-example-graphql
        restart: always
        image: forum-example-graphql
        build:
            context: ./graphql
        env_file:
            - ./.env
        depends_on:
            - db
        networks:
            - network
        ports:
            - 5678:5678
[...]
```

At this stage, the repository should look like this:

```
/
├─ db/
|  ├─ init/
|  |  ├─ 00-database.sql
|  |  └─ 01-data.sql
|  └─ Dockerfile
├─ graphql/
|  ├─ graphile.config.ts
|  ├─ package.json
|  ├─ package-lock.json
|  ├─ plugins/
|  └─ Dockerfile
├─ .env
└─ docker-compose.yml
```

## Build Images And Run Containers

### Build Images

You can build the Docker images by executing the following command from the root
of the repository.

```shell
# Build images for all services in docker-compose.yml
docker-compose build

# You can also build images one by one
# For instance you can build the database image like this
docker-compose build db

# And build the graphql image like this
docker-compose build graphql
```

### Run Containers

You can run the Docker containers by executing the following command from the
root of the repository.

:::note

When running the database container for the first time, Docker will
automatically create a Docker Volume to persist the data from the database.
The Docker Volume is automatically named as `<your_repository_name>_db`.

:::

```shell
# Run containers for all services in docker-compose.yml
docker-compose up

# Run containers as daemon (in background)
docker-compose up -d

# Run only the database container as daemon
docker-compose up -d db

# Run only the GraphQL container as daemon
docker-compose up -d graphql
```

Each container can be accessed at the following addresses:

| Container                 | Docker on Linux / Windows Pro    | Docker on Windows Home                        |
| ------------------------- | -------------------------------- | --------------------------------------------- |
| GraphQL API Documentation | `http://localhost:5678/graphiql` | `http://your_docker_machine_ip:5678/graphiql` |
| GraphQL API               | `http://localhost:5678/graphql`  | `http://your_docker_machine_ip:5678/graphql`  |
| PostgreSQL Database       | host: `localhost`, port: `5432`  | host: `your_docker_machine_ip`, port: `5432`  |

:::note

If you run Docker Toolbox on Windows Home, you can get your Docker
machine IP address with the command `$ docker-machine ip default`.

:::

### Re-initialize The Database

In case you do changes to the database schema by modifying the files in
`/db/init`, you will need to re-initialize the database to see these changes.
This means you need to delete the Docker Volume, the database Docker Image and
rebuild it.

```shell
# Stop running containers
docker-compose down

# List Docker volumes
docker volume ls

# Delete volume
docker volume rm <your_repository_name>_db

# Delete database image to force rebuild
docker rmi db

# Run containers (will automatically rebuild the image)
docker-compose up
```

## Add Custom Plugin

### wrapPlans

This section is optional but describes how to wrap a plan generated by
PostGraphile in order to customize it. Create a new folder `graphql/plugins`
and add a `wrap-plans.ts` file:

```ts title="graphql/plugins/wrap-plans.ts"
import { sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

export default wrapPlans({
  Mutation: {
    createUser(plan) {
      const $result = plan();
      const $user = $result.get("user");

      sideEffect($user, (user) => {
        console.info("Created user:", user?.username);
      });

      return $result;
    },
  },
});
```

Now update `graphile.config.ts` to import and register the plugin:

```ts title="graphql/graphile.config.ts"
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from "postgraphile/adaptors/pg";
import WrapPlansPlugin from "./plugins/wrap-plans.js";

export default {
  extends: [PostGraphileAmberPreset],
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
  plugins: [WrapPlansPlugin],
};
```

Finally rebuild and rerun the GraphQL container.

```shell
# Shut down containers
docker-compose down

# Rebuild the GraphQL container
docker-compose build graphql

# Rerun containers
docker-compose up
```

If you execute a `createUser` mutation like in the example provided below, you
will notice the log messages from the custom plugin printing in your terminal.

## Queries And Mutations Examples

### Queries

Example of query to get all posts and their author.

```graphql
query {
  allPosts {
    nodes {
      id
      title
      body
      userByAuthorId {
        username
      }
    }
  }
}
```

### Mutations

Example of mutation to create a new user.

```graphql
mutation {
  createUser(input: { user: { username: "Bob" } }) {
    user {
      id
      username
      createdDate
    }
  }
}
```
