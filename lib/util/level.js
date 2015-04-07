var EventEmitter = require( 'events' );
var path = require( 'path' );
var osenv = require( 'osenv' );
var pkg = require( '../../package.json' );
var dbpath = path.join( osenv.home(), process.env.DBPATH || process.env.npm_package_config_dbpath || pkg.name + '/names.lev' );
var uuid = require( 'node-uuid' );

// @TODO needs to ensure dbpath exists with a cheeky mkdir -p

var level = require( 'level-party' )( dbpath );
var sub = require( 'level-sublevel' )( level );
var promisify = require( 'level-promisify' );


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
            throw new Error( name + 'already exists' );
        }

        this.col[ name ] = sub;

        return this.col[ name ];
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
        this.meta = this.subs.add( 'meta', promisify( sub.sublevel( 'meta', {
            encoding: 'json'
        })));

        // Add other categories
        this.meta.get( 'categories' )
            .then( res => {
                if ( !res.length ) {
                    return this.emit( 'ready', [] );
                }

                Promise.all( res.map( this.createCategory.bind( this ) ) )
                    .then( categories => {
                        this.emit( 'ready', res );
                    })
                    .catch( err => {
                        console.log( '[DB] Init Error' );
                        console.dir( err );
                        throw new Error( err );
                    });
            })
            .catch( err => {
                if ( err && err.notFound ) {
                    this.meta.put( 'categories', [] )
                        .then( () => {
                            this.emit( 'ready', [] );
                        })
                        .catch( err => {
                            throw new Error( err );
                        });

                    return;
                }

                throw new Error( err );
            });
    }

    /**
     * Creates category structure.
     * Each category holds 'common', 'uncommon', 'rare' commonality ranges.
     * Each commonality holds 'first' and 'last' for first name and last name.
     * @param name <String> name of category  to create
     * @returns <Promise> resolves with the created category sublevel
     */
    createCategory( category ) {
        return new Promise( ( resolve, reject ) => {
            console.log( 'Creating category:', category );
            if ( !category ) {
                return reject();
            }

            var cat = promisify( sub.sublevel( category, {
                encoding: 'json'
            }));

            [ 'common', 'uncommon', 'rare' ].forEach( commonality => {
                cat.root.sublevel( commonality, {
                    encoding: 'json'
                });
            });

            this.subs.add( category, cat );

            // Add new sublevel category to categories meta
            this.meta.get( 'categories' )
                .then( res => {
                    if ( res.includes( category ) ) {
                        console.warn( '[DB] Sublevel already exists in categories ' + category );
                    } else {
                        res.push( category );
                    }

                    this.meta.put( 'categories', res )
                        .then( () => {
                            resolve( cat );
                        })
                        .catch( reject );
                })
                .catch( reject );
        });
    }


    /**
     * Creates a name structure.
     * @param category <String>
     * @param name <Object>
     *   @param name <String>
     *   @param commonality <enum:commonality>
     * @returns <Promise> resolves with the newly created name structure
     */
    createName( category, name ) {
        return new Promise( ( resolve, reject ) => {
            var cat = this.subs.find( category );

            if ( !cat ) {
                return reject({
                    status: 500,
                    message: '[DB] error creating new name :: category does not exist'
                });
            }

            // Names do not have to be unique so just insert
            promisify( cat.root.sublevel( name.commonality, {
                encoding: 'json'
            }))
                .put( uuid.v4(), name.name )
                .then( res => {
                    console.log( 'Successfully put', name.name, 'into', name.commonality );
                    resolve();
                })
                .catch( reject );
        });
    }

    /**
     * Returns the names for a given category and commonality
     */
    getNames( category, commonality ) {
        return new Promise( ( resolve, reject ) => {
            var cat = this.subs.find( category );

            if ( !cat ) {
                return reject({
                    status: 500,
                    message: '[DB] error getting names :: category does not exist'
                });
            }

            var results = [];

            cat.root.sublevel( commonality, {
                encoding: 'json'
            })
                .createReadStream({
                    keys: false,
                    values: true
                })
                .on( 'data', res => {
                    results.push( res );
                })
                .on( 'error', err => {
                    reject( err );
                })
                .on( 'end', () => {
                    resolve( results );
                });
        });
    }
}


export default new DB();
