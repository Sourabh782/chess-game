import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from "@angular/material/toolbar" 
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { PlayAgainstComuterDialogComponent } from '../play-against-comuter-dialog/play-against-comuter-dialog.component';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, RouterOutlet, RouterModule, MatDialogModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {

  constructor(private router: Router, private dialog: MatDialog){
    
  }

  public playAgainstComputer(): void {
    this.dialog.open(PlayAgainstComuterDialogComponent)
  }
}
