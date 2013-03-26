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
		game.drawBoard();
	};

	game.drawBoard = function() {
		var board='';
		for ( var i = 1; i <= game.grid_size; i++ ) {
			board += '<div class="row">';
			for ( var j = 1; j <= game.grid_size; j++) {
				board += '<div class="cell" id="c' + j + 'r' + i + '"></div>';
			}// end for
			board += '</div>';
		}// end for

		$('#board').html( board );
	};

	game.getSelector = function( x, y ) {
		return '#c' + x + 'r' + y
	};

	game.getPosition = function( who ) {
		return game.getSelector( who.x, who.y );
	};

	game.getObjectByPosition = function( x, y ) {
		var position = game.getSelector( x, y );
		return game.occupied[ position ];
	};

	game.position = function( who, x, y ) {

		var prior_position = game.getSelector( who.x, who.y );

		who.x = x;
		who.y = y;

		var new_position = game.getSelector( who.x, who.y );

		$( new_position ).html( who.character );
		game.occupied[ new_position ] = who;

		if ( game.occupied[ prior_position ] === who ) {
			$( prior_position ).html('');
			game.occupied[ prior_position ] = null;
		}// end if

		return new_position;
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
		prior_who = game.getObjectByPosition( new_x, new_y );

		if ( undefined !== prior_who && null !== prior_who) {
			if ( prior_who.canKill( who ) ) {
				prior_who.kill( who );
				return false;
			}// end if
			else if ( prior_who.canDie( who ) && who.canKill( prior_who ) ) {
				game.position( who, new_x, new_y );
				who.kill( prior_who );
				return false;
			}// end else if
			else if ( prior_who.canMove( who, direction ) ) {
				prior_moved = game.move( prior_who, direction );
			}// end if
			else {
				prior_moved = false;
			}// end else
		}// end if

		if ( true === prior_moved ) {
			game.position( who, new_x, new_y );
			who.moved = true;
		} else {
			who.moved = false;
		}// end else

		if ( 'over' === game.state ) {
			return false;
		}// end if

		return who.moved;
	};

	game.over = function( win, loser ) {
		game.enemy.stop();

		var message = '';
		if ( win === true ) {
			$( game.getPosition( loser ) ).html( game.win_character );
			message = 'U Win!!!!!';
		} else {
			$( game.getPosition( game.the_player ) ).html( game.dead_character[ win ] );
			message = 'ZOMG u died';
		}// end else

		$('body').append('<div id="state"><h2>' + message + '</h2><a href="javascript:location.reload();">Play again?</a></div>');

		game.state = 'over';
	};

	game.reverse_direction = function ( direction ) {
		switch ( direction ) {
			case 'up':
				return 'down';
			break;
			case 'down':
				return 'up';
			break;
			case 'left':
				return 'right';
			break;
			case 'right':
				return 'left';
			break;
		}// end switch
	};

	$(function() {
		game.init();
	});

})(jQuery);

/* define generic object that all other game objects will be built from */

function gameObject() {
	this.type = 'generic';
	this.character = '&nbsp;';
};

gameObject.prototype.canMove = function( who, direction ) {
	return false;
};

gameObject.prototype.canKill = function( who ) {
	return false;
};

gameObject.prototype.canDie = function( who ) {
	return false;
};

// must be defined if canKill returns true
gameObject.prototype.kill = function( who ) {
	return false;
};