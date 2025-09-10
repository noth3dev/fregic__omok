import { NextResponse } from 'next/server'
import { gameStore } from '@/app/game-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST() {
  gameStore.resetGame()
  return NextResponse.json(gameStore.getState())
}
