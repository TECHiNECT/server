export const isJsonString = (str: string) => {
  try {
    JSON.parse(str)
  } catch (error) {
    return false
  }
  return true
}

export * from './messages'
