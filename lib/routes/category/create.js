
import parse from 'co-body';
import moniker from 'moniker-level';

/**
 * POST
 * @category
 */
export default function*() {
    var body = yield parse( this );

    console.log( 'create category route' );
    console.log( body );

    try {
        yield moniker.createCategory( body.category );
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
}
