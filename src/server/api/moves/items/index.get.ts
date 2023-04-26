import { defineEventHandler } from 'h3'
import { items } from '~/server/moves'
import { sendData } from '~/server'

export default defineEventHandler((_event) => {
  return sendData(items)
})
