import { columns } from "../modules/chess-board/models";
import { Color, lastMove } from "./models";
import { King } from "./peices/king";
import { Pawn } from "./peices/pawn";
import { Peice } from "./peices/peice";
import { Rook } from "./peices/rook";

export class FENConverter{

    public static readonly initalPosition: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    public convertBoardToFEN(
        board: (Peice|null)[][],
        playerColor: Color,
        lastMove: lastMove | undefined,
        fiftyMoveRuleCounter: number,
        numberOfFullMove: number
    ): string{
        let FENString: string = "";

        for(let i=7; i>=0; i--){
            let FENRow: string = "";
            let consecutiveEmptySquareCounter: number = 0;

            for(const peice of board[i]){
                if(!peice){
                    consecutiveEmptySquareCounter++;
                    continue
                }

                if(consecutiveEmptySquareCounter !== 0){
                    FENRow += String(consecutiveEmptySquareCounter)
                }

                consecutiveEmptySquareCounter = 0;
                FENRow += peice.FENChar
            }

            if(consecutiveEmptySquareCounter !== 0){
                FENRow += String(consecutiveEmptySquareCounter)
            }

            FENString += (i === 0) ? FENRow : FENRow + "/"
        }

        const player: string = playerColor === Color.White ? "w" : "b"

        FENString += " " + player;
        FENString += " " + this.castlingAvailability(board);
        FENString += " " + this.enPassantPossiblity(lastMove, playerColor)
        FENString += " " + fiftyMoveRuleCounter*2
        FENString += " " + numberOfFullMove

        return FENString
    }

    private castlingAvailability(board: (Peice|null)[][]):string {
        const castilingPossiblities = (color: Color): string => {
            let  castlingAvailability: string = "";

            const kingPositionX: number = color === Color.White ? 0 : 7;
            const king: Peice|null = board[kingPositionX][4];

            if(king instanceof King && !king.hasMoved){
                const rookPositionX: number = kingPositionX;
                const kingPositionRook: Peice|null = board[kingPositionX][7];
                const queenSideRook: Peice|null = board[kingPositionX][0];

                if(kingPositionRook instanceof Rook && !kingPositionRook.hasMoved){
                    castlingAvailability += 'k';
                }
                if(queenSideRook instanceof Rook && !queenSideRook.hasMoved){
                    castlingAvailability += 'q';
                }

                if(color === Color.White){
                    castlingAvailability = castlingAvailability.toUpperCase()
                }
            }

            return castlingAvailability;
        }

        const castlingAvailability: string = castilingPossiblities(Color.White) + castilingPossiblities(Color.Black);

        return castlingAvailability !== "" ? castlingAvailability : "-"
    }

    private enPassantPossiblity(lastMove: lastMove|undefined, color: Color): string {
        if(!lastMove) return "-";

        const {peice, currX: newX, prevX, prevY} = lastMove

        if(peice instanceof Pawn && Math.abs(prevX - newX) === 2){
            const row: number = color === Color.White ? 6 : 3;
            return columns[prevY] + String(row);
        }

        return "-"
    }
}