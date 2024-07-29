import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { CommonModule, NgFor } from '@angular/common';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-computer-mode',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrl: '../chess-board/chess-board.component.css',
  providers: [HttpClient, StockfishService, ChessBoardService]
})

export class ComputerModeComponent extends ChessBoardComponent implements OnInit, OnDestroy {
  private subscription$ = new Subscription()

    constructor(private stockfishService: StockfishService){
      super(inject(ChessBoardService));
    }

  public ngOnInit(): void {
    
      const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
        next: async (FEN: string)=> {
          const player: string = FEN.split(" ")[1]

          if(player === 'w') return // computer always black

          const {prevX, prevY, newX, newY, promotedPeice} = await firstValueFrom(this.stockfishService.getBestMove(FEN));

          this.updateBoard(prevX, prevY, newX, newY, promotedPeice)
        }
      })

      this.subscription$.add(chessBoardStateSubscription$)
  }

  public ngOnDestroy(): void {
      this.subscription$.unsubscribe()
  }
}
