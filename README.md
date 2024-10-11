# Clickbeard Backend

## Project overview
Server responsible for managing schedules, clients and barbers registrations in a barbershop.

The project presents a GraphQL API to provide a single entry-point to the service and flexible queries that the client can perform.
The token is encrypted to avoid the undesired access to user sensitive information.

Technologies:
-   Node.js
-   Typescript
-   Docker
-   typeORM
-   apollo-server
-   node-jose

All routes that are part of the private side of the application need an authentication via the Authorization header. 

## Instalation

### Manual:

-   Create an file `.env` following the example in `.env.example`

*   Configure the database connection options in `ormconfig.json`.

If you're going to run the application outside Docker, you need to change the `host` configuration option to localhost or some other thing.

```bash
    npm install && npm start
```

### Docker:

```bash
    docker compose up -d
```

Accessing `localhost:4000` will lead you to `apollo-server` client.\

This client will provide an documentation about the available queires, mutation and schema available in the server.
