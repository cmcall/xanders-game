var game = {};

( function( $ ) {
	"use strict";

	game.directions = ['up', 'down', 'left', 'right'];
	game.dead_character = ['&#10014;', '&#9832;'];
	game.win_character = '&#9786;';

	game.grid_size = 9;

	game.occupied = {};

	game.init = function() {
		game.resetBoard();
		amplify.publish('game-init');
	};

	game.resetBoard = function () {
		$('#win').remove();

		game.state = 'active';

		var board='';
		for ( var i = 1; i <= game.grid_size; i++ ) {
			board += '<div class="row' + i + '">';
			for ( var j = 1; j <= game.grid_size; j++) {
				board += '<div class="cell col' + j + '">&nbsp;</div>';
			}// end for
			board += '</div>';
		}// end for

		$('#board').html( board );
	};

	game.position = function( who, x, y ) {

		var prior_position = '.row' + who.y + ' .col' + who.x;

		if ( x ) {
			who.x = x;
		}// end if

		if ( y ) {
			who.y = y;
		}// end if

		var new_position = '.row' + who.y + ' .col' + who.x;

		if ( new_position !== prior_position ) {
			$( new_position ).html( who.character );
			game.occupied[ new_position ] = who;

			if ( game.occupied[ prior_position ] === who ) {
				$( prior_position ).html('');
				game.occupied[ prior_position ] = null;
			}// end if
		}// end if

		return new_position;
	};

	game.get_position = function( x, y ) {
		var position = '.row' + y + ' .col' + x;
		return game.occupied[ position ];
	};

	game.move = function( who, direction ) {
		if ( 'over' === game.state ) {
			return;
		}// end if

		var new_x, new_y, prior_who;
		var prior_x = new_x = who.x;
		var prior_y = new_y = who.y;

		switch ( direction ) {
			case 'up':
				if ( 1 == who.y ) {
					who.moved = false;
					return false;
				}// end if
				new_y = prior_y - 1;
			break;
			case 'down':
				if ( game.grid_size == who.y ) {
					who.moved = false;
					return false;
				}// end if
				new_y = prior_y + 1;
			break;
			case 'left':
				if ( 1 == who.x ) {
					who.moved = false;
					return false;
				}// end if
				new_x = prior_x - 1;
			break;
			case 'right':
				if ( game.grid_size == who.x ) {
					who.moved = false;
					return false;
				}// end if
				new_x = prior_x + 1;
			break;
		}// end switch

		var prior_moved = true;
		prior_who = game.get_position( new_x, new_y );

		if ( undefined !== prior_who && null !== prior_who) {
			// a player or obstacle can push an obstacle, but nothing else can
			if ( ('player' === who.type || 'obstacle' === who.type ) && 'obstacle' === prior_who.type ) {
				prior_moved = game.move( prior_who, direction );
				console.log('moved:'+prior_moved);
			} else if ( ( 'enemy' === who.type && 'player' === prior_who.type ) ) {
				game.over(0);
				return false;
				prior_moved = true;
			} else {
				console.log( 'no move');
				prior_moved = false;
			}// end else
		}// end if

		if ( true === prior_moved ) {
			game.position( who, new_x, new_y );
			who.moved = true;
		} else {
			who.moved = false;
		}// end else

		amplify.publish('game-move', {
			d: direction,
			x: new_x,
			y: new_y,
			t: who.type
		});

		if ( 'over' === game.state ) {
			return false;
		}// end if

		return who.moved;
	};

	game.over = function( win ) {
		game.enemy.stop();
		var message = '';
		if ( win === true ) {
			$( game.position( game.enemy ) ).html( game.win_character );
			message = 'U Win!!!!!';
		} else {
			$( game.position( game.player ) ).html( game.dead_character[ win ] );
			message = 'ZOMG u died';
		}// end else

		$('body').append('<div id="state"><h2>' + message + '</h2><a href="javascript:location.reload();">Play again?</a></div>');

		game.state = 'over';
	};
})(jQuery);


$(function() {
	game.init();
});
