import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChessMove, StockfishQueryParams, StockfishResponse } from './models';
import { Observable, of, pipe, switchMap } from 'rxjs';
import { FENChar } from '../../chess-logic/models';

@Injectable({
  providedIn: 'root'
})
export class StockfishService {
  private readonly api: string = "https://stockfish.online/api/s/v2.php"

  constructor(private http: HttpClient) { }

  private convertColumnToYCoord(s: string): number {
    return s.charCodeAt(0) - "a".charCodeAt(0);
  }

  private promotedPeice(peice: string | undefined): FENChar|null{
    if(!peice) return null;

    if(peice === 'n') return FENChar.BlackKing;
    if(peice === 'r') return FENChar.BlackRook;
    if(peice === 'b') return FENChar.BlackBishop
    return FENChar.BlackQueen;
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
    const queryParams: StockfishQueryParams = {
      fen,
      depth: 13,
      mode: "bestmove"
    }

    let params = new HttpParams().appendAll(queryParams)

    return this.http.get<StockfishResponse>(this.api, {params}).pipe(switchMap(response => {
      const bestMove = response.data.split(" ")[1];
      return of(this.moveFromStockfishString(bestMove))
    }))
  }
}
