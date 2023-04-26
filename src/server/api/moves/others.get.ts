import { sendData } from '~/server'
import { items } from '~/server/objects'

export default defineEventHandler((_event) => {
  return sendData(items.slice(10000))
})
