
import moniker from 'moniker-level';


export default function*( category, commonality) {
    var res = null;

    try {
        res = yield moniker.getNames( category, commonality );
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
}
