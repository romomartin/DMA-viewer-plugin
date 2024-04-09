import { PluginI, SDK, registerPlugin } from "@qatium/plugin/engine";
import { Message, events } from "./types";
import { getColor } from "./colors";

class Plugin implements PluginI<Message> {
  selectedElement: ReturnType<SDK["map"]["getSelectedElement"]>;

  run(sdk: SDK) {
    const dmas = sdk.network
        .getZones()
        .map((zone, i) => ({ id: zone.id, color: getColor(i) }));
  
      sdk.ui.sendMessage<Message>({ event: events.getDMAs, dmas });
  }
}

registerPlugin(new Plugin());
