import { FENChar, Coords, Color } from "../models";
import { Peice } from "./peice";

export class Bishop extends Peice{
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        {x:1, y:1},
        {x:1, y:-1},
        {x:-1, y:1},
        {x:-1, y: -1}
    ];

    constructor(private peiceColor: Color){
        super(peiceColor);
        this._FENChar = peiceColor === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop
    }
    
}