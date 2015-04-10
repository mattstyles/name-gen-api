/**
 * moniker-api
 * ---
 *
 * Koa interface for the moniker db
 */


import koa from 'koa';
import logger from 'koa-logger';
import route from 'koa-route';
// import Router from 'koa-router';
import Router from './routes/router';

import render from './util/views';
import chalk from 'chalk';


console.log( chalk.grey( '[moniker-api]' ), 'Warming up moniker...' );

import moniker from 'moniker-level';


moniker.on( 'ready', event => {
    console.log( chalk.grey( '[moniker-api]' ), 'moniker ready' );
    app.emit( 'ready' );
});


var router = new Router();

if ( process.env.DEBUG ) {
    router.debugRoutes();
}


var app = koa();

app.use( logger() );

app.use( router.routes() );

// Custom 404
if ( process.env.DEBUG ) {
    app.use( function *( next ) {
        yield next;

        if ( this.body || !this.idempotent ) {
            return;
        }

        this.status = 404;
        this.body = yield render( '404' );
    });
}


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
export default app;
