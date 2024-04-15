import { useState } from "react";
import "./panel.css";
import { DMA, Message, events } from "../../plugin/types";
import { onMessage, sendMessage } from "@qatium/plugin/ui";
import { ColorResult } from "react-color";
import { COLORS } from "../../plugin/colors";
import Circle from "react-color/lib/components/circle/Circle";

export const Panel = () => {
  const [dmas, setDmas] = useState<DMA[]>([]);

  onMessage<Message>((msg) => {
    if (msg.event === events.getDMAs) {
      setDmas(msg.dmas);
    }
  });

  return (
    <div className="panel">
      <PanelBody dmas={dmas}></PanelBody>
    </div>
  );
};

const PanelBody = ({ dmas }: { dmas: DMA[] }) => {
  return (
    <div className="panel-body">
      {dmas?.map((dma, i) => {
        return <Row key={i} dma={dma}></Row>;
      })}
    </div>
  );
};

const Row = ({ dma }: { dma: DMA }) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [dmaColor, setDmaColor] = useState<string>(dma.color);

  const displayColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = (color: ColorResult) => {
    const changedDMA: DMA = { id: dma.id, color: color.hex };
    sendMessage<Message>({ event: events.changeDMAcolor, dma: changedDMA });

    setDmaColor(color.hex);
    displayColorPicker();
  };

  return (
    <>
      <div className="row">
        <button
          className={showColorPicker ? "selected" : ""}
          aria-label={`${dma.id}-color-picker-button`}
          onClick={displayColorPicker}
          style={{ backgroundColor: dmaColor }}
        ></button>
        <div className="text">{dma.id}</div>
      </div>
      {showColorPicker && (
        <Circle
          colors={COLORS}
          width={"100%"}
          circleSize={17}
          circleSpacing={8}
          onChangeComplete={handleColorChange}
        ></Circle>
      )}
    </>
  );
};
