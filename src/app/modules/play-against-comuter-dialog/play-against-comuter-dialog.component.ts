import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Color, FENChar, peiceImagePath } from '../../chess-logic/models';
import { StockfishService } from '../computer-mode/stockfish.service';
import { Router } from '@angular/router';
import { stockfishLevel } from '../computer-mode/models';

@Component({
  selector: 'app-play-against-comuter-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './play-against-comuter-dialog.component.html',
  styleUrl: './play-against-comuter-dialog.component.css'
})
export class PlayAgainstComuterDialogComponent {
  public stockfishLevels: readonly number[] = [1,2,3,4,5];
  public stockfishLevel: number = 1;

  public peiceImagePath = peiceImagePath
  public whiteKing: FENChar = FENChar.WhiteKing
  public blackKing: FENChar = FENChar.BlackKing

  constructor(private stockfishService: StockfishService, 
    private dialog: MatDialog,
    private router: Router
  ){}
  
  public selectStockfishLevel(level: number): void{
    this.stockfishLevel = level;
  }

  public play(color: number): void{
    console.log("play" + color)
    this.dialog.closeAll();
    this.stockfishService.computerConfiguration$.next({
      color: color === 1 ? Color.Black : Color.White,
      level: stockfishLevel[this.stockfishLevel]
    })
    console.log(this.stockfishService.computerConfiguration$.value)
    
    this.router.navigate(["against-computer"])
  }

  public closeDialog(): void{
    this.router.navigate(["against-friend"])
  }
}
