require( 'babel/register' );


var app = require( './lib/server' );
var port = process.env.PORT || process.env.npm_package_config_port || 14320;

console.log( 'Warming up db...' );
var db = require( './lib/util/level' );

db.on( 'ready', function() {
    console.log( 'db ready' );
    app.listen( port );
    console.log( 'Listening on port %s', port );
});
