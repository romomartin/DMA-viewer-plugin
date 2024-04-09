export enum events {
    getDMAs = "get-dmas",
  }
  
export type DMA = { id: string; color: string };

export type Message = {
    event: events.getDMAs;
    dmas: DMA[];
};