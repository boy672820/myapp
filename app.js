// Modules
var express = require( 'express' );
var mongoose = require( 'mongoose' );
var path = require( 'path' );
// Express
var app = express();


// Mongodb settings
mongoose.connect( process.env.MONGODB );
var db = mongoose.connection;

db.once( 'open', function () {
  console.log( 'DB Connected!' );
} );
db.on( 'error', function ( error ) {
  console.log( 'DB Error: ', error );
} );

var DataSchema = mongoose.Schema( {
  name: String,
  count: Number
} );

var Data = mongoose.model( 'data', DataSchema );


// App settings
app.set( 'view engine', 'ejs' );
//app.use( express.static( path.join( __dirname, 'public' ) ) );


// Learning Node.js & Express framework coding!
app.get( '/', function ( req, res ) {
  Data.findOne( { name: 'myData' }, function ( error, data ) {
    if ( error ) return console.log( 'Data Error: ', error );

    data.count += 1;
    data.save( function ( error ) {
      if ( error ) return console.log( 'Data Error: ', error );

      res.render( 'index', data );
    } );
  } );
} );
/*
app.get( '/reset', function( req, res ) {
  data.count = 0;
  res.render( 'index', data );
} );
app.get( '/set/count', function ( req, res ) {
  if ( req.query.count ) data.count = parseInt( req.query.count );
  res.render( 'index', data );
} );
app.get( '/set/:num', function ( req, res ) {
  data.count = parseInt( req.params.num );
  res.render( 'index', data );
} );
*/
// Listen HTTP Server
app.listen( 8000, function () {
  console.log( 'Server on!' );
} );
