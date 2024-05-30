import {
  OverlayLayer,
  Pipe,
  PipeGroups,
  PluginI,
  SDK,
  registerPlugin
} from "@qatium/plugin/engine";
import { DMA, Message, events } from "./types";
import { getColor } from "./colors";
import { buildPipeLayer } from "./build-pipe-layer";

class Plugin implements PluginI<Message> {
  isFirstRun: boolean = true;
  dmaLayers: OverlayLayer<"GeoJsonLayer">[] = [];
  dmas: DMA[] = [];

  run(sdk: SDK) {
    if (this.isFirstRun) {
      this.dmas = getDmas(sdk);
      this.dmaLayers = buildDmaLayers(sdk, this.dmas);
      this.isFirstRun = false;
    }

    sdk.ui.sendMessage<Message>({ event: events.getDMAs, dmas: this.dmas });
    sdk.map.addOverlay(this.dmaLayers);
  }

  onMessage(sdk: SDK, message: Message) {
    if (message.event === events.changeDMAcolor) {
      updateDmas(message.dma, this.dmas);
      this.dmaLayers = updateDmaLayers(sdk, this.dmaLayers, message.dma);

      this.run(sdk);
    }
  }
}

const getDmas = (sdk: SDK): DMA[] => {
  return sdk.network
    .getZones()
    .map((zone, index) => ({ id: zone.id, color: getColor(index) }));
};

const buildDmaLayers = (
  sdk: SDK,
  dmas: DMA[]
): OverlayLayer<"GeoJsonLayer">[] => {
  const dmaLayers: OverlayLayer<"GeoJsonLayer">[] = [];

  dmas.forEach((dma) => {
    const dmaLayer = buildDmaLayer(sdk, dma);
    if (dmaLayer) dmaLayers.push(dmaLayer);
  });

  return dmaLayers;
};

const updateDmas = (newDma: DMA, dmas: DMA[]) => {
  const changedDmaIndex = dmas.findIndex((dma) => dma.id === newDma.id);
  dmas[changedDmaIndex] = newDma;
};

const updateDmaLayers = (
  sdk: SDK,
  dmaLayers: OverlayLayer<"GeoJsonLayer">[],
  updatedDma: DMA
): OverlayLayer<"GeoJsonLayer">[] => {
  const newLayer = buildDmaLayer(sdk, updatedDma);
  if (!newLayer) return dmaLayers;

  const indexToChange = dmaLayers.findIndex(
    (layer) => layer.id === updatedDma.id
  );
  dmaLayers[indexToChange] = newLayer;
  return dmaLayers;
};

const buildDmaLayer = (
  sdk: SDK,
  dma: DMA
): OverlayLayer<"GeoJsonLayer"> | undefined => {
  const dmaPipes = getDmaPipes(sdk, dma);
  if (!dmaPipes) return;

  return buildPipeLayer(dma.id, dmaPipes, dma.color);
};

const getDmaPipes = (sdk: SDK, dma: DMA): Pipe[] | undefined => {
  const dmaPipes = sdk.network
    .getZone(dma.id)
    ?.getPipes((pipe) => pipe.group === PipeGroups.Main);

  if (dmaPipes === undefined) return;
  if (dmaPipes.length === 0) return;

  return dmaPipes;
};

registerPlugin(new Plugin());
