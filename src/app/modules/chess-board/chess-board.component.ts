import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chessBoard';
import { CheckState, Color, Coords, FENChar, GameHistory, lastMove, MoveList, peiceImagePath, SafeSquares } from '../../chess-logic/models';
import { CommonModule, NgFor } from '@angular/common';
import { SelectedSquare } from './models';
import { ChessBoardService } from './chess-board.service';
import { MoveListComponent } from "../move-list/move-list.component";

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [NgFor, CommonModule, MoveListComponent, MoveListComponent],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css'
})
export class ChessBoardComponent {
  constructor(protected chessBoardService: ChessBoardService) { }

  public peiceImagePaths = peiceImagePath

  protected chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.chessBoardView;

  private selectedSquare: SelectedSquare = {peice: null}
  private peiceSafeSquares: Coords[] = []
  private lastMove: lastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkState;

  // pawn promotion
  public isPromotionActive: boolean = false;
  public flipMode: boolean = false;
  private promotionCoords: Coords|null = null;
  private promotedPeice: FENChar|null = null;

  public flipBoard(): void{
    this.flipMode = !this.flipMode
  }

  public get moveList(): MoveList {
    return this.chessBoard.moveList
  }

  public get gameHistory(): GameHistory {
    return this.chessBoard.gameHistory
  }

  public gameHistoryPointer: number = 0;

  public promotionPeices(): FENChar[]{
    return this.playerColor === Color.White ? [FENChar.WhiteBishop, FENChar.WhiteKnight, FENChar.WhiteQueen, FENChar.WhiteRook] :
    [FENChar.BlackBishop, FENChar.BlackKnight, FENChar.BlackQueen, FENChar.BlackRook]
  }

  public get playerColor(): Color {
    return this.chessBoard.playerColor
  }

  public get gameOverMessage(): string | undefined {
    return this.chessBoard.gameOverMessage;
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
    if(this.gameOverMessage !== undefined){
      return;
    }
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

    if(this.isPromotionActive){
      this.isPromotionActive = false;
      this.promotedPeice = null;
      this.promotionCoords = null
    }
  }

  private placingPiece(newX: number, newY: number): void {
    if(!this.selectedSquare.peice){
      return;
    }

    if(!this.isSquareSafeForSelectedPeice(newX, newY)){
      return
    }

    // pawn promotion
    const isPawnSelected: boolean = this.selectedSquare.peice === FENChar.WhitePawn || this.selectedSquare.peice === FENChar.BlackPawn
    const isPawnOnLastRank: boolean = isPawnSelected && (newX === 7 || newX === 0);
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnLastRank;

    if(shouldOpenPromotionDialog){
      this.peiceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = {x: newX, y: newY};
      return;
    }

    const {x: prevX, y: prevY} = this.selectedSquare;
    
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPeice);
  }

  public isSquarePromotionSquare(x: number, y: number): boolean{
    if(!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }

  protected updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): void{
    this.chessBoard.move(prevX, prevY, newX, newY, this.promotedPeice)
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.checkState = this.chessBoard.checkState;
    this.lastMove = this.chessBoard.lastMove

    this.unMarkingPreviouslySelectedAndSafeSquare()
    this.gameHistoryPointer++;
  }

  public move(x: number, y: number){
    this.selectingPeice(x, y);
    this.placingPiece(x, y);
  }

  public promotePeice(peice: FENChar): void{
    if(!this.promotionCoords || !this.selectedSquare.peice) return;

    this.promotedPeice = peice;
    const {x: newX, y: newY} = this.promotionCoords
    const {x: prevX, y: prevY} = this.selectedSquare

    this.updateBoard(prevX, prevY, newX, newY, this.promotedPeice);
  }

  public closeDialog(): void{
    this.unMarkingPreviouslySelectedAndSafeSquare()
  }

  public showPreviousPosition(moveIndex: number): void {
    // console.log(moveIndex)
    const {checkState, lastMove} = this.gameHistory[moveIndex];
    const boards = Object.values(this.gameHistory[moveIndex].board);
    // console.log(boards)
    this.chessBoardView = boards
    this.checkState = checkState;
    this.lastMove = lastMove
    this.gameHistoryPointer = moveIndex
  }
}
