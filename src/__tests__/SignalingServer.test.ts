import WebSocket from 'ws'
import { SignalingServer } from '../'
import { WebSocketMessage } from '../index.d'
import { waitForSocketState } from '../utils/wsTestUtils'

describe('Signaling Server', () => {
  let server: SignalingServer
  beforeAll(() => {
    server = new SignalingServer()
    server.start()
  })

  afterAll(() => server.close())

  it('Should sends error if json message is invalid', async () => {
    const client = new WebSocket('ws://localhost:5000')
    await waitForSocketState(client, client.OPEN)

    const mockResponse: WebSocketMessage = {
      type: 'error',
      data: {
        message: 'Invalid json',
      },
    }

    const testMessage = 'Sending text instead of JSON'
    let response: WebSocketMessage | undefined
    client.on('message', (message: string) => {
      response = JSON.parse(message)
      client.close()
    })
    client.send(testMessage)

    await waitForSocketState(client, client.CLOSED)
    expect(response).toStrictEqual(mockResponse)
  })
})
