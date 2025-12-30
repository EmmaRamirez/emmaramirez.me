export enum Blob {
    Bloblet = 1,
    Bloblet2 = 2,
}

export interface Point {
    x: number;
    y: number;
    originX: number;
    originY: number;
    noiseOffsetX: number;
    noiseOffsetY: number;
}

export * from './homepage';