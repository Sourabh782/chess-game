import { CheckState, Color, Coords, FENChar, lastMove, SafeSquares } from "./models";
import { Bishop } from "./peices/bishop";
import { King } from "./peices/king";
import { Knight } from "./peices/knight";
import { Pawn } from "./peices/pawn";
import { Peice } from "./peices/peice";
import { Queen } from "./peices/queen";
import { Rook } from "./peices/rook";

export class ChessBoard{
    private chessBoard: (Peice | null)[][];
    private _playerColor = Color.White;
    private readonly chessBoardSize: number = 8;
    private _safeSquares: SafeSquares;
    private _lastMove: lastMove | undefined;
    private _checkedState: CheckState = { isInCheck: false }
    private _isGameOver: boolean = false;
    private _gameOverMessage: string | undefined = undefined
    private fiftyMoveRuleCounter: number = 0;

    constructor(){
        this.chessBoard = [
            [
                new Rook(Color.White), new Knight(Color.White), new Bishop(Color.White), new Queen(Color.White),
                new King(Color.White), new Bishop(Color.White), new Knight(Color.White), new Rook(Color.White)
            ],
            [
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White),
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White),
            ],
            [
                null, null, null, null, null, null, null, null
            ],
            [
                null, null, null, null, null, null, null, null
            ],
            [
                null, null, null, null, null, null, null, null
            ],
            [
                null, null, null, null, null, null, null, null
            ],
            [
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black),
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black),
            ],
            [
                new Rook(Color.Black), new Knight(Color.Black), new Bishop(Color.Black), new Queen(Color.Black),
                new King(Color.Black), new Bishop(Color.Black), new Knight(Color.Black), new Rook(Color.Black)
            ],
        ]
        this._safeSquares = this.findSafeSquares()
    }

    public get playerColor(): Color{
        return this._playerColor
    }

    public get gameOverMessage(): string|undefined{
        return this._gameOverMessage
    }

    public get isGameOver(): boolean {
        return this._isGameOver;
    }

    public get chessBoardView(): (FENChar | null)[][]{
        return this.chessBoard.map(row => {
            return row.map(peice => peice instanceof Peice ? peice.FENChar : null)
        })
    }

    public get safeSquares(): SafeSquares {
        return this._safeSquares
    }

    public static isSquareDark(x: number, y: number): boolean{
        return x%2 === 0 && y % 2 === 0 || x%2 === 1 && y%2 === 1;
    }

    private areCoordsValid(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.chessBoardSize && y < this.chessBoardSize;
    }

    public get checkState(): CheckState{
        return this._checkedState
    }

    public isInCheck(playerColor: Color, checkingCurrentPosition: boolean): boolean{

        for(let x = 0; x<this.chessBoardSize; x++){
            for(let y=0; y<this.chessBoardSize; y++){
                const peice: Peice | null = this.chessBoard[x][y]

                if(!peice || peice.color === playerColor){
                    continue;
                }

                for(const {x: dx, y: dy} of peice.directions){
                    let newX: number = x + dx;
                    let newY:number = y + dy;

                    if(!this.areCoordsValid(newX, newY)){
                        continue;
                    }

                    if(peice instanceof Pawn || peice instanceof Knight || peice instanceof King){
                        if(peice instanceof Pawn && dy === 0) continue;

                        const attackedPeice: Peice | null = this.chessBoard[newX][newY]

                        if(attackedPeice instanceof King && attackedPeice.color === playerColor){
                            if(checkingCurrentPosition) this._checkedState = {isInCheck: true, x: newX, y: newY};
                            return true;
                        }
                    } else {
                        while(this.areCoordsValid(newX, newY)){
                            const attackedPeice: Peice | null = this.chessBoard[newX][newY]

                            if(attackedPeice instanceof King && attackedPeice.color === playerColor){
                                if(checkingCurrentPosition) this._checkedState = {isInCheck: true, x: newX, y: newY};
                                return true;
                            }
                            if(attackedPeice !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }
            }
        }

        if(checkingCurrentPosition) this._checkedState = {isInCheck: false}

        return false;
    }

    private isPositionSafeAfterMove(prevX: number, prevY: number, newX: number, newY: number): boolean{
        const peice: Peice|null = this.chessBoard[prevX][prevY];
        const newPeice: Peice | null = this.chessBoard[newX][newY];

        if(!peice){
            return false;
        }

        if(newPeice && newPeice.color === peice.color){
            return false;
        }

        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = peice;

        const isPositionSafe: boolean = !this.isInCheck(peice.color, false);

        this.chessBoard[prevX][prevY] = peice;
        this.chessBoard[newX][newY] = newPeice

        return isPositionSafe;
    }

    private findSafeSquares(): SafeSquares{
        const safeSquares: SafeSquares = new Map<string, Coords[]>();

        for(let x = 0; x<this.chessBoardSize; x++){
            for(let y=0; y<this.chessBoardSize; y++){
                const peice: Peice | null = this.chessBoard[x][y];
                if(!peice || peice.color !== this._playerColor){
                    continue;
                }

                const peiceSafeSquares: Coords[] = [];

                for(const {x: dx, y: dy} of peice.directions){
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if(!this.areCoordsValid(newX, newY)){
                        continue;
                    }

                    let newPeice: Peice|null = this.chessBoard[newX][newY]

                    if(newPeice && newPeice.color === peice.color){
                        continue;
                    }
                    // restrict pawn movement
                    if (peice instanceof Pawn) {
                        // cant move pawn two squares straight if there is Peice infront of him
                        if (dx === 2 || dx === -2) {
                            if (newPeice) continue;
                            if (this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
                        }

                        // cant move pawn one square straight if Peice is infront of him
                        if ((dx === 1 || dx === -1) && dy === 0 && newPeice) continue;

                        // cant move pawn diagonally if there is no Peice, or Peice has same color as pawn
                        if ((dy === 1 || dy === -1) && (!newPeice || peice.color === newPeice.color)) continue;
                    }

                    if(peice instanceof Pawn || peice instanceof Knight || peice instanceof King){
                        if(this.isPositionSafeAfterMove(x, y, newX, newY)){
                            peiceSafeSquares.push({x: newX, y: newY})
                        }
                    }
                    else{
                        while(this.areCoordsValid(newX, newY)){
                            newPeice = this.chessBoard[newX][newY]
                            if(newPeice && newPeice.color === peice.color){
                                break;
                            }
                            if(this.isPositionSafeAfterMove(x, y, newX, newY)){
                                peiceSafeSquares.push({x: newX, y: newY})
                            }
                            if(newPeice !== null){
                                break;
                            }

                            newX += dx;
                            newY += dy;

                        }
                    }
                }

                if(peice instanceof King){
                    if(this.canCastle(peice, true)){
                        peiceSafeSquares.push({x, y: 6})
                    }
                    if(this.canCastle(peice, false)){
                        peiceSafeSquares.push({x, y: 2});
                    }
                }
                else if(peice instanceof Pawn && this.canCaptureEnPassant(peice, x, y)){
                    peiceSafeSquares.push({ x: x + (peice.color === Color.White ? 1 : -1), y: this._lastMove!.prevY });
                }

                if(peiceSafeSquares.length){
                    safeSquares.set(x + "," + y, peiceSafeSquares)
                }
            }
        }

        return safeSquares
    }

    public get lastMove(): lastMove | undefined{
        return this._lastMove
    }

    public move(prevX: number, prevY: number, newX: number, newY: number, promotedPeiceType: FENChar | null): void{
        if(this._isGameOver){
            throw new Error("Game is over");
        }
        if(!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(newX, newY)){
            return;
        }

        const peice: Peice | null = this.chessBoard[prevX][prevY];

        if(!peice || peice.color !== this._playerColor) return;

        const peiceSafeSquares: Coords[] | undefined = this._safeSquares.get(prevX + "," + prevY);

        if(!peiceSafeSquares || !peiceSafeSquares.find(coords => coords.x === newX && coords.y === newY)){
            throw new Error("square is not safe")
        }

        if((peice instanceof Pawn || peice instanceof Rook || peice instanceof King) && !peice.hasMoved){
            peice.hasMoved = true;
        }

        const isPeiceTaken: boolean = this.chessBoard[newX][newY] !== null;
        if(peice instanceof Pawn || isPeiceTaken) this.fiftyMoveRuleCounter = 0;
        else this.fiftyMoveRuleCounter += 0.5;

        this.handleSpecialMoves(peice, prevX, prevY, newX, newY);

        if(promotedPeiceType){
            this.chessBoard[newX][newY] = this.promotePeice(promotedPeiceType);
        } else {
            this.chessBoard[newX][newY] = peice
        }

        this.chessBoard[prevX][prevY] = null;

        this._lastMove = {peice, prevX, prevY, currX: newX, currY: newY}
        this._playerColor = this._playerColor === Color.White ? Color.Black : Color.White;
        this.isInCheck(this._playerColor, true);
        this._safeSquares = this.findSafeSquares()

        this._isGameOver = this.isGameFinished()
    }

    private canCastle(king: King, kingSideCastle: boolean): boolean{
        if(king.hasMoved) return false;

        const kingPositionX: number = king.color === Color.White ? 0 : 7;
        const kingPositionY: number = 4;
        const rookPositionX: number = kingPositionX;
        const rookPositionY: number = kingSideCastle ? 7 : 0;
        const rook: Peice | null = this.chessBoard[rookPositionX][rookPositionY]

        if(!(rook instanceof Rook) || rook.hasMoved || this._checkedState.isInCheck){
            return false;
        }

        const firstNextKingPositionY: number = kingPositionY + (kingSideCastle ? 1 : -1);
        const secondNextKingPositionY: number = kingPositionY + (kingSideCastle ? 2 : -2);

        if(this.chessBoard[kingPositionX][firstNextKingPositionY] || this.chessBoard[kingPositionX][secondNextKingPositionY]) return false;

        if (!kingSideCastle && this.chessBoard[kingPositionX][1]) return false;

        return this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, firstNextKingPositionY) &&
            this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, secondNextKingPositionY);
    }

    private handleSpecialMoves(peice: Peice, prevX: number, prevY: number, newX: number, newY: number): void{
        if(peice instanceof King && Math.abs(newY - prevY) === 2){ // castling
            // newY > prevY -> king side castle else queen side castle
            const rookPositionX: number = prevX;
            const rookPositionY: number = newY > prevY ? 7 : 0;

            const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
            const rookNewPositionY: number = newY > prevY ? 5 : 3;

            this.chessBoard[rookPositionX][rookPositionY] = null;
            this.chessBoard[rookPositionX][rookNewPositionY] = rook;
            rook.hasMoved = true;
        }
        else if(
            peice instanceof Pawn &&
            this._lastMove &&
            this._lastMove.peice instanceof Pawn &&
            Math.abs(this._lastMove.currX - this._lastMove.prevX) == 2 &&
            prevX === this._lastMove.currX &&
            newY === this._lastMove.currY
        ) {
            this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null
        }
    }

    private canCaptureEnPassant(pawn: Pawn, pawnX: number, pawnY: number): boolean{
        if (!this._lastMove) return false;
        const { peice, prevX, prevY, currX, currY } = this._lastMove;

        if (
            !(peice instanceof Pawn) ||
            pawn.color !== this._playerColor ||
            Math.abs(currX - prevX) !== 2 ||
            pawnX !== currX ||
            Math.abs(pawnY - currY) !== 1
        ) return false;

        const pawnNewPositionX: number = pawnX + (pawn.color === Color.White ? 1 : -1);
        const pawnNewPositionY: number = currY;

        this.chessBoard[currX][currY] = null;
        const isPositionSafe: boolean = this.isPositionSafeAfterMove(pawnX, pawnY, pawnNewPositionX, pawnNewPositionY);
        this.chessBoard[currX][currY] = peice;

        return isPositionSafe;
    }

    private promotePeice(promotedPeiceType: FENChar): Knight | Bishop | Rook | Queen{
        if(promotedPeiceType === FENChar.WhiteKnight || promotedPeiceType === FENChar.BlackKnight){
            return new Knight(this.playerColor);
        }
        else if(promotedPeiceType === FENChar.WhiteQueen || promotedPeiceType === FENChar.BlackQueen){
            return new Queen(this.playerColor);
        }
        else if(promotedPeiceType === FENChar.WhiteRook || promotedPeiceType === FENChar.BlackRook){
            return new Rook(this.playerColor);
        }
        else {
            return new Bishop(this.playerColor);
        }
    }

    public isGameFinished(): boolean {
        if(this.insufficientMaterial()){
            this._gameOverMessage = "Draw due to insufficient material"
            return true;
        }
        if(!this._safeSquares.size){
            if(this._checkedState.isInCheck){
                const prevPlayer: string = this._playerColor === Color.White ? "Black" : "White";
                this._gameOverMessage = prevPlayer + " Won by chackmate";
            } else {
                this._gameOverMessage = "Stalemate"
            }

            return true;
        }
        if(this.fiftyMoveRuleCounter == 50){
            this._gameOverMessage = "Draw due to fifty move rule";
            return true;
        }

        return false;
    }

    private playerHasOnlyTwoKnightsAndKing(peices: { peice: Peice, x: number, y: number }[]): boolean {
        return peices.filter(peice => peice.peice instanceof Knight).length === 2;
    }

    private playerHasOnlyBishopsWithSameColorAndKing(peices: { peice: Peice, x: number, y: number }[]): boolean {
        const bishops = peices.filter(peice => peice.peice instanceof Bishop);
        const areAllBishopsOfSameColor = new Set(bishops.map(bishop => ChessBoard.isSquareDark(bishop.x, bishop.y))).size === 1;
        return bishops.length === peices.length - 1 && areAllBishopsOfSameColor;
    }

    private insufficientMaterial(): boolean {
        const whitepeices: { peice: Peice, x: number, y: number }[] = [];
        const blackpeices: { peice: Peice, x: number, y: number }[] = [];

        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const peice: Peice | null = this.chessBoard[x][y];
                if (!peice) continue;

                if (peice.color === Color.White) whitepeices.push({ peice, x, y });
                else blackpeices.push({ peice, x, y });
            }
        }

        // King vs King
        if (whitepeices.length === 1 && blackpeices.length === 1)
            return true;

        // King and Minor peice vs King
        if (whitepeices.length === 1 && blackpeices.length === 2)
            return blackpeices.some(peice => peice.peice instanceof Knight || peice.peice instanceof Bishop);

        else if (whitepeices.length === 2 && blackpeices.length === 1)
            return whitepeices.some(peice => peice.peice instanceof Knight || peice.peice instanceof Bishop);

        // both sides have bishop of same color
        else if (whitepeices.length === 2 && blackpeices.length === 2) {
            const whiteBishop = whitepeices.find(peice => peice.peice instanceof Bishop);
            const blackBishop = blackpeices.find(peice => peice.peice instanceof Bishop);

            if (whiteBishop && blackBishop) {
                const areBishopsOfSameColor: boolean = ChessBoard.isSquareDark(whiteBishop.x, whiteBishop.y) && ChessBoard.isSquareDark(blackBishop.x, blackBishop.y) || !ChessBoard.isSquareDark(whiteBishop.x, whiteBishop.y) && !ChessBoard.isSquareDark(blackBishop.x, blackBishop.y);

                return areBishopsOfSameColor;
            }
        }

        if (whitepeices.length === 3 && blackpeices.length === 1 && this.playerHasOnlyTwoKnightsAndKing(whitepeices) ||
            whitepeices.length === 1 && blackpeices.length === 3 && this.playerHasOnlyTwoKnightsAndKing(blackpeices)
        ) return true;

        if (whitepeices.length >= 3 && blackpeices.length === 1 && this.playerHasOnlyBishopsWithSameColorAndKing(whitepeices) ||
            whitepeices.length === 1 && blackpeices.length >= 3 && this.playerHasOnlyBishopsWithSameColorAndKing(blackpeices)
        ) return true;

        return false;
    }
}