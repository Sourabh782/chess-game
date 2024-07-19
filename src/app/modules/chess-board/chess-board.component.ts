import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chessBoard';
import { Color, Coords, FENChar, peiceImagePath, SafeSquares } from '../../chess-logic/models';
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
  public get playerColor(): Color {
    return this.chessBoard.playerColor
  }
  public get safeSquares(): SafeSquares{
    return this.chessBoard.safeSquares
  }

  private selectedSquare: SelectedSquare = {peice: null}
  private peiceSafeSquares: Coords[] = []

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y)
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
}
