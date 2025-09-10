"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

type Stone = "black" | "white" | null
type GameStatus = "playing" | "black-wins" | "white-wins"

const BOARD_SIZE = 15

export function OmokGame() {
  const [board, setBoard] = useState<Stone[][]>(() =>
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"black" | "white">("black")
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")

  const checkWin = useCallback((board: Stone[][], row: number, col: number, stone: Stone): boolean => {
    if (!stone) return false

    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal \
      [1, -1], // diagonal /
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
          board[newRow][newCol] === stone
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
          board[newRow][newCol] === stone
        ) {
          count++
        } else {
          break
        }
      }

      if (count >= 5) return true
    }

    return false
  }, [])

  const handleIntersectionClick = useCallback(
    (row: number, col: number) => {
      if (board[row][col] || gameStatus !== "playing") return

      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = currentPlayer
      setBoard(newBoard)

      if (checkWin(newBoard, row, col, currentPlayer)) {
        setGameStatus(currentPlayer === "black" ? "black-wins" : "white-wins")
      } else {
        setCurrentPlayer(currentPlayer === "black" ? "white" : "black")
      }
    },
    [board, currentPlayer, gameStatus, checkWin],
  )

  const resetGame = useCallback(() => {
    setBoard(
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null)),
    )
    setCurrentPlayer("black")
    setGameStatus("playing")
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        {gameStatus === "playing" ? (
          <div className="text-white/80 text-sm">{currentPlayer === "black" ? "●" : "○"} 차례</div>
        ) : (
          <div className="text-white text-lg font-medium">{gameStatus === "black-wins" ? "● 승리" : "○ 승리"}</div>
        )}
      </div>

      <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-sm border border-white/20">
        {/* Grid lines */}
        <div className="absolute inset-6">
          {/* Vertical lines */}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-white/30"
              style={{ left: `${(i / (BOARD_SIZE - 1)) * 100}%` }}
            />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-white/30"
              style={{ top: `${(i / (BOARD_SIZE - 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* Intersection points */}
        <div className="relative" style={{ width: "420px", height: "420px" }}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
                style={{
                  left: `${(colIndex / (BOARD_SIZE - 1)) * 100}%`,
                  top: `${(rowIndex / (BOARD_SIZE - 1)) * 100}%`,
                }}
                onClick={() => handleIntersectionClick(rowIndex, colIndex)}
                disabled={gameStatus !== "playing"}
              >
                {cell && (
                  <div
                    className={`w-6 h-6 rounded-full ${
                      cell === "black"
                        ? "bg-black border-2 border-white/20 shadow-lg"
                        : "bg-white border-2 border-black/30 shadow-lg"
                    }`}
                  />
                )}
              </button>
            )),
          )}
        </div>
      </div>

      <Button onClick={resetGame} variant="ghost" className="mt-6 text-white/40 hover:text-white/80 text-sm">
        새 게임
      </Button>
    </div>
  )
}
