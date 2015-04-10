
import KoaRouter from 'koa-router';
import chalk from 'chalk';

/**
 * Router
 * @class
 */
export default class Router extends KoaRouter {
    /**
     * @constructs
     */
    constructor() {
        super();

        this._extendVerbs();

        this.appRoutes = {};
        this.verbs.forEach( verb => {
            this.appRoutes[ verb ] = [];
        });

        this._createRoutes();
    }

    /**
     * Available HTTP verbs
     * @type <Array:String>
     * @getter
     */
    get verbs() {
        return [
            'get',
            'post',
            'put',
            'patch',
            'delete'
        ];
    }

    /**
     * App specific routes
     * @TODO is declarative best? could automate?
     */
    _createRoutes() {

        this.post( '/categories', require( './category/create' ) );
        this.get( '/categories', require( './category/get' ) );

        this.post( '/names/:category', require( './names/create' ) );
        this.delete( '/names/:category', require( './names/delete' ) );
        this.get( '/names/:category/:commonality', require( './names/get' ) );
    }

    /**
     * Logs some route info
     */
    debugRoutes() {
        console.log( chalk.yellow( '[moniker-api:router]', chalk.white( 'routes' ) ) );
        Object.keys( this.appRoutes ).forEach( key => {
            this.appRoutes[ key ].forEach( route => {
                console.log( ' ', chalk.green( key ), chalk.grey( route ) );
            });
        });
    }

    /**
     * Extends each route creation function to allow route debugging
     */
    _extendVerbs() {
        this.verbs.forEach( verb => {
            this[ verb ] = function( route, cb ) {
                try {
                    this.appRoutes[ verb ].push( route );
                    super[ verb ]( route, cb );
                } catch( err ) {
                    console.error( 'error creating verb' );
                    throw new Error( err );
                }
            };
        });
    }
}
