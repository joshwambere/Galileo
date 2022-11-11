[![Maintainability](https://api.codeclimate.com/v1/badges/8f1e83825fa6388e2e0e/maintainability)](https://codeclimate.com/github/joshwambere/Galileo/maintainability)

# Galileo Backend
A blazing fast rest API for chatting application and project management.

## Backend Express server
The backend server uses the Flask framework.
This documentation explains how to configure, launch and test backend server.

**Assumption** : we suppose that we start in `Galileo` directory.

## Environment requirements

You need to create `.env.development` or `.env.production` files.

add the following environments variable in one of your files:

```
# PORT
PORT=PORT

# DATABASE
DB_HOST=mongo
DB_PORT=27017
DB_DATABASE=dev
NODE_ENV
# TOKEN
SECRET_KEY=secret
TOKEN_EXPIRES_IN=1d
# SENDGRID
SENDGRID_API_KEY=SG.**********
SENDER_EMAIL=**********

# CORS
ORIGIN=*
CREDENTIALS=true

SOCKET_PORT=3000
```

## Configuring

To configure backend server, you need to have:

- node 14<
- yarn

### install dependencies 

```bash
yarn 
```

### Run backend server
if you have mongoDb installed locally, you can run the server with the following command:
```bash 

yarn start
```

otherwise, you can run the server with docker-compose:
```bash
docker-compose up --build
```
### Database seed

By default, the database is seeded with admin user with following email:

```bash
email:admin@gmail.com
```
You can use this user to:


 - login
 - create a project
 - create a a chat room
 - invite contributors to the project
 - send messages in the chat room


## Socket
The app consists of a socket server and a socket client. The socket server is responsible for handling all the socket connections and the socket client is responsible for emitting and listening to events.

### Socket server
The socket server is responsible for handling all the socket connections. It is responsible for emitting and listening to events.

### Socket Events
You can find the events that socket listen to on `http://localhost:PORT/socket-docs`


**Note**: If you want to locally test Socket you'll have to use `postman` or have `Galileo frontend` running locally


### API testing

For API testing, you need to launch the backend server.

Then you can access the API docs at:
[http://localhost:PORT/api-docs](http://localhost:PORT/api-docs)

