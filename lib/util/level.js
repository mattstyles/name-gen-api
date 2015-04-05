var EventEmitter = require( 'events' );
var path = require( 'path' );
var osenv = require( 'osenv' );
var pkg = require( '../../package.json' );
var dbpath = path.join( osenv.home(), process.env.DBPATH || process.env.npm_package_config_dbpath || pkg.name + '/names.lev' );

// @TODO needs to ensure dbpath exists with a cheeky mkdir -p

var level = require( 'level-party' )( dbpath );
var sub = require( 'level-sublevel' )( level );



/**
 * Collection of sublevel categories.
 * Db categories are specified by user e.g. English, French, Australian.
 */
class SublevelCollection {
    constructor() {
        this.col = {};
    }

    add( name, sub ) {
        // Ensure name does not exist already in collection
        if ( this.find( name ) ) {
            return;
        }

        // Ensure name does not additionally exist on this object
        if ( Object.keys( this ).includes( name ) ) {
            return false;
        }

        this[ name ] = sub;
    }


    find( name ) {
        if ( Object.keys( this.col ).includes( name ) ) {
            return this.col[ name ];
        }
    }
}


/**
 * The db instance
 */
class DB extends EventEmitter {
    constructor() {
        super();

        // Create sublevels
        this.subs = new SublevelCollection();

        // Add meta collection
        this.subs.add( 'meta', sub.sublevel( 'meta', {
            encoding: 'json'
        }));

        // Add other categories
        try {
            this.subs.meta.get( 'categories', ( err, res ) => {
                if ( err && err.notFound ) {
                    this.subs.meta.put( 'categories', [], err => {
                        if ( err ) {
                            throw new Error( err );
                        }

                        this.emit( 'ready', [] );
                    });

                    return;
                }

                if ( !res.length ) {
                    return this.emit( 'ready', [] );
                }

                Promise.all( res.map( this.createCategory.bind( this ) ) )
                    .then( categories => {
                        this.emit( 'ready', res );
                    })
                    .catch( err => {
                        console.log( '[DB] Init Error' );
                        console.error( err );
                    });
            });
        } catch( err ) {
            console.log( err );
        }
    }

    /**
     * Creates category structure.
     * Each category holds 'common', 'uncommon', 'rare' commonality ranges.
     * Each commonality holds 'first' and 'last' for first name and last name.
     * @param name <String> name of category  to create
     * @returns <Promise> resolves with the created category sublevel
     */
    createCategory( name ) {
        return new Promise( ( resolve, reject ) => {
            console.log( 'Creating category:', name );
            if ( !name ) {
                return reject();
            }

            var cat = sub.sublevel( name, {
                encoding: 'json'
            });

            [ 'common', 'uncommon', 'rare' ].forEach( commonality => {
                var c = cat.sublevel( commonality, {
                    encoding: 'json'
                });

                [ 'first', 'last' ].forEach( names => {
                    c.sublevel( names, {
                        encoding: 'json'
                    });
                });
            });

            this.subs.add( name, cat );

            // Add new sublevel category to categories meta
            this.subs.meta.get( 'categories', ( err, res ) => {
                if ( err ) {
                    return reject( err );
                }

                if ( res.includes( name ) ) {
                    console.warn( '[DB] Sublevel already exists in categories ' + name );
                } else {
                    res.push( name );
                }

                this.subs.meta.put( 'categories', res, err => {
                    if ( err ) {
                        return reject( err );
                    }

                    resolve( cat );
                });
            });
        });
    }
}


export default new DB();
