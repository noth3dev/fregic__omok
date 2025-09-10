import { NextResponse } from 'next/server'
import { gameStore } from '@/app/game-store'

export function GET() {
  return NextResponse.json(gameStore.getState())
}
