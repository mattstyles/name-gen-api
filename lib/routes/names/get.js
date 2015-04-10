
import moniker from 'moniker-level';


export default function*() {
    var res = null;

    try {
        res = yield moniker.getNames( this.params.category, this.params.commonality );
    } catch( err ) {
        this.status = 500;
        this.body = {
            status: 500,
            message: 'Error getting names from ' + this.params.category + ':' + this.params.commonality,
            verbose: err
        };
    }

    this.status = 200;
    this.body = {
        status: 200,
        message: res
    };
}
