/**
 * name-gen
 */

var path        = require( 'path' );

var koa         = require( 'koa' );
var logger      = require( 'koa-logger' );
var serve       = require( 'koa-static' );
var route       = require( 'koa-route' );
var mount       = require( 'koa-mount' );

var render      = require( './util/views' );



var app = koa();

app.use( logger() );


// Custom 404
app.use( function *( next ) {
    yield next;

    if ( this.body || !this.idempotent ) {
        return;
    }

    this.status = 404;
    this.body = yield render( '404' );
});


// Serve the frontend
app.use( serve( path.join( __dirname, '../public' ) ) );


// Export composable app
module.exports = app;
