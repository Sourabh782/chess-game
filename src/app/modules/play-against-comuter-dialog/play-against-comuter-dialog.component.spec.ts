import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAgainstComuterDialogComponent } from './play-against-comuter-dialog.component';

describe('PlayAgainstComuterDialogComponent', () => {
  let component: PlayAgainstComuterDialogComponent;
  let fixture: ComponentFixture<PlayAgainstComuterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayAgainstComuterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayAgainstComuterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
