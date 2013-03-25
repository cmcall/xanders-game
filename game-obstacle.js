game.obstacles = {};

( function( $ ) {
	"use strict";

	game.obstacles.obstacle = [];

	game.obstacles.init = function() {
		game.obstacles.character = '&#9776;';

		game.obstacles.add( 3, 3 );
		game.obstacles.add( 3, 8 );
		game.obstacles.add( 5, 3 );
		game.obstacles.add( 7, 6 );
		game.obstacles.add( 6, 9 );
		game.obstacles.add( 5, 6 );
	};

	game.obstacles.get = function( id ) {
		var el = id.split('-');
		return game.obstacles.obstacle[ el[1] ];
	};

	game.obstacles.add = function( x, y ) {
		game.obstacles.obstacle.push( {} );
		var i = game.obstacles.obstacle.length - 1;

		game.obstacles.obstacle[i].character = game.obstacles.character;
		game.obstacles.obstacle[i].id = 'obstacle-' + i;
		game.obstacles.obstacle[i].type = 'obstacle';

		game.position( game.obstacles.obstacle[i], x, y );
	};
})(jQuery);

amplify.subscribe( 'game-init', game.obstacles.init );