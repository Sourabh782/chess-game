import { Routes } from '@angular/router';
import { ChessBoardComponent } from './modules/chess-board/chess-board.component';
import { ComputerModeComponent } from './modules/computer-mode/computer-mode.component';

export const routes: Routes = [
    {
        path: "against-friend", 
        component: ChessBoardComponent,
        title: "Play against Friend"
    },
    {
        path: "against-computer", 
        component: ComputerModeComponent,
        title: "Play against Computer"
    }
];
