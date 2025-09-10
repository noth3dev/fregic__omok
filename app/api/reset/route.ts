import { NextResponse } from 'next/server'
import { gameStore } from '@/app/game-store'

export async function POST() {
  gameStore.resetGame()
  return NextResponse.json(gameStore.getState())
}
