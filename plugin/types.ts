export enum events {
  getDMAs = "get-dmas",
  changeDMAcolor = "change-color"
}

export type DMA = { id: string; color: string };

export type Message =
  | {
      event: events.getDMAs;
      dmas: DMA[];
    }
  | {
      event: events.changeDMAcolor;
      dma: DMA;
    };
