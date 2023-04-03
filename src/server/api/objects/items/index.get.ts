import { defineEventHandler } from 'h3'

import { items } from '~/server/objects'
import { sendData } from '~/server'

export default defineEventHandler((_event) => {
  return sendData(items.slice(0, 10000))
})
