import { Color, FENChar } from "../../chess-logic/models";

export type StockfishQueryParams = {
    fen: string;
    depth: number
}

export type ChessMove = {
    prevX: number;
    prevY: number;
    newX: number;
    newY: number;
    promotedPeice: FENChar|null
}

export type StockfishResponse = {
    success: boolean;
    evaluation: number | null,
    mate: number | null,
    bestmove: string,
    continuation: string
}

export type ComputerConfiguration = {
    color: Color;
    level: number
}

export const stockfishLevel: Readonly<Record<number, number>> = {
    1:1,
    2:4,
    3:8,
    4:12,
    5: 15
}