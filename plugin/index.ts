import { PluginI, SDK } from "@qatium/plugin/engine";
import { Message } from './types';

class Plugin implements PluginI<Message> {
  selectedElement: ReturnType<SDK["map"]["getSelectedElement"]>;

  run(sdk: SDK) {
    const newSelectedElement = sdk.map.getSelectedElement()

    if (newSelectedElement?.id === this.selectedElement?.id) {
      return;
    }

    this.selectedElement = newSelectedElement;

    return sdk.ui.sendMessage<Message>({
      event: "selected-element",
      selectedElement: newSelectedElement
    })
  }

  onMessage(sdk: SDK, message: Message) {
    if (message.event !== "close-valve") {
      return;
    }

    return sdk.network.setStatus(message.valveId, "CLOSED");
  }
}

register(new Plugin());
