import { OverlayLayer, Pipe, PipeGroups, SDK } from "@qatium/sdk";

import { Plugin, init } from "@qatium/sdk/plugin";
import { DMA, Message, events } from "./types";
import { getColor } from "./colors";
import { buildPipeLayer } from "./build-pipe-layer";

class MyPlugin implements Plugin {
  isFirstRun: boolean = true;
  dmaLayers: OverlayLayer<"GeoJsonLayer">[] = [];
  dmas: DMA[] = [];

  run() {
    if (this.isFirstRun) {
      this.dmas = getDmas();
      this.dmaLayers = buildDmaLayers(this.dmas);
      this.isFirstRun = false;
    }

    sdk.ui.sendMessage<Message>({ event: events.getDMAs, dmas: this.dmas });
    sdk.map.addOverlay(this.dmaLayers);
  }

  onMessage(message: Message) {
    if (message.event === events.changeDMAcolor) {
      updateDmas(message.dma, this.dmas);
      this.dmaLayers = updateDmaLayers(this.dmaLayers, message.dma);

      this.run();
    }
  }
}

const getDmas = (): DMA[] => {
  return sdk.network.getZones().map((zone, index) => ({
    id: zone.id,
    color: getColor(index),
    hasPipes: hasPipes(sdk, zone.id)
  }));
};

const hasPipes = (sdk: SDK, zoneId: string): boolean => {
  const dmaPipes = sdk.network
    .getZone(zoneId)
    ?.getPipes((pipe) => pipe.group === PipeGroups.Main);

  return dmaPipes !== undefined && dmaPipes.length > 0;
};

const buildDmaLayers = (dmas: DMA[]): OverlayLayer<"GeoJsonLayer">[] => {
  const dmaLayers: OverlayLayer<"GeoJsonLayer">[] = [];

  dmas.forEach((dma) => {
    const dmaLayer = buildDmaLayer(dma);
    if (dmaLayer) dmaLayers.push(dmaLayer);
  });

  return dmaLayers;
};

const updateDmas = (newDma: DMA, dmas: DMA[]) => {
  const changedDmaIndex = dmas.findIndex((dma) => dma.id === newDma.id);
  dmas[changedDmaIndex] = newDma;
};

const updateDmaLayers = (
  dmaLayers: OverlayLayer<"GeoJsonLayer">[],
  updatedDma: DMA
): OverlayLayer<"GeoJsonLayer">[] => {
  const newLayer = buildDmaLayer(updatedDma);
  if (!newLayer) return dmaLayers;

  const indexToChange = dmaLayers.findIndex(
    (layer) => layer.id === updatedDma.id
  );
  dmaLayers[indexToChange] = newLayer;
  return dmaLayers;
};

const buildDmaLayer = (dma: DMA): OverlayLayer<"GeoJsonLayer"> | undefined => {
  const dmaPipes = getDmaPipes(dma);
  if (!dmaPipes) return;

  return buildPipeLayer(dma.id, dmaPipes, dma.color);
};

const getDmaPipes = (dma: DMA): Pipe[] | undefined => {
  const dmaPipes = sdk.network
    .getZone(dma.id)
    ?.getPipes((pipe) => pipe.group === PipeGroups.Main);

  if (dmaPipes === undefined) return;
  if (dmaPipes.length === 0) return;

  return dmaPipes;
};

init(new MyPlugin());
