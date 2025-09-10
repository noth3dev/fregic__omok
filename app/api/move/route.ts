import { NextRequest, NextResponse } from 'next/server'
import { gameStore } from '@/app/game-store'

type Stone = "black" | "white"

export async function POST(request: NextRequest) {
  try {
    const { row, col, stone } = await request.json()

    // Validate input
    if (
      typeof row !== 'number' || 
      typeof col !== 'number' ||
      row < 0 || 
      row >= 15 || 
      col < 0 || 
      col >= 15
    ) {
      return NextResponse.json(
        { 
          error: 'Invalid row or col value',
          details: {
            row,
            col,
            validRange: '0-14',
            receivedTypes: {
              row: typeof row,
              col: typeof col
            }
          }
        }, 
        { status: 400 }
      )
    }

    // Validate stone color
    if (stone !== 'black' && stone !== 'white') {
      return NextResponse.json(
        { 
          error: 'Stone must be either "black" or "white"',
          details: {
            receivedValue: stone,
            allowedValues: ['black', 'white']
          }
        },
        { status: 400 }
      )
    }

    // Get current state before move
    const currentState = gameStore.getState()

    // Try to make the move
    if (!gameStore.makeMove(row, col, stone)) {
      return NextResponse.json(
        { 
          error: 'Invalid move',
          details: {
            attempted: {
              row,
              col,
              stone
            },
            currentState: {
              currentPlayer: currentState.currentPlayer,
              gameStatus: currentState.gameStatus,
              isOccupied: currentState.board[row][col] !== null
            },
            reason: currentState.gameStatus !== 'playing' 
              ? 'Game is already finished'
              : currentState.board[row][col] !== null
                ? 'Position is already occupied'
                : stone !== currentState.currentPlayer
                  ? `Not your turn (current turn: ${currentState.currentPlayer})`
                  : 'Unknown error'
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json(gameStore.getState())
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
