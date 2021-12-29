export interface Board {
  title: string,
  id: string,
  boardURL: string,
  orderGadgets: orderGadget[]
}

export interface orderGadget {
  cols: number,
  rows: number,
  x: number,
  y: number
  gadget : Gadget

}


export interface Gadget {
  instanceId: string;
  componentType: string,
  config: Config,
  value: any;
  name: string,
  tags: Tag[]
}

export interface Tag {
  facet: string,
  name: string
}
export interface Config {
  propertyPages: PropertyPage[]
}
export interface PropertyPage {
  displayName: string,
  groupId: string,
  position: number,
  properties: Property[]
}
export interface Property {
  value: string|number,
  key: string,
  label: string,
  required: boolean,
  order: number,
  controlType: string
}
