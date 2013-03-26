game.obstacle = {};

( function( $ ) {
	"use strict";

	gameObstacle.prototype = new gameObject();
	gameObstacle.prototype.constructor = gameObstacle;
	function gameObstacle() {
		this.type = 'obstacle';
		this.character = '&#9776;';
	};

	gameObstacle.prototype.canMove = function( who ) {
		switch ( who.type ) {
			case 'player':
			case 'obstacle':
				return true;
			break;
			default:
				return false;
		}// end switch
	};

	game.obstacle.obstacles = [];

	game.obstacle.init = function() {
		game.obstacle.add( 3, 3 );
		game.obstacle.add( 3, 5 );
		game.obstacle.add( 5, 3 );


		game.obstacle.add( 5, 5 );
		game.obstacle.add( 4, 5 );
		game.obstacle.add( 4, 3 );

		game.obstacle.add( 9, 7 );
		game.obstacle.add( 8, 7 );
		game.obstacle.add( 7, 7 );
		game.obstacle.add( 7, 8 );
		game.obstacle.add( 7, 9 )
	};

	game.obstacle.add = function( x, y ) {
		var obstacle = new gameObstacle();

		var i = game.obstacle.obstacles.length;
		obstacle.id = 'obstacle-' + i;

		game.obstacle.obstacles.push( obstacle );
		game.position( obstacle, x, y );
	};
})(jQuery);

amplify.subscribe( 'game-init', game.obstacle.init );