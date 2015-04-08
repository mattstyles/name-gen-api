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

console.log( 'Warming up db...' );
var db = require( './util/level' );
db.on( 'ready', event => {
    console.log( 'db ready' );
    app.emit( 'ready' );
});


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


// Create new category
app.use( route.post( '/categories', require( './routes/category/create' ) ) );

// Get all categories
app.use( route.get( '/categories', require( './routes/category/get' ) ) );

// Create new name
app.use( route.post( '/names/:category', require( './routes/names/create' ) ) );

// Deletes an existing name
app.use( route.del( '/names/:category', require( './routes/names/delete' ) ) );

// Get all names from a category:commonality
app.use( route.get( '/names/:category/:commonality', require( './routes/names/get' ) ) );


// Export composable app
module.exports = app;
