import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { OmokGame } from '@/components/omok-game'

// 기본 응답 모킹
const mockResponse = {
  board: Array(15).fill(null).map(() => Array(15).fill(null)),
  currentPlayer: 'black',
  gameStatus: 'playing'
}

// 실제 EventSource를 모킹
class MockEventSource {
  onmessage: ((event: any) => void) | null = null
  close = jest.fn()

  constructor(url: string) {}

  // 테스트용 메서드 추가
  simulateMessage(data: any) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) })
    }
  }
}

// 전역 EventSource를 모킹된 버전으로 교체
(global as any).EventSource = MockEventSource

describe('OmokGame', () => {
  beforeEach(() => {
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
  })

  it('renders game board', async () => {
    render(<OmokGame />)
    
    await waitFor(() => {
      const intersections = screen.getAllByRole('button', { hidden: true })
      // 실제 교차점의 수를 계산 (15x15)
      const actualIntersections = intersections.filter(
        button => button.className.includes('rounded-full')
      )
      expect(actualIntersections).toHaveLength(225)
    })
  })

  it('handles intersection click', async () => {
    render(<OmokGame />)
    
    await waitFor(async () => {
      const intersections = screen.getAllByRole('button', { hidden: true })
      const actualIntersections = intersections.filter(
        button => button.className.includes('rounded-full')
      )

      await act(async () => {
        fireEvent.click(actualIntersections[112]) // 중앙 지점 (7,7)
      })
      
      // API 호출이 올바른 데이터와 함께 이루어졌는지 확인
      expect(fetch).toHaveBeenCalledWith('/api/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row: 7, col: 7, stone: 'black' }),
      })
    })
  })

  it('updates game state when receiving SSE message', async () => {
    render(<OmokGame />)
    
    await act(async () => {
      // 초기 상태 설정
      const eventSource = new MockEventSource('/api/updates')
      eventSource.simulateMessage({
        ...mockResponse,
        currentPlayer: 'white',
        gameStatus: 'playing'
      })
    })

    // 백돌 차례 표시가 보이는지 확인
    const turnIndicator = await screen.findByText('○ 차례')
    expect(turnIndicator).toBeInTheDocument()
  })

  it('shows game result when game is over', async () => {
    render(<OmokGame />)
    
    await act(async () => {
      // 게임 종료 상태 시뮬레이션
      const eventSource = new MockEventSource('/api/updates')
      eventSource.simulateMessage({
        ...mockResponse,
        gameStatus: 'black-wins'
      })
    })

    // 흑돌 승리 메시지가 보이는지 확인
    const winText = await screen.findByText('● 승리!')
    expect(winText).toBeInTheDocument()
  })
})
