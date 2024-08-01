import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { CommonModule, NgFor } from '@angular/common';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Color } from '../../chess-logic/models';
import { MoveListComponent } from '../move-list/move-list.component';

@Component({
  selector: 'app-computer-mode',
  standalone: true,
  imports: [CommonModule, NgFor, MoveListComponent],
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrl: '../chess-board/chess-board.component.css',
})

export class ComputerModeComponent extends ChessBoardComponent implements OnInit, OnDestroy {
  private computerSubscription$ = new Subscription()

    constructor(private stockfishService: StockfishService){
      super(inject(ChessBoardService));
    }

  public override ngOnInit(): void {
    super.ngOnInit()
    const computerConfigurationSubscription$: Subscription = this.stockfishService.computerConfiguration$.subscribe({
      next: (computerConfiguration) => {
        if (computerConfiguration.color === Color.White) this.flipBoard();
      }
    })
    
      const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
        next: async (FEN: string)=> {
          if(this.chessBoard.isGameOver){
            chessBoardStateSubscription$.unsubscribe();
            return;
          }
          const player: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black

          if(player !== this.stockfishService.computerConfiguration$.value.color) return 

          const {prevX, prevY, newX, newY, promotedPeice} = await firstValueFrom(this.stockfishService.getBestMove(FEN));

          this.updateBoard(prevX, prevY, newX, newY, promotedPeice)
        }
      })

      this.computerSubscription$.add(chessBoardStateSubscription$)
      this.computerSubscription$.add(computerConfigurationSubscription$)
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy()
    this.computerSubscription$.unsubscribe()
  }
}
