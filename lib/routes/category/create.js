var parse = require( 'co-body' );

var db = require( '../../util/level' );

/**
 * POST
 * @category
 */
module.exports = function*() {
    var body = yield parse( this );

    console.log( 'create category route' );
    console.log( body );

    try {
        yield db.createCategory( body.category );
    } catch( err ) {
        this.status = 500;
        this.body = {
            status: 500,
            message: 'Error creating category',
            verbose: err.message
        };
        return;
    }

    this.status = 200;
    this.body = {
        status: 200,
        message: 'Category created ' + body.category
    };
};
