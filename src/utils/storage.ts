import {ReactElement} from 'react'
import {IStoreModel, IStoreResizableItemsModel} from '../@types'
import {getResizerSum} from './panes'
import {findById} from './util'
import {ResizableModel} from '../models'

export class ResizeStorage {
  panesComponents: ReactElement[]
  store: any = null
  uniqueId: string
  storageApi: any
  empty = false

  constructor (uniqueId: string, storageApi: any, panesComponents: ReactElement[]) {
    this.uniqueId = uniqueId
    this.storageApi = storageApi
    this.panesComponents = panesComponents
    this.getStorage()
  }

  setStorage (resizable: ResizableModel, _containerSize?: number) {
    const {getContainerRect, panesList, vertical, resizersList} = resizable
    const {uniqueId, storageApi} = this
    const {width, height} = getContainerRect()

    // Need to make sure if we are using it containerSize
    const containerSize = _containerSize || (vertical ? width : height) -
    getResizerSum(resizersList, 0, resizersList.length - 1)

    const objectToSave = {
      panes: panesList.map(item => item.getStoreModel()),
      resizers: resizersList.map(item => item.getStoreModel()), // Now not required
      containerSize
    }
    this.store = objectToSave

    if (storageApi) { storageApi.setItem(uniqueId, JSON.stringify(objectToSave)) }
  }

  // eslint-disable-next-line complexity
  getStorage (): IStoreModel {
    const {store, uniqueId, storageApi} = this
    if (store) {
      return store
    }

    let value: any
    if (storageApi) {
      value = storageApi.getItem(uniqueId)
      const parsedValue: IStoreModel = JSON.parse(value, function (key, value) {
        if (key === 'defaultMaxSize') {
          return Number(value)
        }
        return value
      })

      if (toString.call(parsedValue) === '[object Object]') {
        const {panes} = parsedValue

        if (panes) {
          const allSameIds = panes.every((pane, i) => this.panesComponents[i]?.props.id === pane.id)

          if (allSameIds && panes.length === this.panesComponents.length) {
            this.store = parsedValue
            return parsedValue
          } else {
            storageApi.removeItem(uniqueId)
          }
        } else {
          storageApi.removeItem(uniqueId)
        }
      }
    }
    this.empty = true
    return {
      panes: [],
      resizers: []
    } as IStoreModel
  }

  // Removed from Call
  getStoredPane (id: string): IStoreResizableItemsModel | null {
    const {panes} = this.getStorage()
    return findById(panes, id) ?? null
  }

  // getStoredResizer (id: string) {
  //   const {resizers} = this.getStorage()
  //   return findById(resizers, id) ?? null
  // }

  // Need to check this
  // readPaneChange (children: ReactElement[], context: any) {
  //   const {panes, containerSize} = this.getStorage()
  //   if (!containerSize) {
  //     return
  //   }

  //   const {panesList} = context.resizable
  //   let isVisibilityChanged = false

  //   const visibleIds = children.map((child: any) => child.props.id)

  //   panesList.forEach((pane: any) => {
  //     const visibility = visibleIds.includes(pane.id)
  //     if (pane.visibility !== visibility) {
  //       pane.visibility = visibility
  //       isVisibilityChanged = true
  //     }
  //     pane.size = findById(panes, pane.id).size
  //   })

  //   if (isVisibilityChanged) {
  //     // toRatioModeFn(panesList, containerSize)
  //     context.resizable.isSetRatioMode = true
  //   }
  // }
}
