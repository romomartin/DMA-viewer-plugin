import { SDK, Valve } from '@qatium/plugin'

export type SelectedElement = ReturnType<SDK["map"]["getSelectedElement"]>

export type Message =
  | {
    event: "selected-element",
    selectedElement: SelectedElement
  }
  | {
    event: "close-valve",
    valveId: Valve["id"]
  }