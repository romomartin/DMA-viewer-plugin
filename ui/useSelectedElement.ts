import { AssetTypes, onMessage } from '@qatium/plugin/ui';
import { useEffect, useState } from 'react';
import { Message, SelectedElement } from '../plugin/types';

export const useSelectedElement = () => {
  const [selectedElement, setSelectedElement] = useState<SelectedElement>()

  useEffect(() => {
    const { removeListener } = onMessage<Message>((msg) => {
      if (msg.event !== "selected-element") {
        return;
      }

      if (!msg.selectedElement) {
        return setSelectedElement(undefined);
      }

      if (msg.selectedElement?.type === AssetTypes.VALVE) {
        return setSelectedElement(msg.selectedElement)
      }
    })

    return removeListener
  }, [])

  return selectedElement;
}