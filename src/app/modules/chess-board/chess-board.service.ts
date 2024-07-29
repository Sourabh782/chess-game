import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FENConverter } from '../../chess-logic/FENConverter';

@Injectable({
  providedIn: 'root'
})

export class ChessBoardService {
  public chessBoardState$ = new BehaviorSubject<string>(FENConverter.initalPosition);
}