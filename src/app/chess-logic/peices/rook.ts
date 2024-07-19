import { FENChar, Coords, Color } from "../models";
import { Peice } from "./peice";

export class Rook extends Peice{
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        {x:1, y:0},
        {x:-1, y:0},
        {x:0, y:1},
        {x:0, y:-1}
    ];

    constructor(private peiceColor: Color){
        super(peiceColor);
        this._FENChar = peiceColor === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
    }
    
    public get hasMoved(): boolean{
        return this._hasMoved
    }

    public set hasMoved(_){
        this._hasMoved = true;
    }
}