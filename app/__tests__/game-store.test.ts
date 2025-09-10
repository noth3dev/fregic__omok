import { gameStore, GameState } from '@/app/game-store'

describe('GameStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 게임을 초기화
    gameStore.resetGame()
  })

  it('should initialize with empty board and black as first player', () => {
    const state = gameStore.getState()
    
    // 보드가 비어있는지 확인
    state.board.forEach(row => {
      row.forEach(cell => {
        expect(cell).toBeNull()
      })
    })
    
    // 첫 플레이어가 흑돌인지 확인
    expect(state.currentPlayer).toBe('black')
    
    // 게임 상태가 playing인지 확인
    expect(state.gameStatus).toBe('playing')
  })

  it('should make a valid move', () => {
    const result = gameStore.makeMove(7, 7, 'black')
    const state = gameStore.getState()
    
    expect(result).toBe(true)
    expect(state.board[7][7]).toBe('black')
    expect(state.currentPlayer).toBe('white')
  })

  it('should not allow move on occupied cell', () => {
    gameStore.makeMove(7, 7, 'black')
    const result = gameStore.makeMove(7, 7, 'white')
    
    expect(result).toBe(false)
  })

  it('should not allow move with wrong player', () => {
    const result = gameStore.makeMove(7, 7, 'white') // 첫 턴은 흑돌
    
    expect(result).toBe(false)
  })

  it('should detect horizontal win', () => {
    // 흑돌이 가로로 5개
    gameStore.makeMove(7, 3, 'black')
    gameStore.makeMove(8, 3, 'white')
    gameStore.makeMove(7, 4, 'black')
    gameStore.makeMove(8, 4, 'white')
    gameStore.makeMove(7, 5, 'black')
    gameStore.makeMove(8, 5, 'white')
    gameStore.makeMove(7, 6, 'black')
    gameStore.makeMove(8, 6, 'white')
    gameStore.makeMove(7, 7, 'black')

    const state = gameStore.getState()
    expect(state.gameStatus).toBe('black-wins')
  })

  it('should detect vertical win', () => {
    // 흑돌이 세로로 5개
    gameStore.makeMove(3, 7, 'black')
    gameStore.makeMove(3, 8, 'white')
    gameStore.makeMove(4, 7, 'black')
    gameStore.makeMove(4, 8, 'white')
    gameStore.makeMove(5, 7, 'black')
    gameStore.makeMove(5, 8, 'white')
    gameStore.makeMove(6, 7, 'black')
    gameStore.makeMove(6, 8, 'white')
    gameStore.makeMove(7, 7, 'black')

    const state = gameStore.getState()
    expect(state.gameStatus).toBe('black-wins')
  })

  it('should notify listeners when state changes', () => {
    const listener = jest.fn()
    const unsubscribe = gameStore.subscribe(listener)

    gameStore.makeMove(7, 7, 'black')
    
    expect(listener).toHaveBeenCalled()
    
    unsubscribe()
    gameStore.makeMove(7, 8, 'white')
    
    // 구독 해제 후에는 호출되지 않아야 함
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
