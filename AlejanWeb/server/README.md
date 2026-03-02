# Keshav end service build using Express, TS, Prisma.

## Build using

- [ExpressJS](https://expressjs.com/) main backend engine.
- [Prisma](https://www.prisma.io) and [MongoDB](https://www.mongodb.com) for [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) and Database.

### Setup Prisma

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                                 |
| :------ | :------------------------------------------ |
| `dev`   | Starts a development instance of the server |
| `start` | Start the server                            |
| `build` | build a app                                 |

## TODO config

In nginx.conf file:
proxy_set_header X-Real-IP $remote_addr;

In node.js server file:
const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;

We have total 3 level account
ADMIN - this have all control and can create other BUSINESS level user
BUSINESS - this have all control
DEFAULT - this are DEFAULT user or vendor or normal user

### How to Register as a Admin User

1. Create user using /auth/register API
2. Verify Email and Phone Using OTP or change `isVerify` key to `true` by Database level
3. now change the newly created user role to `ADMIN` in database level
