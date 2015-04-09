
var db = require( 'moniker-level' );


module.exports = function*( category, commonality) {
    var res = null;

    try {
        res = yield db.getNames( category, commonality );
    } catch( err ) {
        this.status = 500;
        this.body = {
            status: 500,
            message: 'Error getting names from ' + category + ':' + commonality,
            verbose: err
        };
    }

    this.status = 200;
    this.body = {
        status: 200,
        message: res
    };
};
