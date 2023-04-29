import z from 'zod'
import { useSafeValidatedBody, useValidatedParams } from 'h3-zod'
import { defineEventHandler } from 'h3'

import { IObjectSchema } from '~/types'
import { items } from '~/server/objects'

export default defineEventHandler(async (event) => {
  const params = await useValidatedParams(event, z.object({ id: z.string() }))
  const body = await useSafeValidatedBody(event, IObjectSchema)

  if (body.success) {
    const index = items.findIndex(item => item._id === params.id)
    if (index < 0)
      return 404

    // items.splice(index, 1, body.data)
  }

  return 400
})
