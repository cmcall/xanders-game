game.enemy = {};

( function( $ ) {
	"use strict";

	gameEnemy.prototype = new gameObject();
	gameEnemy.prototype.constructor = gameEnemy;
	function gameEnemy() {
		this.type = 'enemy';
		this.character = '&#9763;';
	};

	gameEnemy.prototype.canKill = function( who ) {
		switch ( who.type ) {
			case 'player':
				return true;
			break;
			default:
				return false;
		}// end switch
	};

	gameEnemy.prototype.go = function() {
		// @TODO: address IE bug (parameter passign not allowed)
		this.timer = setInterval( this.move, game.enemy.speed, this );
	};

	gameEnemy.prototype.stop = function() {
		clearInterval( this.timer );
	};

	// Note: we cannot use "this" in this function because setInterval sets it incorrectly
	gameEnemy.prototype.move = function( who ) {
		var directions = [];

		// @TODO - enemy is *really* dumb about finding it's way around obstacles

		if ( false === who.moved ) {
			directions = game.directions.slice(0);
			directions.sort( function() { return 0.5 - Math.random() } );

			for ( var i = 0; i < directions.length; i++ ) {
				who.moved = game.move( who, directions[ i ] );

				if ( true === who.moved ) {
					return who.moved;
				}// end if
			}// end for

			// @TODO make this handle multiple enemies
			if ( 'active' == game.state ) {
				game.over( true, who ); // win!
			}// end if
		} else {
			if ( who.y > game.the_player.y ) {
				directions.push('up');
			}// end if

			if ( who.y < game.the_player.y ) {
				directions.push('down');
			}// end if

			if ( who.x < game.the_player.x ) {
				directions.push('right');
			}// end if

			if ( who.x > game.the_player.x ) {
				directions.push('left');
			}// end if

			// succeeded in who direction last time and its still a valid direction, increase the odds
			if ( true === who.moved && -1 !== directions.indexOf( who.move_direction ) ) {
				directions.push( who.move_direction );
			}// end if

			who.move_direction = directions[ Math.floor( Math.random() * directions.length ) ];
			who.moved = game.move( who, who.move_direction );
		}// end else

		return who.moved;
	};

	gameEnemy.prototype.kill = function( who ) {
		if ( 'player' === who.type ) {
			game.position( who, this.x, this.y );
			game.over( 0, this );
		}// end if
	};

	/**
	 * Setup enemies
	 */

	game.enemy.init = function() {
		game.enemy.speed = 400;
		game.enemy.enemies = [];

		game.enemy.add( 9, 9 );
	};

	game.enemy.add = function( x, y ) {
		var enemy = new gameEnemy();

		var i = game.enemy.enemies.length;

		enemy.id = 'enemy-' + i;

		game.enemy.enemies.push( enemy );
		game.position( enemy, x, y );

		enemy.go();
	};

	game.enemy.stop = function() {
		for ( var i = 0; i < game.enemy.enemies.length; i++ ) {
			game.enemy.enemies[i].stop();
		}// end for
	}
})(jQuery);

amplify.subscribe( 'game-init', game.enemy.init );