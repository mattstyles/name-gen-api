var parse = require( 'co-body' );

var db = require( 'moniker-level' );

/**
 * POST
 * @name
 * @commonality
 */
module.exports = function*( category ) {
    var body = yield parse( this );

    console.log( 'create name route ::', category );
    console.log( body );

    try {
        yield db.createName( category, body.commonality, body.name );
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
