game.hazard = {};

( function( $ ) {
	"use strict";

	gameHazard.prototype = new gameObject();
	gameHazard.prototype.constructor = gameHazard;
	function gameHazard() {
		this.type = 'hazard';
		this.character = '&#9729;';
	};

	gameHazard.prototype.canKill = function( type ) {
		switch ( type ) {
			case 'player':
				return true;
			break;
			default:
				return false;
		}// end switch
	};

	gameHazard.prototype.kill = function( who ) {
		if ( 'player' === who.type ) {
			game.position( who, this.x, this.y );
			game.over( 1, this );
		}// end if
	};


	game.hazard.hazards = [];

	game.hazard.init = function() {
		game.hazard.add( 2, 5 );
		game.hazard.add( 8, 2 );
	};

	game.hazard.add = function( x, y ) {
		var hazard = new gameHazard();

		var i = game.hazard.hazards.length;
		hazard.id = 'hazard-' + i;

		game.hazard.hazards.push( hazard );
		game.position( hazard, x, y );
	};
})(jQuery);

amplify.subscribe( 'game-init', game.hazard.init );