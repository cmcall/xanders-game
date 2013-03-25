test( "changeTurn", function() {
	ttt.resetBoard();

	$cell = $('#board .row1 .col1');
	$cell.trigger('click');
	equal( $cell.text(), 'X', 'we expect the cell to contain X' );
	equal( ttt.turn, 'O', 'we expect it to be O\'s turn' );
});


test( "diagonal X win", function() {
	ttt.resetBoard();
	
	$('#board .row1 .col1').trigger('click'); // X
	$('#board .row1 .col3').trigger('click'); // O
	$('#board .row2 .col2').trigger('click'); // X
	$('#board .row2 .col3').trigger('click'); // O
	$('#board .row3 .col3').trigger('click'); // X

	ok( ttt.checkWin(), 'X Won' );
});

test( "vertical O win", function() {
	ttt.resetBoard();
	
	$('#board .row1 .col1').trigger('click'); // X
	$('#board .row1 .col3').trigger('click'); // O
	$('#board .row2 .col2').trigger('click'); // X
	$('#board .row3 .col3').trigger('click'); // O
	$('#board .row3 .col1').trigger('click'); // X
	$('#board .row2 .col3').trigger('click'); // O
	
	ok( ttt.checkWin(), 'O Won' );
});


test( "Draw", function() {
	ttt.resetBoard();
	
	$('#board .row1 .col1').trigger('click'); // X
	$('#board .row1 .col2').trigger('click'); // O
	$('#board .row1 .col3').trigger('click'); // X
	$('#board .row2 .col1').trigger('click'); // O
	$('#board .row2 .col2').trigger('click'); // X
	$('#board .row3 .col1').trigger('click'); // O
	$('#board .row2 .col3').trigger('click'); // X
	$('#board .row3 .col3').trigger('click'); // O
	$('#board .row3 .col2').trigger('click'); // X
	
	ok( !ttt.checkWin(), 'No one wins' );
});
