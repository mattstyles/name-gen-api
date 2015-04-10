/**
 * moniker-api
 * ---
 *
 * Koa interface for the moniker db
 */

import koa from 'koa';
import logger from 'koa-logger';

import render from './util/views';
import chalk from 'chalk';


console.log( chalk.grey( '[moniker-api]' ), 'Warming up moniker...' );

import moniker from 'moniker-level';


moniker.on( 'ready', event => {
    console.log( chalk.grey( '[moniker-api]' ), 'moniker ready' );
    app.emit( 'ready' );
});


import Router from './routes/router';
var router = new Router();



var app = koa();

app.use( logger() );


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


// Attach router
app.use( router.routes() );


// Export composable app
export default app;
