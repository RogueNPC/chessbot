var board1 = null
var game = new Chess()


/* Move evaluation for the bot */

// Piece-Square Tables (a rating for where a piece should want to be at where positive is good and negative is bad)
var whitePawn =
    [
        [85, 85, 85, 85, 85, 85, 85, 85],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [ 5,  5, 10, 25, 25, 10,  5,  5],
        [ 0,  0,  0, 20, 20,  0,  0,  0],
        [ 5,  5,-10,  0,  0,-10,  5,  5],
        [ 5, 10, 10,-20,-20, 10, 10,  5],
        [ 0,  0,  0,  0,  0,  0,  0,  0]
    ]
var whiteKnight =
    [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ]
var whiteBishop =
    [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10, 15,  0,  0,  0,  0, 15,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ]
var whiteRook =
    [
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        [ 5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [ 0,  0,  0,  5,  5,  0,  0,  0]
    ]
var whiteQueen =
    [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5 ,  0,  5,  5,  5,  5,  0, -5],
        [ 0 ,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ]
var whiteKing =
    [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [ 20, 20,  0,  0,  0,  0, 20, 20],
        [ 20, 30, 10,  0,  0, 10, 30, 20]
    ]

// var whiteKingEndgame =
//     [
//         [-50,-40,-30,-20,-20,-30,-40,-50],
//         [-30,-20,-10,  0,  0,-10,-20,-30],
//         [-30,-10, 20, 30, 30, 20,-10,-30],
//         [-30,-10, 30, 40, 40, 30,-10,-30],
//         [-30,-10, 30, 40, 40, 30,-10,-30],
//         [-30,-10, 20, 30, 30, 20,-10,-30],
//         [-30,-30,  0,  0,  0,  0,-30,-30],
//         [-50,-30,-30,-30,-30,-30,-30,-50]
//     ]

// Black Piece-Square Tables are mirrored versions of the White PSTs
var blackPawn = whitePawn.slice().reverse()
var blackKnight = whiteKnight.slice().reverse()
var blackBishop = whiteBishop.slice().reverse()
var blackRook = whiteRook.slice().reverse()
var blackQueen = whiteQueen.slice().reverse()
var blackKing = whiteKing.slice().reverse()
// var blackKingEndgame = whiteKingEndgame.slice().reverse()


// gets the value of the piece on its current square using the piece-square tables above
function getPieceValue(piece, x, y){
    // no piece on the square
    if (piece === null) {
        return 0;
    }

    // Setting weights for each piece
    // weights = {p: 100, n: 300, b: 330, r: 500, q: 900, k: 20000}
    function getColorValue(piece, x, y){
        if (piece.type === 'p') {
            return 100 + (piece.color === 'w' ? whitePawn[y][x] : blackPawn[y][x]);
        } else if (piece.type === 'n') {
            return 300 + (piece.color === 'w' ? whiteKnight[y][x] : blackKnight[y][x]);
        } else if (piece.type === 'b') {
            return 330 + (piece.color === 'w' ? whiteBishop[y][x] : blackBishop[y][x]);
        } else if (piece.type === 'r') {
            return 500 + (piece.color === 'w' ? whiteRook[y][x] : blackRook[y][x]);
        } else if (piece.type === 'q') {
            return 900 + (piece.color === 'w' ? whiteQueen[y][x] : blackQueen[y][x]);
        } else if (piece.type === 'k') {
            return 20000 + (piece.color === 'w' ? whiteKing[y][x] : blackKing[y][x]);
        }
    }
    var colorValue = getColorValue(piece, x, y)
    // positive value for white, negative value for black
    return piece.color === 'w' ? colorValue : -colorValue;
}

// evaluates the pieces on the board by looking at every sqare of the board
function evaluateBoard(board){
    var totalEval = 0;
    for (var i = 0; i < 8; i++){
        for (var j = 0; j < 8; j++){
            totalEval = totalEval + getPieceValue(board[i][j], i, j);
        }
    }
    return totalEval;
}

// generates move for bot to play
function minimaxBase(depth, game, isMaximisingPlayer){

    var possibleMoves = game.moves();
    var bestMove = Number.NEGATIVE_INFINITY;
    var bestMoveMade;

    for (var i = 0; i < possibleMoves.length; i++){
        var possibleMove = possibleMoves[i];
        game.move(possibleMove);

        // Looks at all the moves if it made possibleMove (looks ahead one more move)
        var value = minimaxRecursive(depth - 1, game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, !isMaximisingPlayer);
        game.undo();

        // Finds move that increases bot's evaluation of the board (a.k.a chances of winning)
        if (value >= bestMove) {
            bestMove = value;
            bestMoveMade = possibleMove
        }
    }
    return bestMoveMade
}

// alpha-beta pruning generates move tree for bot to evaluate moves
function minimaxRecursive(depth, game, alpha, beta, isMaximisingPlayer){
    
    // game evaluation after making a line of moves
    if (depth === 0) {
        return -evaluateBoard(game.board())
    }

    // gets all moves available
    var possibleMoves = game.moves();

    // minimax search algorithm with alpha-beta pruning implementation
    // isMaximisingPlayer toggles on and off to generate moves that it believes both the bot and the user will make in sequential order
    if (isMaximisingPlayer) {
        var bestMove = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < possibleMoves.length; i++) {
            game.move(possibleMoves[i]);
            bestMove = Math.max(bestMove, minimaxRecursive(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
    else {
        var bestMove = Number.POSITIVE_INFINITY;
        for (var i = 0; i < possibleMoves.length; i++) {
            game.move(possibleMoves[i]);
            bestMove = Math.min(bestMove, minimaxRecursive(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
}


/* chessbot turn taking */

function getBestMove(game){
    // TODO: make specific status indicators for when the game ends (e.g. checkmate, stalemate, etc.)
    if (game.game_over()) {
        alert('Game over');
    }

    // defaulting depth to 3
    // TODO: make depth change able
    var depth = 3;
    var bestMove = minimaxBase(depth, game, true)

    return bestMove
}

function makeBestMove(){
    var bestMove = getBestMove(game);
    game.move(bestMove);
    board1.position(game.fen());
    if (game.game_over()) {
        alert('Game over')
    }
}

// function makeRandomMove () {
//     var possibleMoves = game.moves()
  
//     // game over
//     if (possibleMoves.length === 0) return
  
//     var randomIdx = Math.floor(Math.random() * possibleMoves.length)
//     game.move(possibleMoves[randomIdx])
//     board1.position(game.fen())
//   }


/* board and move visualization using chessboardjs */

var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares () {
    $('#board1 .square-55d63').css('background', '')
}

function greySquare (square) {
    var $square = $('#board1 .square-' + square)
  
    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey
    }
  
    $square.css('background', background)
}
  

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false
  
    // only pick up pieces for White
    if (piece.search(/^b/) !== -1) return false
}

function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    removeGreySquares()
    // illegal move
    if (move === null) return 'snapback'

    window.setTimeout(makeBestMove, 250);
    // window.setTimeout(makeRandomMove, 250);
}

function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    })
  
    // exit if there are no moves available for this square
    if (moves.length === 0) return
  
    // highlight the square they moused over
    greySquare(square)
  
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
}
  
function onMouseoutSquare (square, piece) {
    removeGreySquares()
}
  
// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board1.position(game.fen())
}

// Config Properties from chessboardjs
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};

var board1 = Chessboard('board1', config)