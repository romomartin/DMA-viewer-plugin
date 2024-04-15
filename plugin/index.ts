import {
  OverlayLayer,
  PipeGroups,
  PluginI,
  SDK,
  registerPlugin
} from "@qatium/plugin/engine";
import { DMA, Message, events } from "./types";
import { getColor } from "./colors";
import { buildPipeLayer } from "./build-pipe-layer";

class Plugin implements PluginI<Message> {
  overlay: OverlayLayer<"GeoJsonLayer">[] = [];
  dmas: DMA[] = [];

  run(sdk: SDK) {
    if (this.overlay.length === 0) {
      this.dmas = sdk.network
        .getZones()
        .map((zone, i) => ({ id: zone.id, color: getColor(i) }));

      this.dmas.forEach((dma) => {
        const dmaPipes = sdk.network
          .getZone(dma.id)
          ?.getPipes((pipe) => pipe.group === PipeGroups.Main);

        if (dmaPipes && dmaPipes.length > 0)
          this.overlay.push(buildPipeLayer(dma.id, dmaPipes, dma.color));
      });
    }

    sdk.ui.sendMessage<Message>({ event: events.getDMAs, dmas: this.dmas });
    sdk.map.addOverlay(this.overlay);
  }

  onMessage(sdk: SDK, message: Message) {
    if (message.event === events.changeDMAcolor) {
      const changedDmaIndex = this.dmas.findIndex(
        (dma) => dma.id === message.dma.id
      );
      this.dmas[changedDmaIndex] = message.dma;

      const newOverlay = changeDmaLayer(sdk, this.overlay, message.dma);
      this.overlay = newOverlay;

      this.run(sdk);
    }
  }
}

const changeDmaLayer = (
  sdk: SDK,
  overlay: OverlayLayer<"GeoJsonLayer">[],
  dma: DMA
): OverlayLayer<"GeoJsonLayer">[] => {
  const dmaPipes = sdk.network
    .getZone(dma.id)
    ?.getPipes((pipe) => pipe.group === PipeGroups.Main);

  if (!dmaPipes) return overlay;

  const newLayer = buildPipeLayer(dma.id, dmaPipes, dma.color);
  const indexToChange = overlay.findIndex((layer) => layer.id === dma.id);
  overlay[indexToChange] = newLayer;
  return overlay;
};

registerPlugin(new Plugin());
