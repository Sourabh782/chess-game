import { Color, Coords, FENChar, SafeSquares } from "./models";
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

    public inInCheck(playerColor: Color): boolean{

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
                            return true;
                        }
                    } else {
                        while(this.areCoordsValid(newX, newY)){
                            const attackedPeice: Peice | null = this.chessBoard[newX][newY]

                            if(attackedPeice instanceof King && attackedPeice.color === playerColor){
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

        return false;
    }

    private isPositionSafeAfterMove(peice: Peice, prevX: number, prevY: number, newX: number, newY: number): boolean{
        const newPeice: Peice | null = this.chessBoard[newX][newY];

        if(newPeice && newPeice.color === peice.color){
            return false;
        }

        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = peice;

        const isPositionSafe: boolean = !this.inInCheck(peice.color);

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
                    if(peice instanceof Pawn){
                        if(dx === 2 || dx === -2){
                            if(newPeice) continue;

                            if(this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue
                        }

                        if((dx === 1 || dx === -1) && dy === 0 && newPeice) continue;

                        if((dy === -1 || dy === 1) && (!newPeice || peice.color === newPeice.color)) continue;
                    }
                    if(peice instanceof Pawn || peice instanceof Knight || peice instanceof King){
                        if(this.isPositionSafeAfterMove(peice, x, y, newX, newY)){
                            peiceSafeSquares.push({x: newX, y: newY})
                        }
                    }
                    else{
                        while(this.areCoordsValid(newX, newY)){
                            newPeice = this.chessBoard[newX][newY]
                            if(newPeice && newPeice.color === peice.color){
                                break;
                            }
                            if(this.isPositionSafeAfterMove(peice, x, y, newX, newY)){
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

                if(peiceSafeSquares.length){
                    safeSquares.set(x + "," + y, peiceSafeSquares)
                }
            }
        }

        return safeSquares
    }

    public move(prevX: number, prevY: number, newX: number, newY: number): void{
        if(!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(newX, newY)){
            return;
        }
        
    }
}