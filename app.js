// Import modules
var express = require( 'express' ),
	mongoose = require( 'mongoose' ),
	path = require( 'path' ),
	bodyParser = require( 'body-parser' ),
	methodOverride = require( 'method-override' );


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
app.use( express.static( path.join( __dirname, 'static' ) ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( methodOverride( '_method' ) );

// Set routes
app.use( '/posts', require( './routes/posts' ) );


// Listen HTTP Server
app.listen( 8000, function () {
	console.log( 'Server on!' );
} );
