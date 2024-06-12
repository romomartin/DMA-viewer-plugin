import { useState } from "react";
import "./panel.css";
import { DMA, Message, events } from "../../plugin/types";
import { onMessage, sendMessage } from "@qatium/sdk/ui";
import { ColorResult } from "react-color";
import { COLORS } from "../../plugin/colors";
import Circle from "react-color/lib/components/circle/Circle";
import { IconWarning } from "../icons/icon-warning";

export const Panel = () => {
  const [dmas, setDmas] = useState<DMA[]>([]);

  onMessage<Message>((msg) => {
    if (msg.event === events.getDMAs) {
      setDmas(msg.dmas);
    }
  });

  return <PanelBody dmas={dmas}></PanelBody>;
};

const PanelBody = ({ dmas }: { dmas: DMA[] }) => {
  if (dmas.length === 0) return <NoDmasYet></NoDmasYet>;

  const { dmasWithPipes, dmasWithoutPipes } = dmas.reduce(
    (acc, dma) => {
      dma.hasPipes
        ? acc.dmasWithPipes.push(dma)
        : acc.dmasWithoutPipes.push(dma);
      return acc;
    },
    {
      dmasWithPipes: [],
      dmasWithoutPipes: []
    } as { dmasWithPipes: DMA[]; dmasWithoutPipes: DMA[] }
  );

  return (
    <div className="panel-body">
      {dmasWithoutPipes.length > 0 && dmasWithPipes.length > 0 && <h4>DMAs</h4>}
      {dmasWithPipes.map((dma, i) => (
        <DmaRow key={i} dma={dma}></DmaRow>
      ))}
      {dmasWithoutPipes.length > 0 && (
        <UnrecognizedDmas dmas={dmasWithoutPipes}></UnrecognizedDmas>
      )}
    </div>
  );
};

const NoDmasYet = () => {
  return (
    <div className="panel-body">
      <p className="warning-text">
        No DMAs in your network yet.{" "}
        <a
          href="https://help.qatium.com/hc/en-us/articles/23182710465937-Zones"
          target="_blank"
          rel="noreferrer"
        >
          Add a zone layer to start
        </a>
        .
      </p>
    </div>
  );
};

const DmaRow = ({ dma }: { dma: DMA }) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [pickerColor, setPickerColor] = useState<string>(dma.color);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = (color: ColorResult) => {
    const changedDMA: DMA = {
      id: dma.id,
      color: color.hex,
      hasPipes: dma.hasPipes
    };
    sendMessage<Message>({ event: events.changeDMAcolor, dma: changedDMA });

    setPickerColor(color.hex);
    toggleColorPicker();
  };

  return (
    <>
      <div className="row">
        <button
          className={showColorPicker ? "selected" : ""}
          aria-label={`${dma.id}-color-picker-button`}
          onClick={toggleColorPicker}
          style={{ backgroundColor: pickerColor }}
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

const UnrecognizedDmas = ({ dmas }: { dmas: DMA[] }) => {
  return (
    <>
      <h4>Unrecognized DMAs</h4>
      <div className="row-warning">
        <div className="icon">
          <IconWarning></IconWarning>
        </div>
        <div>
          <p className="warning-text">
            Some DMAs don&apos;t have any pipes assigned.<br></br>Define the
            zone inlets first.{" "}
            <a
              href="https://help.qatium.com/hc/en-us/articles/23182710465937-Zones"
              target="_blank"
              rel="noreferrer"
            >
              Learn how
            </a>
            .
          </p>
        </div>
      </div>
      <ul className="unrecognized-list">
        {dmas.map((dma, i) => (
          <li key={i}>{dma.id}</li>
        ))}
      </ul>
    </>
  );
};
