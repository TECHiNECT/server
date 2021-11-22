export interface BaseEvent {
  type: string
}

export interface WebSocketMessage extends BaseEvent {
  data: { message: string }
}

export interface WebSocketEvent extends BaseEvent {
  data: {
    roomId: string
    userId: string
    username?: string
  }
}
