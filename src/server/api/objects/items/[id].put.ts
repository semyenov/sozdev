// import z from 'zod'
// import { useSafeValidatedBody, useValidatedParams } from 'h3-zod'
// import { defineEventHandler } from 'h3'

// import { items } from '~/server/objects'

// export default defineEventHandler(async (event) => {
//   const params = await useValidatedParams(event, z.object({ id: z.string() }))
//   const body = await useSafeValidatedBody(
//     event,
//     z.object({ height: z.string() })
//   )

//   if (body.success) {
//     const item = items.find((item) => item._id === params.id)
//     if (item) {
//       item.height = body.data.height
//       return item
//     }
//   }

//   return 404
// })
