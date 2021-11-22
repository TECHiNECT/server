import express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
import { webSocketConnection } from './ws'

export class SignalingServer {
  public app: express.Application
  public server: http.Server
  public wss: WebSocket.Server

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.wss = new WebSocket.Server({ server: this.server })
  }

  public start(port = 5000) {
    webSocketConnection(this.wss)
    this.server.listen(port, () => {
      console.log(`NextStax Server started on port ${port}`)
    })
  }

  public close() {
    this.server.close()
  }
}
