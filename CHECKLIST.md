Cloud-based RESTful API for connecDIMCloud powered by actionhero.js & Node.js
======================

Checklist of dependencies for this project
-------------

* Last stable `Node.js` version.
* Last stable `npm` version.
* After clonning this repository run `npm install` to install all npm packages. Although, if GitLab deploys the project it'll include those. 
* Install `redis` DB engine. For ubuntu, please see [How To Install and Use Redis](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis).
* Install `nginx`. For ubuntu, please see [How To Install Nginx on Ubuntu 14.04 LTS](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-14-04-lts).
* Set up the API config to listen on a socket.
* Create the folder `/var/www/api/current/tmp/sockets/` provided that the API is installed in `/var/www/api/`.
* Install `pm2` (globally recommended) to run actionhero as a daemon. For ubuntu, please see [pm2 actionhero startup](https://gist.github.com/slattery/0fd0ce6e62f6fb185ea9). If we wanted to run the server manually, it'd be `sudo /usr/local/bin/node /usr/local/lib/node_modules/pm2/bin/pm2 start /etc/pm2/baldur_ah_server.json --name baldur`.

### nginx site config example `/etc/nginx/sites-available/default`

```
server {
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X_FORWARDED_PROTO https;
    proxy_redirect off;

    listen 80 default_server;
	listen [::]:80 default_server ipv6only=on;

	# root /usr/share/nginx/html;
	root /var/www/api/public/;
	index index.html index.htm;

	# Make site accessible from http://localhost/
	server_name localhost;

	try_files /$uri/index.html /cache/$uri/index.html /$uri.html /cache/$uri.html /$uri /cache/$uri @app;

    location @app {
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_cache_bypass $http_pragma $http_authorization;
        proxy_no_cache $http_pragma $http_authorization;

        proxy_pass http://unix:/var/www/api/current/tmp/sockets/actionhero.sock:;
    }
}
```

### actionhero web server config file example `config/server/web.js`

```
exports.production = {
    servers: {
        web: function(api) {
            return {
                port: '/var/www/api/current/tmp/sockets/actionhero.sock',
                bindIP: null,
                metadataOptions: {
                    serverInformation: false,
                    requesterInformation: false
                }
            }
        }
    }
}
```

### pm2 config file example `/etc/pm2/baldur_ah_server.json`

```
[{
    "name"       : "baldur",
    "script"     : "/var/www/api/node_modules/actionhero/bin/actionhero",
    "env"        : {
      "NODE_ENV" : "development",
      "PROJECT_ROOT"      : "/var/www/api/",
      "ACTIONHERO_ROOT"   : "/var/www/api/node_modules/actionhero"
    },
    "instances"  : "1",
    "error_file" : "/var/log/pm2/baldur_ah_server.err",
    "out_file"   : "/var/log/pm2/baldur_ah_server.out",
    "pid_file"   : "/var/log/pm2/baldur_ah_server.pid",
    "exec_mode"  : "fork_mode"
}]
```
