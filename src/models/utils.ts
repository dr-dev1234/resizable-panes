export const checkPaneModelErrors = (size: number, minSize: number, maxSize: number, id: string) => {
  if (size < minSize) {
    throw Error('Size can not be smaller than minSize for pane id ' + id)
  }

  if (size > maxSize) {
    throw Error('Size can not be greatter than maxSize for pane id ' + id)
  }
}
