import { Component } from '@angular/core';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { CommonModule, NgFor } from '@angular/common';
import { ChessBoard } from '../../chess-logic/chessBoard';
import { CheckState, Color, Coords, FENChar, lastMove, peiceImagePath, SafeSquares } from '../../chess-logic/models';

@Component({
  selector: 'app-computer-mode',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrl: '../chess-board/chess-board.component.css'
})
export class ComputerModeComponent extends ChessBoardComponent {

}
