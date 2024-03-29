import { defineEventHandler } from 'h3'
import { useValidatedParams } from 'h3-zod'
import z from 'zod'

import { items } from '~/server/moves'

export default defineEventHandler(async (event) => {
  const params = await useValidatedParams(event, z.object({ id: z.string() }))

  return { data: items.find(item => item._id === params.id) }
})
