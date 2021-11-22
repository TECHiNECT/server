import { WebSocketMessage } from '../index.d'

export const messageType = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
}

type Messages = { [key: string]: WebSocketMessage }

export const messages: Messages = {
  JSON_ERROR: { type: messageType.ERROR, data: { message: 'Invalid json' } },
}
