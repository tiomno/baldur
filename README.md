Cloud-based RESTful API for connecDIMCloud powered by actionhero.js & Node.js
======================

Security Features
-------------

* Use of SSL protocol is mandatory.
* Every app that consumes the API must be registered to have a private key.
* Every single request is validated with a unique HMAC SHA256 hex digest signature.
 
### Useful links

* [Node.js](https://nodejs.org/en/)
* [actionhero.js](http://www.actionherojs.com/)
* [actionhero Tutorial](https://github.com/evantahler/actionhero-tutorial)
* [Hash-based message authentication code](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)
* [Example of good practices when implementing HMAC SHA256 signature by pusher.com](https://pusher.com/docs/rest_api#authentication)
* [API Security - Best practices (google post)](https://groups.google.com/forum/#!msg/meteor-talk/hL4iDzoreBo/j8lAA4qOQrwJ)
* [Checklist for having this project running](CHECKLIST.md)

actionhero RESTful API Framework
-------------------

### Main Components

* Automatic creation of language dictionary for localization. i18n module is embeded in the framework.
* Every _action_ has a callback function to build the response with easy access to the API and error objects.
* Every parameter _input_ has three callback functions to validate, format and return a default value if the _input_ is "", null or undefined.
* It's possible to keep several versions of an _action_ with automatic routes to access them. If the route is ommited, the last version of the _action_ is executed.
* actionhero has a set of commands to generate default templates for different types of modules (actions, tasks, initializers...)
* A documentation is automatically kept up to date for the frameworks and it's publish as part of the API.
* _Tasks_ can be defined to run in the background and can be triggered by the server or an _action_. The framework uses a [resque](https://github.com/resque/resque) ecosystem to accomplish this.
* Remote Procedure Calls (RPC) capabilities were introduced through the api.redis module. 
* actionhero ships with a Chat framework also which uses RPC heavily.
* It's possible to set up a cluster of nodes which uses redis to allow for pub/sub communication between nodes.
* actionhero ships with the functions needed for a distributed key-value cache.

### actionhero’s default project layout

```
|- config

| -- api.js

| -- errors.js

| -- i18n.js

| -- logger.js

| -- redis.js

| -- routes.js

| -- tasks.js

| -- servers

| ---- web.js

| ---- websocket.js

| ---- socket.js

|-- (project settings)

|

|- actions

|-- (your actions)

|

|- initializers

|-- (any additional initializers you want)

|

|- log

|-- (default location for logs)

|

|- node_modules

|-- (your modules, actionhero should be npm installed in here)

|

|- pids

|-- (pidfiles for your running servers)

|

|- public

|-- (your static assets to be served by /file)

|

|- servers

|-- (custom servers you may make)

|

|- tasks

|-- (your tasks)

|

|- locales

|-- (translation files)

|

|- tests

|-- (tests for your API)

|

readme.md

package.json (be sure to include 'actionhero':'x')
```

### To start up actionhero server from the command line

`./node_modules/.bin/actionhero start`

or if it was globally installed

`actionhero start`

Then visit [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser to see the actionhero in action!

To consume the API use the following path `http://127.0.0.1:8080/api/record`, e.g: [http://127.0.0.1:8080/api/status](http://127.0.0.1:8080/api/status) to get the API _status_ record.
