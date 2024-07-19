import { FENChar, Coords, Color } from "../models";
import { Peice } from "./peice";

export class Knight extends Peice{
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        {x: 1, y:2},
        {x: 1, y:-2},
        {x: -1, y:2},
        {x: -1, y:-2},
        {x: 2, y:-1},
        {x: 2, y:1},
        {x: -2, y:-1},
        {x: -2, y:1},
    ];

    constructor(private peiceColor: Color){
        super(peiceColor);
        this._FENChar = peiceColor === Color.White ? FENChar.WhiteKnight : FENChar.BlackKnight
    }
}