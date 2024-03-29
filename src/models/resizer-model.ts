import {
  IKeyToBoolMap,
  IPane, IResizablePaneProviderProps,
  IResizerApi, IStoreResizerModel
} from '../@types'
import {RESIZER} from '../constant'
import {ResizeStorage} from '../utils/storage'
import {getObj} from '../utils/util'

export class ResizerModel {
  api: IResizerApi
  visibility: boolean
  id: string
  isRegistered: boolean = false
  isStorPresent: boolean

  resizerSize: number

  visibilityMap: IKeyToBoolMap

  constructor (
    paneProps: IPane,
    resizableProps: IResizablePaneProviderProps,
    store: ResizeStorage) {
    const {id} = paneProps
    const {resizerSize, visibility = {}} = resizableProps
    this.visibilityMap = resizableProps.visibility as IKeyToBoolMap
    const show = visibility[id] !== undefined ? visibility[id] : true
    this.id = `${RESIZER}-${id}`
    this.isStorPresent = !store.empty

    if (this.isStorPresent) {
      const storedResizer = store.getStoredResizer(this.id)
      if (storedResizer) {
        this.visibility = storedResizer.visibility
      }
    } else {
      this.visibility = show as boolean
    }

    this.resizerSize = paneProps.resizerSize || resizerSize as number
  }

  registerMe () {
    switch (true) {
      case !this.isRegistered:
        // this.api.setVisibility(this.visibility)
        this.setUISize()
        break
      case this.isRegistered:
        this.visibility = this.api.visibility
    }
    this.isRegistered = true
  }

  // This method never runs for last Element
  register (api: IResizerApi) {
    this.api = api
    if (!this.visibilityMap) {
      this.resizerSize = api.getVisibleSize()
    }
    this.registerMe()
  }

  getSize () {
    return this.isRegistered ? (this.visibility ? this.resizerSize : 0) : 0
  }

  setUISize () {
    if (this.api) {
      let uiSize = 0

      if (this.visibility) {
        if (this.resizerSize) {
          uiSize = this.resizerSize
        } else {
          uiSize = this.api.getVisibleSize()
        }
      }

      this.api.setSize(uiSize)
    }
  }

  setVisibilityNew (visibility: boolean) {
    this.visibility = visibility
  }

  getStoreModel = (): IStoreResizerModel =>
    getObj(this, 'id', 'visibility')
}
