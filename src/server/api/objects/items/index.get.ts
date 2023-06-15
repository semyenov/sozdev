import { defineEventHandler } from 'h3'

import { sendData } from '~/server'
import { items } from '~/server/objects'

export default defineEventHandler((_event) => {
  return sendData(items)
})
