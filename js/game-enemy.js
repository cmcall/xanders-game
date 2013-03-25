game.enemy = {};

( function( $ ) {
	"use strict";

	game.enemy.init = function() {
		game.enemy.character = '&#9763;';
		game.enemy.speed = 500;
		game.enemy.id = 'enemy';

		game.position( game.enemy, 9, 9 );

		amplify.subscribe( 'game-move', game.enemy.check_move );

		game.enemy.go();
	};

	game.enemy.go = function() {
		game.enemy.timer = setInterval(function(){
			game.enemy.move();
		}, game.enemy.speed);
	};

	game.enemy.stop = function() {
		clearInterval( game.enemy.timer );
	};

	game.enemy.move = function() {
		var directions = [];

		// @TODO - enemy is *really* dumb about finding it's way around obstacles

		var all_directions = false;

		if ( false === game.enemy.moved ) {
			directions = game.directions.slice(0);
			directions.sort(function() {return 0.5 - Math.random()});

			/*
			// let's speed the enemy up a bit if they run into an obstacle
			game.enemy.stop();
			game.enemy.speed -= 10;
			game.enemy.go();
			*/

			for ( var i = 0; i < directions.length; i++ ) {
				game.enemy.move_direction = directions[ i ];
				game.enemy.moved = game.move( game.enemy, game.enemy.move_direction );

				if ( true === game.enemy.moved ) {
					return game.enemy.moved;
				}
			}// end for
			game.over( true );
		} else {
			if ( game.enemy.y > game.player.y ) {
				directions.push('up');
			}// end if

			if ( game.enemy.y < game.player.y ) {
				directions.push('down');
			}// end if

			if ( game.enemy.x < game.player.x ) {
				directions.push('right');
			}// end if

			if ( game.enemy.x > game.player.x ) {
				directions.push('left');
			}// end if

			// succeeded in this direction last time and its still a valid direction, increase the odds
			if ( true === game.enemy.moved && -1 !== directions.indexOf( game.enemy.move_direction ) ) {
				directions.push( game.enemy.move_direction );
			}// end if

			game.enemy.move_direction = directions[ Math.floor( Math.random() * directions.length ) ];
			game.enemy.moved = game.move( game.enemy, game.enemy.move_direction );
		}// end else

		return game.enemy.moved;
	};

	game.enemy.check_move = function( data ) {
		if ( 'player' === data.type && data.x === game.enemy.x && data.y === game.enemy.y ) {
			game.position( game.player, data.x, data.y );
			game.over(0);
		}// end if
	};
})(jQuery);

amplify.subscribe( 'game-init', game.enemy.init );