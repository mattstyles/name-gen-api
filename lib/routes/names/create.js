import parse from 'co-body';
import moniker from 'moniker-level';

/**
 * POST
 * @name
 * @commonality
 */
export default function*() {
    var body = yield parse( this );

    console.log( 'create name route ::', this.params.category );
    console.log( body );

    try {
        yield moniker.createName( this.params.category, body.commonality, body.name );
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
}
