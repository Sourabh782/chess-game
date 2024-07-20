import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chessBoard';
import { CheckState, Color, Coords, FENChar, lastMove, peiceImagePath, SafeSquares } from '../../chess-logic/models';
import { CommonModule, NgFor } from '@angular/common';
import { SelectedSquare } from './models';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css'
})
export class ChessBoardComponent {
  public peiceImagePaths = peiceImagePath

  private chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.chessBoardView;

  private selectedSquare: SelectedSquare = {peice: null}
  private peiceSafeSquares: Coords[] = []
  private lastMove: lastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkState;

  public get playerColor(): Color {
    return this.chessBoard.playerColor
  }
  public get safeSquares(): SafeSquares{
    return this.chessBoard.safeSquares
  }

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y)
  }

  public isSquareLastMove(x: number, y: number): boolean{
    if(!this.lastMove){
      return false;
    }

    const {prevX, prevY, currX, currY} = this.lastMove;
    
    return (x === prevX && y === prevY) || (x === currX && y === currY)
  }

  public isSquareChecked(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  public isSquareSelected(x: number, y: number): boolean{
    if(!this.selectedSquare.peice) return false;

    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  public selectingPeice(x: number, y: number): void{
    const peice: FENChar | null = this.chessBoardView[x][y]

    if(!peice){
      return;
    }
    if(this.isWrongPeiceSelected(peice)){
      return;
    }

    const isSameSquareClicked: boolean = !!this.selectedSquare.peice && this.selectedSquare.x === x && this.selectedSquare.y === y
    this.unMarkingPreviouslySelectedAndSafeSquare();
    if(isSameSquareClicked) return

    this.selectedSquare = {peice, x, y};
    this.peiceSafeSquares = this.safeSquares.get(x+","+y) || [];
  }

  public isSquareSafeForSelectedPeice(x: number, y: number): boolean{
    return this.peiceSafeSquares.some(coords => coords.x === x && coords.y === y)
  }

  private isWrongPeiceSelected(peice: FENChar): boolean {
    const isWhitePeiceSelected: boolean = peice ===peice.toUpperCase();

    return isWhitePeiceSelected && this.playerColor === Color.Black || !isWhitePeiceSelected && this.playerColor === Color.White
  }

  private unMarkingPreviouslySelectedAndSafeSquare():void{
    this.selectedSquare = {peice: null};
    this.peiceSafeSquares = []
  }

  private placingPiece(newX: number, newY: number): void {
    if(!this.selectedSquare.peice){
      return;
    }

    if(!this.isSquareSafeForSelectedPeice(newX, newY)){
      return
    }

    const {x: prevX, y: prevY} = this.selectedSquare;
    this.chessBoard.move(prevX, prevY, newX, newY)
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.checkState = this.chessBoard.checkState;
    this.lastMove = this.chessBoard.lastMove


    this.unMarkingPreviouslySelectedAndSafeSquare()
  }

  public move(x: number, y: number){
    this.selectingPeice(x, y);
    this.placingPiece(x, y);
  }
}
