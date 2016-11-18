// Import modules
var express = require( 'express' );
var mongoose = require( 'mongoose' );
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var methodOverride = require( 'method-override' );


// Connect database
mongoose.Promise = global.Promise;
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
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( methodOverride( '_method' ) );

// isError()
var isError = function ( error, res ) {
	if ( error )
		return res.json( { success: false, message: error } );
};

// Set routes

// GET:: Index
app.get( '/posts', function ( req, res ) {
	/**
	 * find에서 바로 콜백 함수가 호출되지 않고, find으로 데이터를 찾고, sort로 자료를 정렬하고, exec로 함수를 수정하는 형태이다.
	 * sort로 자료 정렬 시 '-createdAt'의 '-'는 역방향으로 정렬을 하라는 뜻이다. 그냥 'createdAt'으로 하면 정방향으로 정렬된다.
	 */
	Post.find( {} ).sort( '-createdAt' ).exec( function ( error, posts ) {
		isError( error, res );
		res.render( 'posts/index', { data: posts } );
	} );
} );

// GET:: New
app.get( '/posts/new', function ( req, res ) {
	res.render( 'posts/new' );
} );

// POST:: Create
app.post( '/posts', function ( req, res ) {
	Post.create( req.body.post, function ( error, post ) {
		isError( error, res );
		res.redirect( '/posts' );
	} );
} );

// GET:: Show
app.get( '/posts/:id', function ( req, res ) {
	Post.findById( req.params.id, function ( error, post ) {
		isError( error, res );
		res.render( 'posts/show', { data: post } );
	} );
} );

// GET:: Edit
app.get( '/posts/edit/:id', function ( req, res ) {
	Post.findById( req.params.id, function ( error, post ) {
		isError( error, res );
		res.render( 'posts/edit', { data: post } );
	} );
} );

// PUT:: Update
app.put( '/posts/:id', function( req, res ) {
	req.body.post.updatedAt = Date.now();

	Post.findByIdAndUpdate( req.params.id, req.body.post, function ( error, post ) {
		isError( error, res );
		res.redirect( '/posts/' + req.params.id );
	} );
} );

// DELETE:: Destroy
app.delete( '/posts/:id', function ( req, res ) {
	Post.findByIdAndRemove( req.params.id, function ( error, post ) {
		isError( error, res );
		res.redirect( '/posts' );
	} );
} );


// Listen HTTP Server
app.listen( 8000, function () {
	console.log( 'Server on!' );
} );
