import { OverlayLayer, PipeGroups, PluginI, SDK, registerPlugin } from "@qatium/plugin/engine";
import { Message, events } from "./types";
import { getColor } from "./colors";
import { buildPipeLayer } from "./build-pipe-layer";

class Plugin implements PluginI<Message> {
  overlay: OverlayLayer<"GeoJsonLayer">[] = [];

  run(sdk: SDK) {
    const dmas = sdk.network
        .getZones()
        .map((zone, i) => ({ id: zone.id, color: getColor(i) }));
  
      sdk.ui.sendMessage<Message>({ event: events.getDMAs, dmas });

      dmas.forEach((dma) => {
        const dmaPipes = sdk.network
          .getZone(dma.id)
          ?.getPipes((pipe) => pipe.group === PipeGroups.Main);
  
        if (dmaPipes && dmaPipes.length > 0)
          this.overlay.push(buildPipeLayer(dma.id, dmaPipes, dma.color));
      });

      sdk.map.addOverlay(this.overlay);
  }
}

registerPlugin(new Plugin());
