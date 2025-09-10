type Stone = "black" | "white" | null
type GameStatus = "playing" | "black-wins" | "white-wins"

export type GameState = {
  board: Stone[][]
  currentPlayer: "black" | "white"
  gameStatus: GameStatus
}

const BOARD_SIZE = 15

class GameStore {
  private state: GameState
  private listeners: ((state: GameState) => void)[] = []

  constructor() {
    this.state = {
      board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)),
      currentPlayer: "black",
      gameStatus: "playing"
    }
  }

  getState(): GameState {
    return JSON.parse(JSON.stringify(this.state)) // Deep clone to prevent mutations
  }

  subscribe(listener: (state: GameState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    const state = this.getState()
    this.listeners.forEach(listener => listener(state))
  }

  makeMove(row: number, col: number, stone: "black" | "white"): boolean {
    if (
      this.state.gameStatus !== "playing" ||
      this.state.board[row][col] !== null ||
      stone !== this.state.currentPlayer
    ) {
      return false
    }

    // Make the move
    const newBoard = this.state.board.map(r => [...r])
    newBoard[row][col] = stone

    // Update state with next player's turn
    const nextPlayer = stone === "black" ? "white" : "black"
    this.state = {
      ...this.state,
      board: newBoard,
      currentPlayer: nextPlayer,
    }

    // Check for win
    if (this.checkWin(row, col, stone)) {
      this.state.gameStatus = stone === "black" ? "black-wins" : "white-wins"
    }

    this.notifyListeners()
    return true
  }

  resetGame() {
    this.state = {
      board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)),
      currentPlayer: "black",
      gameStatus: "playing"
    }
    this.notifyListeners()
  }

  private checkWin(row: number, col: number, stone: Stone): boolean {
    if (!stone) return false

    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1],  // diagonal /
    ]

    for (const [dx, dy] of directions) {
      let count = 1

      // Check positive direction
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (
          newRow >= 0 &&
          newRow < BOARD_SIZE &&
          newCol >= 0 &&
          newCol < BOARD_SIZE &&
          this.state.board[newRow][newCol] === stone
        ) {
          count++
        } else {
          break
        }
      }

      // Check negative direction
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (
          newRow >= 0 &&
          newRow < BOARD_SIZE &&
          newCol >= 0 &&
          newCol < BOARD_SIZE &&
          this.state.board[newRow][newCol] === stone
        ) {
          count++
        } else {
          break
        }
      }

      if (count >= 5) return true
    }

    return false
  }
}

// Export a singleton instance
export const gameStore = new GameStore()
