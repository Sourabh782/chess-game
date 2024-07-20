import { Peice } from "./peices/peice";

export enum Color{
    White, 
    Black
}

export type Coords = {
    x: number,
    y: number
}

export enum FENChar{
    WhitePawn = "P",
    WhiteKnight = "N",
    WhiteBishop = "B",
    WhiteRook = "R",
    WhiteKing = "K",
    WhiteQueen = "Q",
    BlackPawn = "p",
    BlackKnight = "n",
    BlackBishop = "b",
    BlackRook = "r",
    BlackKing = "k",
    BlackQueen = "q"
}

export const peiceImagePath: Readonly<Record<FENChar, string>> = {
    [FENChar.WhitePawn]: "assets/pieces/wp.png",
    [FENChar.WhiteKnight]: "assets/pieces/wn.png",
    [FENChar.WhiteBishop]: "assets/pieces/wb.png",
    [FENChar.WhiteRook]: "assets/pieces/wr.png",
    [FENChar.WhiteQueen]: "assets/pieces/wq.png",
    [FENChar.WhiteKing]: "assets/pieces/wk.png",
    [FENChar.BlackPawn]: "assets/pieces/bp.png",
    [FENChar.BlackKnight]: "assets/pieces/bn.png",
    [FENChar.BlackBishop]: "assets/pieces/bb.png",
    [FENChar.BlackRook]: "assets/pieces/br.png",
    [FENChar.BlackQueen]: "assets/pieces/bq.png",
    [FENChar.BlackKing]: "./assets/pieces/bk.png"
}

export type SafeSquares = Map<string, Coords[]>;

export type lastMove = {
    peice: Peice
    prevX: number;
    prevY: number;
    currX: number;
    currY: number
}

type KingCheck = {
    isInCheck: true;
    x: number;
    y: number
}

type KingNotChecked = {
    isInCheck: false;
}

export type CheckState = KingCheck | KingNotChecked