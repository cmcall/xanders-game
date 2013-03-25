game.hazard = {};

( function( $ ) {
	"use strict";

	game.hazard.hazards = [];

	game.hazard.init = function() {
		game.hazard.character = '&#9729;';

		game.hazard.add( 2, 5 );
		game.hazard.add( 8, 2 );

		amplify.subscribe( 'game-move', game.hazard.check_move );
	};

	game.hazard.get = function( id ) {
		var el = id.split('-');
		return game.hazard.hazards[ el[1] ];
	};

	game.hazard.add = function( x, y ) {
		game.hazard.hazards.push( {} );
		var i = game.hazard.hazards.length - 1;

		game.hazard.hazards[i].character = game.hazard.character;
		game.hazard.hazards[i].id = 'hazard-' + i;
		game.hazard.hazards[i].type = 'hazard';

		game.position( game.hazard.hazards[i], x, y );
	};

	game.hazard.check_move = function( data ) {
		for ( var i = 0; i < game.hazard.hazards.length; i++ ) {
			if ( data.type = 'player' && data.x === game.hazard.hazards[i].x && data.y === game.hazard.hazards[i].y ) {
				game.position( game.player, data.x, data.y );
				game.over(1);
			}// end if
		}// end for
	};
})(jQuery);

amplify.subscribe( 'game-init', game.hazard.init );