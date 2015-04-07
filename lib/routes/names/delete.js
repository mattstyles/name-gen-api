var parse = require( 'co-body' );

var db = require( '../../util/level' );

/**
 * DELETE
 * @name
 * @commonality
 */
module.exports = function*( category ) {
    var body = yield parse( this );

    console.log( 'deleting name route ::', category );
    console.log( body );

    try {
        yield db.deleteName( category, body.commonality, body.name );
    } catch( err ) {
        this.status = 500;
        this.body = {
            status: 500,
            message: 'Error deleting name',
            verbose: err.message
        };
        return;
    }

    this.status = 200;
    this.body = {
        status: 200,
        message: 'Name deleted ' + body.name + '::' + body.commonality
    };
};
