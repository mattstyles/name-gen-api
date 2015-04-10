
import KoaRouter from 'koa-router';
import chalk from 'chalk';


export default class Router extends KoaRouter {
    constructor() {
        super();

        this._extendVerbs();

        this.appRoutes = {
            get: [],
            post: [],
            del: []
        };

        this._createRoutes();
    }

    _createRoutes() {

        this.get( '/', function *( next ) {
            console.log( chalk.magenta( '[moniker-api]' ), '/' );
        });

        this.get( '/users/:id', function *( next, id ) {
            console.log( chalk.magenta( '[moniker-api]' ), '/users/:id' );
            console.log( next );
            console.log( this.params.id );
            this.status = 200;
            this.body = JSON.stringify({
                id: this.params.id,
                msg: 'hello world'
            });
        });
    }

    debugRoutes() {
        console.log( chalk.yellow( '[moniker-api:router]', chalk.grey( 'routes' ) ) );
        Object.keys( this.appRoutes ).forEach( key => {
            this.appRoutes[ key ].forEach( route => {
                console.log( ' ', chalk.green( key ), chalk.grey( route ) );
            });
        });
    }

    _extendVerbs() {
        [
            'get',
            'put',
            'post',
            'patch',
            'delete'
        ].forEach( verb => {
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

    // get( route, cb ) {
    //     this.appRoutes.get.push( route );
    //     super.get( route, cb );
    // }

}
