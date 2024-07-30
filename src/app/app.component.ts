import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessBoardComponent } from "./modules/chess-board/chess-board.component";
import { NavMenuComponent } from './modules/nav-menu/nav-menu.component';
import { PlayAgainstComuterDialogComponent } from './modules/play-against-comuter-dialog/play-against-comuter-dialog.component';
import { MoveListComponent } from './modules/move-list/move-list.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChessBoardComponent, NavMenuComponent, PlayAgainstComuterDialogComponent, MoveListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chess-game';
}
