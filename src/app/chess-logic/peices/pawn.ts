import { FENChar, Coords, Color } from "../models";
import { Peice } from "./peice";

export class Pawn extends Peice{
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        {x:1, y:0},
        {x:2, y:0},
        {x:1, y:1},
        {x:1, y:-1},
    ];

    constructor(private peiceColor:Color){
        super(peiceColor)
        if(peiceColor === Color.Black){
            this.setBlackPawnDirections();
        }
        this._FENChar = peiceColor === Color.White ? FENChar.WhitePawn : FENChar.BlackPawn
    }
    
    private setBlackPawnDirections():void{
        this._directions = this._directions.map(({x, y}) => ({x: -1*x, y}));
    }

    public get hasMoved(): boolean{
        return this._hasMoved
    }

    public set hasMoved(_){
        this._hasMoved = true;
        this._directions = [
            {x:1, y:0},
            {x:1, y:1},
            {x:1, y:-1},
        ]

        if(this.peiceColor === Color.Black){
            this.setBlackPawnDirections();
        }
    }
}