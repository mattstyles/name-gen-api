require( 'babel/register' )({
    optional: [
        'asyncToGenerator'
    ]
});

/**
 * Moniker-api is expected to be mounted into an app.
 * This is useful for firing up a test instance though.
 */

var app = require( './lib/server' );
var port = process.env.PORT || process.env.npm_package_config_port || 14320;

app.on( 'ready', function() {
    app.listen( port );
    console.log( 'Listening on port %s', port );
});
