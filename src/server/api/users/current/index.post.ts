import { defineEventHandler } from 'h3'

import { sendData } from '~/server'
import type { IUserTokensData } from '~/types'

export default defineEventHandler((_event) => {
  return sendData<IUserTokensData>({
    access_token: '',
    refresh_token: '',
  })
})
