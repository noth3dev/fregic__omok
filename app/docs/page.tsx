"use client"

import { Button } from "@/components/ui/button"

function CopyButton({ text }: { text: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-white/10"
      onClick={() => {
        navigator.clipboard.writeText(text)
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </Button>
  )
}

function CodeBlock({ code, language = "powershell" }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <pre className="bg-gray-800/70 text-white p-4 rounded-lg mt-2 font-mono text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white/90">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">오목 게임 API 문서</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
            </svg>
            API 엔드포인트
          </h2>
          
          <div className="space-y-8">
            <div className="border border-white/10 p-6 rounded-lg bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-white/90">1. 착수하기 (Move)</h3>
              <div className="text-white/60 space-y-1 mb-4">
                <p className="font-mono bg-white/5 px-2 py-1 rounded inline-block">POST /api/move</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/80 mb-2">요청 본문 (JSON):</p>
                  <CodeBlock code={`{
  "row": number,    // 0-14 사이의 행 번호
  "col": number,    // 0-14 사이의 열 번호
  "stone": "black" | "white"  // 돌의 색
}`} />
                </div>
                <div>
                  <p className="text-sm text-white/80 mb-2">PowerShell 예시:</p>
                  <CodeBlock code={`$body = @{
    row = 7
    col = 7
    stone = "black"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://v0-dddd-kngsn3zpdrl-4y6wucajs-noth3devs-projects.vercel.app/api/move" -Method Post -Body $body -ContentType "application/json"`} />
                </div>
              </div>
            </div>

            <div className="border border-white/10 p-6 rounded-lg bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-white/90">2. 현재 게임 상태 조회</h3>
              <div className="text-white/60 space-y-1 mb-4">
                <p className="font-mono bg-white/5 px-2 py-1 rounded inline-block">GET /api/state</p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-2">PowerShell 예시:</p>
                <CodeBlock code={`Invoke-RestMethod -Uri "https://v0-dddd-kngsn3zpdrl-4y6wucajs-noth3devs-projects.vercel.app/api/state" -Method Get`} />
              </div>
            </div>

            <div className="border border-white/10 p-6 rounded-lg bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-white/90">3. 게임 초기화</h3>
              <div className="text-white/60 space-y-1 mb-4">
                <p className="font-mono bg-white/5 px-2 py-1 rounded inline-block">POST /api/reset</p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-2">PowerShell 예시:</p>
                <CodeBlock code={`Invoke-RestMethod -Uri "https://v0-dddd-kngsn3zpdrl-4y6wucajs-noth3devs-projects.vercel.app/api/reset" -Method Post`} />
              </div>
            </div>

            <div className="border border-white/10 p-6 rounded-lg bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-white/90">4. 실시간 업데이트 (Server-Sent Events)</h3>
              <div className="text-white/60 space-y-1 mb-4">
                <p className="font-mono bg-white/5 px-2 py-1 rounded inline-block">GET /api/updates</p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-2">JavaScript 예시:</p>
                <CodeBlock code={`const eventSource = new EventSource('https://v0-dddd-kngsn3zpdrl-4y6wucajs-noth3devs-projects.vercel.app/api/updates')
eventSource.onmessage = (event) => {
  const state = JSON.parse(event.data)
  // state.board: 현재 바둑판 상태
  // state.currentPlayer: 현재 차례
  // state.gameStatus: 게임 상태
}`} language="javascript" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            게임 규칙
          </h2>
          <ul className="list-none space-y-3 text-white/80">
            <li className="flex items-start gap-2">
              <svg className="mt-1.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill="currentColor" />
              </svg>
              게임은 항상 흑돌(black)이 먼저 시작합니다.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill="currentColor" />
              </svg>
              각자 번갈아가면서 돌을 놓습니다.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill="currentColor" />
              </svg>
              자신의 차례가 아닐 때 착수하면 에러가 발생합니다.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill="currentColor" />
              </svg>
              이미 돌이 놓인 자리에는 착수할 수 없습니다.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-1.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill="currentColor" />
              </svg>
              가로, 세로, 대각선 방향으로 5개의 돌이 연속으로 놓이면 승리합니다.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            응답 형식
          </h2>
          <CodeBlock code={`{
  "board": Stone[][],       // 15x15 배열, 각 칸은 "black" | "white" | null
  "currentPlayer": "black" | "white",  // 현재 차례
  "gameStatus": "playing" | "black-wins" | "white-wins"  // 게임 상태
}`} language="typescript" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            에러 응답
          </h2>
          <div className="space-y-4">
            <p className="text-white/80">에러가 발생하면 400 상태 코드와 함께 자세한 에러 정보가 반환됩니다:</p>
            <CodeBlock code={`{
  "error": "Invalid move",
  "details": {
    "attempted": {
      "row": 7,
      "col": 7,
      "stone": "white"
    },
    "currentState": {
      "currentPlayer": "black",
      "gameStatus": "playing",
      "isOccupied": true
    },
    "reason": "Position is already occupied"
  }
}`} language="json" />
          </div>
        </section>
      </div>
    </div>
  )
}
