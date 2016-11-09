// Import modules
var express = require( 'express' );
var mongoose = require( 'mongoose' );
var path = require( 'path' );
var bodyParser = require( 'body-parser' );


// Connect database
mongoose.connect( process.env.MONGODB );
var db = mongoose.connection;
db.once( 'open', function () {
	console.log( 'DB Connected!' );
} );
db.on( 'error', function ( error ) {
	console.log( 'DB Error: ', error );
} );

var postSchema = mongoose.Schema( {
	title: { type: String, required: true },
	body: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date
} );
var Post = mongoose.model( 'post', postSchema );


// Express app instance
var app = express();

// View setting
// 뷰 엔진 :: Embedded JavaScript
app.set( 'view engine', 'ejs' );

// Set use middlewares
/** 미들웨어(Middlewares) 란?
 * 사용자 요청(Request)에 대한 서버로 부터의 응답(Response)은 라우터(Router)를 통해 어떤 응답을 할지 정한다.
 * 미들웨어는 라우터를 통하기 전의 모든 신호들에게 수행되는 명령어이다.
 * app.use() 를 통해 수행될 수 있으며, 해당 명령어는 라우터보다 위에 위치해야 한다.
 */
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( bodyParser.json() );

var isError = function ( error, res ) {
	if ( error )
		return res.json( { success: false, message: error } );
};

// POST:: Create
app.post( '/posts', function ( req, res ) {
	Post.create( req.body.post, function ( error, post ) {
		isError( error, res );
		res.json( { success: true, data: post } );
	} );
} );
// GET:: Index
app.get( '/posts', function ( req, res ) {
	Post.find( {}, function ( error, posts ) {
		isError( error, res );
		res.json( { success: true, data: posts } );
	} );
} );
// GET:: Show
app.get( '/posts/:id', function ( req, res ) {
	Post.findById( req.params.id, function ( error, post ) {
		isError( error, res );
		res.json( { success: true, data: post } );
	} );
} );
// PUT:: Update
app.put( '/posts/:id', function( req, res ) {
	req.body.post.updatedAt = Date.now();

	Post.findByIdAndUpdate( req.params.id, req.body.post, function ( error, post ) {
		isError( error, res );
		res.json( { success: true, message: post._id + ' updated', data: post } );
	} );
} );
// DELETE:: Destroy
app.delete( '/posts/:id', function ( req, res ) {
	Post.findByIdAndRemove( req.params.id, function ( error, post ) {
		isError( error, res );
		res.json( { success: true, message: post._id + ' deleted' } );
	} );
} );


// Listen HTTP Server
app.listen( 8000, function () {
	console.log( 'Server on!' );
} );
