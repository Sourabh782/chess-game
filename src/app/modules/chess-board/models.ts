import { FENChar } from "../../chess-logic/models"

type SquareWithPeice = {
    peice: FENChar;
    x: number;
    y: number
}

type SquareWithoutPeice = {
    peice: null
}

export type SelectedSquare = SquareWithPeice | SquareWithoutPeice

export const columns = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;