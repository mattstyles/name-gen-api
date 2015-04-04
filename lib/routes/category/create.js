var parse = require( 'co-body' );
var route = require( 'koa-route' );

var db = require( '../../util/level' );

module.exports = route.post( '/api/category/create', function*() {
    var body = yield parse( this );

    console.log( 'create category route' );
    console.log( body );

    try {
        yield db.createCategory( body.name );
    } catch( err ) {
        this.status = 500;
        this.body = {
            status: 500,
            message: err
        };
        return;
    }


    this.status = 200;
    this.body = {
        status: 200,
        message: 'ok'
    };
});
