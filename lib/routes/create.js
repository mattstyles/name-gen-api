var parse = require( 'co-body' );

var db = require( '../util/level' );

/**
 * POST
 * @name
 * @commonality
 */
module.exports = function*() {
    var body = yield parse( this );

    console.log( 'create name route' );
    console.log( body );

    try {
        yield db.createName( 'Test', {
            name: body.name,
            commonality: body.commonality
        });
    } catch( err ) {
        this.status = 500;
        this.body = {
            status: 500,
            message: 'Error creating name',
            verbose: err.message
        };
        return;
    }

    this.status = 200;
    this.body = {
        status: 200,
        message: 'Name created ' + body.name + '::' + body.commonality
    };
};
