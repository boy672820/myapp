// Import modules
var express = require( 'express' ),
	router = express.Router(),
	mongoose = require( 'mongoose' ),
	Post = require( '../models/Post' );


// isError()
var isError = function ( error, res ) {
	if ( error )
		return res.json( { success: false, message: error } );
};


// GET:: Index
router.get( '/', function ( req, res ) {
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
router.get( '/new', function ( req, res ) {
	res.render( 'posts/new' );
} );

// POST:: Create
router.post( '/', function ( req, res ) {
	Post.create( req.body.post, function ( error, post ) {
		isError( error, res );
		res.redirect( '/posts' );
	} );
} );

// GET:: Show
router.get( '/:id', function ( req, res ) {
	Post.findById( req.params.id, function ( error, post ) {
		isError( error, res );
		res.render( 'posts/show', { data: post } );
	} );
} );

// GET:: Edit
router.get( '/edit/:id', function ( req, res ) {
	Post.findById( req.params.id, function ( error, post ) {
		isError( error, res );
		res.render( 'posts/edit', { data: post } );
	} );
} );

// PUT:: Update
router.put( '/:id', function( req, res ) {
	req.body.post.updatedAt = Date.now();

	Post.findByIdAndUpdate( req.params.id, req.body.post, function ( error, post ) {
		isError( error, res );
		res.redirect( '/posts/' + req.params.id );
	} );
} );

// DELETE:: Destroy
router.delete( '/:id', function ( req, res ) {
	Post.findByIdAndRemove( req.params.id, function ( error, post ) {
		isError( error, res );
		res.redirect( '/posts' );
	} );
} );


// Exports module
module.exports = router;
