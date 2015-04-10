
import moniker from 'moniker-level';

export default function*() {
    var res = null;

    try {
        res = yield moniker.meta.get( 'categories' );
    } catch( err ) {
        this.status = 500;
        this.body = {
            status: 500,
            message: 'Error getting categories',
            verbose: err
        };
    }

    this.status = 200;
    this.body = {
        status: 200,
        message: res
    };
}
