import {ResizableModel} from '../models'
import {getSize} from '../models/pane'
import {addDOMEvent, addDOMEventPassive, getResizableEvent, removeDOMEvent} from '../utils/dom'
import {getVisibleItems} from '../utils/panes'

import throttle from 'throttleit'
import {sortNumber} from '../utils/util'
import {EVENT_NAMES} from '../utils/constant'

export const attachDetectionCoordinate = (resizable: ResizableModel) => {
  const {vertical, items, getContainerRect} = resizable

  const {left, top} = getContainerRect()

  let coordinatesSum = vertical ? left : top

  const visibleItems = getVisibleItems(items)
  const detectionCoordinate = []

  for (let i = 0; i < visibleItems.length - 1; i += 2) {
    const pane = visibleItems[i]
    if (!pane.isHandle) {
      const {defaultSize, id, detectionRadius} = visibleItems[i + 1]
      const size = getSize(pane)
      const resizerX1 = coordinatesSum + size - detectionRadius
      const resizerX2 = coordinatesSum + size + defaultSize + detectionRadius
      coordinatesSum += size + defaultSize
      detectionCoordinate.push([resizerX1, resizerX2, id])
    }
  }

  resizable.detectionDetails = detectionCoordinate
}

const getMouseDownOnHandle = (
  resizable: ResizableModel,
  vertical: boolean,
  registerResizeEvent: any) => (e: any) => {
  const {detectionDetails} = resizable

  const [cursorCoordinate] = getResizableEvent(e, vertical, {})

  const resizerClickedCoordinateList = detectionDetails.map(([x1, x2]) => {
    const coordinates = Math.abs(((x1 + x2) / 2) - cursorCoordinate)
    return coordinates
  })

  const copyForSort = sortNumber(resizerClickedCoordinateList)

  const closestCoordinate = copyForSort.pop()

  const closestIndex = resizerClickedCoordinateList.indexOf(closestCoordinate)
  if (detectionDetails.length > closestIndex && detectionDetails[closestIndex].length >= 3) {
    const [x1, x2, handleId] = detectionDetails[closestIndex]
    if (closestCoordinate <= ((x2 - x1) / 2)) {
      resizable.previousTouchEvent = e
      const resizableEvent = getResizableEvent(e, vertical, {})
      resizable.onMouseDown(resizableEvent, handleId)
      registerResizeEvent()
    }
  }
}

const onContainerMouseMove = (
  element: HTMLElement,
  resizable: ResizableModel,
  vertical: boolean,
  cursorStyle: string) => (e: any) => {
  const {detectionDetails} = resizable
  const cursorCoordinate = vertical ? e.clientX : e.clientY
  element.style.cursor = 'auto'
  detectionDetails.forEach(([x1, x2]) => {
    if (cursorCoordinate >= x1 && cursorCoordinate <= x2) {
      element.style.cursor = cursorStyle
    }
  })
}

const getResize = (resizable: ResizableModel, vertical: boolean) => (e: any) => {
  const resizableEvent = getResizableEvent(e, vertical, resizable.previousTouchEvent)
  resizable.onMoveResize(resizableEvent)
}

export const getDetectionService = (resizable: ResizableModel) => {
  const {vertical} = resizable
  const cursorStyle = vertical ? 'col-resize' : 'row-resize'

  const resize = getResize(resizable, vertical)

  const registerResizeEvent = () => {
    addDOMEvent(document, resize, EVENT_NAMES.mousemove)
    addDOMEventPassive(document, resize, EVENT_NAMES.touchmove)
  }

  const clearResizeEvent = () => {
    resizable.onMouseUp()
    removeDOMEvent(document, resize, EVENT_NAMES.mousemove, EVENT_NAMES.touchmove)
  }

  const onMouseDownOnHandle = getMouseDownOnHandle(resizable, vertical, registerResizeEvent)

  const startDetectionService = (containerNode: HTMLElement) => {
    const onGlobalMouseMoveDebounce = throttle(
      onContainerMouseMove(containerNode, resizable, vertical, cursorStyle), 100
    )

    // auto clear
    addDOMEventPassive(containerNode, onGlobalMouseMoveDebounce, EVENT_NAMES.mousemove)
    // auto clear
    addDOMEventPassive(containerNode, onGlobalMouseMoveDebounce, EVENT_NAMES.touchmove)
    // auto clear
    addDOMEvent(containerNode, onMouseDownOnHandle, EVENT_NAMES.mousedown)
    // auto clear
    addDOMEventPassive(containerNode, onMouseDownOnHandle, EVENT_NAMES.touchstart)

    addDOMEvent(document, clearResizeEvent, EVENT_NAMES.mouseup, EVENT_NAMES.touchend)
  }

  const clearDetectionService = () => {
    removeDOMEvent(document, clearResizeEvent, EVENT_NAMES.mouseup, EVENT_NAMES.touchend)
  }

  return [startDetectionService, clearDetectionService]
}
