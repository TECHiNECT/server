import * as WebSocket from 'ws'

import { WebSocketEvent } from '../index.d'
import { isJsonString, messages } from '../utils'

let rooms: { [key: string]: any } = {}

export const webSocketConnection = async (wss: WebSocket.Server) => {
  wss.on('connection', (ws: WebSocket) => {
    let room: string, id: string, username: string
    ws.on('message', (message: string) => {
      const jsonValidation = isJsonString(message)
      if (!jsonValidation) {
        ws.send(JSON.stringify(messages.JSON_ERROR))
        return
      }

      const event: WebSocketEvent = JSON.parse(message)

      switch (event.type) {
        case 'join':
          onJoin(ws, event)
          break
        case 'offer':
          onOffer(event)
          break
        case 'answer':
          onAnswer(event)
          break
        case 'candidate':
          onCandidate(event)
          break
        case 'disconnect':
          onDisconnect(event)
          break
        default:
          break
      }

      console.log('received: %s', message)
      ws.send(`Hello, you sent -> ${message}`)
    })
    ws.send('Connected to signaling server')

    ws.on('close', () => {
      // console.log('user disconnected')
    })
  })
}

const onJoin = (socket: WebSocket, event: WebSocketEvent) => {
  const { roomId, userId } = event.data
  rooms[roomId] =
    (rooms[roomId] && rooms[roomId].set(userId, socket)) || new Map<string, WebSocket>().set(userId, socket)
  notify(event)
}

const onOffer = (event: WebSocketEvent) => {
  broadcast(event)
}

const onAnswer = (event: WebSocketEvent) => {
  broadcast(event)
}

const onCandidate = (event: WebSocketEvent) => {
  broadcast(event)
}

const onDisconnect = (event: WebSocketEvent) => {
  leave(event)
}

const leave = (event: WebSocketEvent) => {
  const { roomId, userId } = event.data
  if (userId) {
    rooms[roomId].delete(userId)
    console.log('user left')
    notify(event)
  }
}

const notify = (event: WebSocketEvent) => {
  const { roomId, userId, username } = event.data
  const connectedPeers = rooms[roomId]
  connectedPeers.forEach((socket: WebSocket, peerId: string) => {
    if (peerId !== userId) {
      const message = {
        type: event.type,
        data: {
          total: connectedPeers.size,
          remoteUser: userId,
          remoteUsername: username,
        },
      }
      const response = JSON.stringify(message)
      socket.send(response)
    }
  })
}

const broadcast = (event: WebSocketEvent) => {
  const { roomId, userId } = event.data
  const connectedPeers = rooms[roomId]
  connectedPeers.forEach((_socket: WebSocket, peerId: string) => {
    if (peerId !== userId) {
      const response = JSON.stringify(event)
      _socket.send(response)
    }
  })
}
