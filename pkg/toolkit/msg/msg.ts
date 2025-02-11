import {Pointer} from './pointer.ts'

export type ExamplesOf<T extends any> = Record<string, T>

export interface FieldMeta {
  description?: string
  type?: string
  required?: boolean
  examples?: ExamplesOf<any>
}

export type Meta = Record<Pointer, FieldMeta>

export type Msg = Record<string, any> & {
  description?: string
  meta?: Meta
  cap?: string
  examples?: ExamplesOf<Msg>
}
