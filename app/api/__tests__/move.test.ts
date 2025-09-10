import { gameStore } from '../../game-store'
jest.mock('../../game-store', () => ({
  gameStore: {
    makeMove: jest.fn(),
    getState: jest.fn()
  }
}))

class NextResponse {
  constructor(public body: any, public init?: { status?: number }) {}

  static json(data: any, init?: { status?: number }) {
    return new NextResponse(data, init)
  }

  json() {
    return Promise.resolve(this.body)
  }

  get status() {
    return this.init?.status || 200
  }
}

class NextRequest {
  url: string
  method: string
  private bodyContent: string

  constructor(input: string, init: { method?: string; body?: string } = {}) {
    this.url = input
    this.method = init.method || 'GET'
    this.bodyContent = init.body || ''
  }

  async json() {
    return JSON.parse(this.bodyContent)
  }
}

// 전역 객체 모킹
jest.mock('next/server', () => ({
  NextResponse,
  NextRequest
}))

import { POST } from '../move/route'

describe('POST /api/move', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles valid move request', async () => {
    const mockState = {
      board: Array(15).fill(null).map(() => Array(15).fill(null)),
      currentPlayer: 'white',
      gameStatus: 'playing'
    }

    ;(gameStore.makeMove as jest.Mock).mockReturnValue(true)
    ;(gameStore.getState as jest.Mock).mockReturnValue(mockState)

    const request = new NextRequest('http://localhost/api/move', {
      method: 'POST',
      body: JSON.stringify({ row: 7, col: 7, stone: 'black' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockState)
    expect(gameStore.makeMove).toHaveBeenCalledWith(7, 7, 'black')
  })

  it('rejects invalid move coordinates', async () => {
    const request = new NextRequest('http://localhost/api/move', {
      method: 'POST',
      body: JSON.stringify({ row: 15, col: 7, stone: 'black' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('rejects invalid stone color', async () => {
    const request = new NextRequest('http://localhost/api/move', {
      method: 'POST',
      body: JSON.stringify({ row: 7, col: 7, stone: 'invalid' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('handles failed moves', async () => {
    ;(gameStore.makeMove as jest.Mock).mockReturnValue(false)

    const request = new NextRequest('http://localhost/api/move', {
      method: 'POST',
      body: JSON.stringify({ row: 7, col: 7, stone: 'black' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })
})
