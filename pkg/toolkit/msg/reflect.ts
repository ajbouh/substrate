import { MsgIndex } from './cap.ts'
import { sender } from './sender.ts'
 
export async function reflect(url: string): Promise<MsgIndex> {
  const { msgindex } = await sender()({ cap: 'reflect', url})
  return msgindex
}
