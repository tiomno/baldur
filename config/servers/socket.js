exports['default'] = {
    servers: {
        socket: function(api) {
            return {
                enabled: (process.env.ENABLE_TCP_SERVER !== undefined),
                // TCP or TLS?
                secure: false,
                // passed to tls.createServer if secure=true. Should contain SSL certificates
                serverOptions: {},
                // Port or Socket
                port: 5000,
                // which IP to listen on (use 0.0.0.0 for all)
                bindIP: '0.0.0.0',
                // Enable TCP KeepAlive pings on each connection?
                setKeepAlive: false,
                // Delimiter string for incoming messages
                delimiter: '\n',
                // Maximum incoming message string length in Bytes (use 0 for Infinite)
                maxDataLength: 0,
                // what message to send down to a client who requests a `quit`
                goodbyeMessage: 'Bye!'
            };
        }
    }
};

exports.test = {
    servers: {
        socket: function(api) {
            return {
                enabled: true,
                port: 5001,
                secure: false
            };
        }
    }
};
