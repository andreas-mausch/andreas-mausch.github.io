---
title: "Docker Swarm: Wait for deployment"
date: 2025-03-12T19:00:00+01:00
tags: ['docker', 'containerization']
---

I love Docker Compose files for their simplicity
and use them a lot to start local services.

However, when using them in a Docker Swarm, you always need to take precautions
to validate a deployment was successful.

If a health check failed or the image could not be pulled, the `docker stack deploy`
command just finished without any error message, because the real
deployment was done asynchronously after the command already exited and returned to the shell.

Today I just found out it is finally possible to wait for the result of the deployment
by using the `--detach=false` mode.
The command will block until the state of the swarm is stable again.

This is so good.
It allows automatic scripts to check whether the deployment was successful or not,
without any self-written scripts checking the stdout of `docker service ps` commands.

The [pull request](https://github.com/docker/cli/pull/4258) was merged in March 2024 ([link to issue](https://github.com/docker/cli/issues/373)).
Make sure to use a Docker version >= 26.

# Example with Keycloak

For example let's have a service, in this case a Keycloak:

```yaml{data-filename=docker-compose.yaml}
services:
  idp:
    image: quay.io/keycloak/keycloak:26.1.3
    command:
      - start-dev
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      DB_VENDOR: h2
      KC_HEALTH_ENABLED: "true"
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD-SHELL", "exec 3<>/dev/tcp/localhost/9000 && echo -e 'GET /health/ready HTTP/1.1\\r\\nHost: localhost\\r\\nConnection: close\\r\\n\\r\\n' >&3 && cat <&3 | grep -q '200 OK'"]
      start_period: 10s
      interval: 5s
      retries: 12
      timeout: 5s
```

Test the `docker-compose.yaml` without Docker Swarm:

```bash
docker compose up
docker compose rm --volumes
```

Now run the following commands and notice the `--detach`:

```bash
docker stack deploy --detach=false --compose-file docker-compose.yaml teststack
docker service ls | grep teststack
docker service ps teststack_idp --filter='desired-state=running'
docker stack rm --detach=false teststack
```

You must be connected to a swarm in order to run `docker stack` commands.

Some more commands for debugging:

```bash
docker stack services teststack --format '{{.Name}}'
docker service ls | grep teststack
docker service ps teststack_idp --filter='desired-state=running' --format '{{.CurrentState}}'
docker service update --image redis:7.4.1 teststack_idp --args='' --health-cmd=true
teststack_idp
```

Note: `docker service update` has `--detach=false` by default, so you do not need to specify it here.
Second note: `--args` is the docker command. Don't know why they use a different wording here.
