import { useStorage } from '@vueuse/core'
import { IMetaScope } from '../types'

export interface ISettingsWindox {
  componentInfo: {
    name: string
    params?: {
      [key: string]: string | number | boolean
    }
    slot?: {
      name: string
    }
  }
  item: {
    scope: IMetaScope
    id: string
  }
}

interface ISettingsWindoxStorage {
  [id: string]: ISettingsWindox
}

const savedWinboxStorage = useStorage(
  'data-saved-winbox',
  {} as ISettingsWindoxStorage
)

function setItem(id: string, data: ISettingsWindox) {
  savedWinboxStorage.value[id] = data
}

function getItem(id: string) {
  return savedWinboxStorage.value[id]
}

function removeItem(id: string) {
  savedWinboxStorage.value = Object.keys(savedWinboxStorage.value).reduce(
    (prev, cur) => {
      if (id === cur) {
        return prev
      }
      prev[cur] = savedWinboxStorage.value[cur]
      return prev
    },
    {} as ISettingsWindoxStorage
  )
}

function itemsGetter() {
  const objects = savedWinboxStorage.value
  return Object.keys(objects).reduce((array, key) => {
    const item = objects[key]
    array.push(item)
    return array
  }, [] as ISettingsWindox[])
}

export const usePreserve = () => {
  return { setItem, itemsGetter, removeItem, getItem }
}
