import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChessMove, ComputerConfiguration, StockfishQueryParams, StockfishResponse } from './models';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Color, FENChar } from '../../chess-logic/models';

@Injectable({
  providedIn: 'root'
})

export class StockfishService {
  private readonly api: string = "https://stockfish.online/api/s/v2.php"
  
  public computerConfiguration$ = new BehaviorSubject<ComputerConfiguration>({
    color: Color.Black,
    level: 1
  })
  constructor(private http: HttpClient) {
    console.log("hi");
   }

  private convertColumnToYCoord(s: string): number {
    return s.charCodeAt(0) - "a".charCodeAt(0);
  }

  private promotedPeice(peice: string | undefined): FENChar|null{
    if(!peice) return null;

    const computerColor = this.computerConfiguration$.value.color

    if(peice === 'n') return computerColor === Color.White ? FENChar.WhiteKing : FENChar.BlackKing;
    if(peice === 'r') return computerColor === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
    if(peice === 'b') return computerColor === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop
    return computerColor === Color.White ? FENChar.WhiteQueen : FENChar.BlackQueen;
  }

  private moveFromStockfishString(move: string):ChessMove{
    const prevY: number = this.convertColumnToYCoord(move[0]);
    const prevX: number = Number(move[1])-1;
    const newY: number = this.convertColumnToYCoord(move[2]);
    const newX: number = Number(move[3])-1
    const promotedPeice = this.promotedPeice(move[4]);

    return {prevX, prevY, newX, newY, promotedPeice}

  }

  public getBestMove(fen: string): Observable<ChessMove>{
    console.log("hello")
    const queryParams: StockfishQueryParams = {
      fen,
      depth: this.computerConfiguration$.value.level
    }

    let params = new HttpParams().appendAll(queryParams)

    return this.http.get<StockfishResponse>(this.api, {params}).pipe(switchMap(response => {
      const bestMove = response.bestmove.split(" ")[1];
      return of(this.moveFromStockfishString(bestMove))
    }))
  }
}
