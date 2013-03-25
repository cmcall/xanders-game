game.player = {};

// &#9729;

( function( $ ) {
	"use strict";

	game.player.init = function() {
		game.position( game.player, 1, 1 );
		game.player.character = '&#9731;';
		game.player.type = 'player';

		$( game.position( game.player ) ).html( game.player.character );

		$(document).keydown( function(e) {

			switch ( e.which ) {
				case 37:
				case 65:
					game.move( game.player, 'left' );
				break;
				case 38:
				case 87:
					game.move( game.player, 'up' );
				break;
				case 39:
				case 68:
					game.move( game.player, 'right' );
				break;
				case 40:
				case 83:
					game.move( game.player, 'down' );
				break;
			}// end switch
		});
	};
})(jQuery);

amplify.subscribe( 'game-init', game.player.init );