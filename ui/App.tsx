import { sendMessage } from '@qatium/plugin/ui';
import { Message } from '../plugin/types';
import './App.css';
import { useSelectedElement } from './useSelectedElement';

function App() {
  const selectedElement = useSelectedElement();

  const closeValve = (valveId: string) => {
    sendMessage<Message>({
      event: "close-valve",
      valveId
    })
  }

  const content = selectedElement ?
    (
      <button onClick={() => closeValve(selectedElement.id)}>
        Close selected valve
      </button>
    )
    : <p>First select a valve</p>

  return (
    <>
      <h1>Valve closer</h1>
      {content}
    </>
  )
}

export default App
