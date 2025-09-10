import '@testing-library/jest-dom'

// Next.js에 필요한 글로벌 객체들
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// fetch 모킹
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      board: Array(15).fill(null).map(() => Array(15).fill(null)),
      currentPlayer: 'black',
      gameStatus: 'playing'
    })
  })
) as jest.Mock

// matchMedia 모킹
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
