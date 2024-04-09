import { useState } from "react";
import { DMA, Message, events } from "../../plugin/types";
import { onMessage } from "@qatium/plugin/ui";

export const Panel = () => { 
  const [dmas, setDmas] = useState<DMA[]>([]);

  onMessage<Message>((msg) => {
    if (msg.event === events.getDMAs) {
      setDmas(msg.dmas);
    }
  });
  
  return (
    <div className="panel">
      some content {dmas.length}
      {/* <PanelBody dmas={dmas}></PanelBody> */}
    </div>
  );
};