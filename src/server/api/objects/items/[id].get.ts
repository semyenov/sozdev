import { defineEventHandler } from 'h3'
import { useValidatedParams } from 'h3-zod'
import z from 'zod'

import { sendData } from '~/server'
import { items } from '~/server/objects'

export default defineEventHandler(async (event) => {
  const params = await useValidatedParams(event, z.object({ id: z.string() }))
  return sendData(items.find(item => item._id === params.id))
})
