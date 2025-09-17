"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Prism.js syntax highlighting
function PrismCodeBlock({ code, language = "powershell" }: { code: string; language?: string }) {
  useEffect(() => {
    // Load Prism.js dynamically
    const loadPrism = async () => {
      try {
        if (typeof window !== "undefined" && !(window as any).Prism) {
          // @ts-ignore - prismjs has no bundled types in this project
          const PrismModule = await import("prismjs")
          const Prism = (PrismModule as any).default || PrismModule

          // @ts-ignore - language components don't ship types here
          await import("prismjs/components/prism-json")
          // @ts-ignore
          await import("prismjs/components/prism-javascript")
          // @ts-ignore
          await import("prismjs/components/prism-python")
          // @ts-ignore
          await import("prismjs/components/prism-csharp")
          // @ts-ignore
          await import("prismjs/components/prism-go")
          // @ts-ignore
          await import("prismjs/components/prism-typescript")
          // @ts-ignore
          await import("prismjs/components/prism-powershell")
          ;(window as any).Prism = Prism

          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            if (Prism && typeof Prism.highlightAll === "function") {
              Prism.highlightAll()
            }
          }, 0)
        } else if ((window as any).Prism && typeof (window as any).Prism.highlightAll === "function") {
          setTimeout(() => {
            ;(window as any).Prism.highlightAll()
          }, 0)
        }
      } catch (error) {
        console.error("Failed to load Prism.js:", error)
      }
    }
    loadPrism()
  }, [code, language])

  return (
    <div className="relative group">
      <pre
        className={`language-${language} bg-zinc-900/90 backdrop-blur-sm border border-white/10 rounded-lg p-4 overflow-x-auto text-sm`}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleCopy}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      )}
    </Button>
  )
}

function TableOfContents() {
  const [activeSection, setActiveSection] = useState("")

  const sections = [
    { id: "endpoints", title: "API 엔드포인트" },
    { id: "rules", title: "게임 규칙" },
    { id: "response-format", title: "응답 형식" },
    { id: "response-examples", title: "응답 예시" },
    { id: "language-examples", title: "언어별 예시" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]")
      let current = ""

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100) {
          current = section.getAttribute("data-section") || ""
        }
      })

      setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.querySelector(`[data-section="${id}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 w-64 bg-zinc-900 border border-zinc-700 rounded-lg p-4 hidden xl:block shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">목차</h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeSection === section.id ? "bg-white text-black" : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function DocsPage() {
  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />

      <div className="min-h-screen bg-zinc-900 text-white">
        <TableOfContents />

        <div className="container mx-auto p-8 xl:ml-80 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">오목 게임 API 문서</h1>
            <p className="text-xl text-zinc-300">실시간 오목 게임을 위한 RESTful API</p>
          </div>

          <section className="mb-16" data-section="endpoints">
            <h2 className="text-3xl font-semibold mb-8 text-white">API 엔드포인트</h2>

            <div className="space-y-8">
              <div className="border border-zinc-700 p-8 rounded-xl bg-zinc-800">
                <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                  <span className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  착수하기 (Move)
                </h3>
                <div className="text-zinc-300 space-y-1 mb-6">
                  <p className="font-mono bg-zinc-700 px-3 py-2 rounded-lg inline-block text-white border border-zinc-600">
                    POST /api/move
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-zinc-200 mb-3 font-semibold">요청 본문 (JSON):</p>
                    <PrismCodeBlock
                      language="json"
                      code={`{
  "row": number,    // 0-14 사이의 행 번호
  "col": number,    // 0-14 사이의 열 번호
  "stone": "black" | "white"  // 돌의 색
}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-200 mb-3 font-semibold">PowerShell 예시:</p>
                    <PrismCodeBlock
                      language="powershell"
                      code={`$body = @{
    row = 7
    col = 7
    stone = "black"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://omok.ntbl.me/api/move" -Method Post -Body $body -ContentType "application/json"`}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-zinc-700 p-8 rounded-xl bg-zinc-800">
                <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                  <span className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  현재 게임 상태 조회
                </h3>
                <div className="text-zinc-300 space-y-1 mb-6">
                  <p className="font-mono bg-zinc-700 px-3 py-2 rounded-lg inline-block text-white border border-zinc-600">
                    GET /api/state
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 mb-3 font-semibold">PowerShell 예시:</p>
                  <PrismCodeBlock
                    language="powershell"
                    code={`Invoke-RestMethod -Uri "https://omok.ntbl.me/api/state" -Method Get`}
                  />
                </div>
              </div>

              <div className="border border-zinc-700 p-8 rounded-xl bg-zinc-800">
                <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                  <span className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  게임 초기화
                </h3>
                <div className="text-zinc-300 space-y-1 mb-6">
                  <p className="font-mono bg-zinc-700 px-3 py-2 rounded-lg inline-block text-white border border-zinc-600">
                    POST /api/reset
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 mb-3 font-semibold">PowerShell 예시:</p>
                  <PrismCodeBlock
                    language="powershell"
                    code={`Invoke-RestMethod -Uri "https://omok.ntbl.me/api/reset" -Method Post`}
                  />
                </div>
              </div>

              <div className="border border-zinc-700 p-8 rounded-xl bg-zinc-800">
                <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                  <span className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  실시간 업데이트 (Server-Sent Events)
                </h3>
                <div className="text-zinc-300 space-y-1 mb-6">
                  <p className="font-mono bg-zinc-700 px-3 py-2 rounded-lg inline-block text-white border border-zinc-600">
                    GET /api/updates
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 mb-3 font-semibold">JavaScript 예시:</p>
                  <PrismCodeBlock
                    language="javascript"
                    code={`const eventSource = new EventSource('https://omok.ntbl.me/api/updates')
eventSource.onmessage = (event) => {
  const state = JSON.parse(event.data)
  // state.board: 현재 바둑판 상태
  // state.currentPlayer: 현재 차례
  // state.gameStatus: 게임 상태
}`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16" data-section="rules">
            <h2 className="text-3xl font-semibold mb-8 text-white">게임 규칙</h2>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
              <ul className="list-none space-y-4 text-zinc-200">
                {[
                  "게임은 항상 흑돌(black)이 먼저 시작합니다.",
                  "각자 번갈아가면서 돌을 놓습니다.",
                  "자신의 차례가 아닐 때 착수하면 에러가 발생합니다.",
                  "이미 돌이 놓인 자리에는 착수할 수 없습니다.",
                  "가로, 세로, 대각선 방향으로 5개의 돌이 연속으로 놓이면 승리합니다.",
                ].map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-lg">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-16" data-section="response-format">
            <h2 className="text-3xl font-semibold mb-8 text-white">응답 형식</h2>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
              <PrismCodeBlock
                language="typescript"
                code={`{
  "board": Stone[][],       // 15x15 배열, 각 칸은 "black" | "white" | null
  "currentPlayer": "black" | "white",  // 현재 차례
  "gameStatus": "playing" | "black-wins" | "white-wins"  // 게임 상태
}`}
              />
            </div>
          </section>

          <section className="mb-16" data-section="response-examples">
            <h2 className="text-3xl font-semibold mb-8 text-white">응답 예시</h2>
            <div className="space-y-8">
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">✅ 성공 응답</h3>
                <p className="text-zinc-300 mb-4">GET /api/state의 응답 예시:</p>
                <PrismCodeBlock
                  language="json"
                  code={`{
  "board": [
    [null, null, null, "black", null, ...],  // 15x15 배열
    [null, "white", null, null, null, ...],
    // ... 나머지 행들
  ],
  "currentPlayer": "black",  // 현재 차례
  "gameStatus": "playing"    // 게임 상태
}`}
                />
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">❌ 에러 응답</h3>
                <p className="text-zinc-300 mb-4">
                  에러가 발생하면 400 상태 코드와 함께 자세한 에러 정보가 반환됩니다:
                </p>
                <PrismCodeBlock
                  language="json"
                  code={`{
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
}`}
                />
              </div>
            </div>
          </section>

          <section className="mb-16" data-section="language-examples">
            <h2 className="text-3xl font-semibold mb-8 text-white">다양한 언어 예시</h2>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
              <Tabs defaultValue="python" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-zinc-700 border border-zinc-600 p-1 rounded-lg mb-6">
                  <TabsTrigger
                    value="python"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-300"
                  >
                    Python
                  </TabsTrigger>
                  <TabsTrigger
                    value="javascript"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-300"
                  >
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="csharp"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-300"
                  >
                    C#
                  </TabsTrigger>
                  <TabsTrigger
                    value="go"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-300"
                  >
                    Go
                  </TabsTrigger>
                  <TabsTrigger
                    value="powershell"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-300"
                  >
                    PowerShell
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="python" className="space-y-4">
                  <PrismCodeBlock
                    language="python"
                    code={`import requests
import json
import sseclient

# 게임 상태 조회
response = requests.get('https://omok.ntbl.me/api/state')
state = response.json()
print(f"현재 차례: {state['currentPlayer']}")

# 돌 놓기
move = {
    'row': 7,
    'col': 7,
    'stone': 'black'
}
response = requests.post(
    'https://omok.ntbl.me/api/move',
    json=move
)
result = response.json()

# 실시간 업데이트 (SSE)
def handle_event(event):
    state = json.loads(event.data)
    print(f"새로운 상태: {state}")

url = 'https://omok.ntbl.me/api/updates'
client = sseclient.SSEClient(url)
for event in client.events():
    handle_event(event)`}
                  />
                </TabsContent>

                <TabsContent value="javascript" className="space-y-4">
                  <PrismCodeBlock
                    language="javascript"
                    code={`// 게임 상태 조회
async function getGameState() {
  const response = await fetch('https://omok.ntbl.me/api/state');
  const state = await response.json();
  console.log('현재 차례:', state.currentPlayer);
}

// 돌 놓기
async function makeMove(row, col, stone) {
  const response = await fetch('https://omok.ntbl.me/api/move', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ row, col, stone })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('착수 실패:', error);
    return;
  }
  
  const result = await response.json();
  console.log('새로운 상태:', result);
}

// 실시간 업데이트
const eventSource = new EventSource('https://omok.ntbl.me/api/updates');
eventSource.onmessage = (event) => {
  const state = JSON.parse(event.data);
  console.log('상태 업데이트:', state);
};`}
                  />
                </TabsContent>

                <TabsContent value="csharp" className="space-y-4">
                  <PrismCodeBlock
                    language="csharp"
                    code={`using System.Net.Http;
using System.Text.Json;

class OmokClient
{
    private readonly HttpClient _client = new HttpClient();
    private readonly string _baseUrl = "https://omok.ntbl.me";

    // 게임 상태 조회
    public async Task<GameState> GetGameState()
    {
        var response = await _client.GetStringAsync($"{_baseUrl}/api/state");
        return JsonSerializer.Deserialize<GameState>(response);
    }

    // 돌 놓기
    public async Task<GameState> MakeMove(int row, int col, string stone)
    {
        var move = new { row, col, stone };
        var content = new StringContent(
            JsonSerializer.Serialize(move),
            System.Text.Encoding.UTF8,
            "application/json"
        );
        
        var response = await _client.PostAsync($"{_baseUrl}/api/move", content);
        var result = await response.Content.ReadAsStringAsync();
        
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Failed to make move: {result}");
        }
        
        return JsonSerializer.Deserialize<GameState>(result);
    }
}

public class GameState
{
    public string[][] Board { get; set; }
    public string CurrentPlayer { get; set; }
    public string GameStatus { get; set; }
}`}
                  />
                </TabsContent>

                <TabsContent value="go" className="space-y-4">
                  <PrismCodeBlock
                    language="go"
                    code={`package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type GameState struct {
    Board         [][]string \`json:"board"\`
    CurrentPlayer string    \`json:"currentPlayer"\`
    GameStatus    string    \`json:"gameStatus"\`
}

type Move struct {
    Row   int    \`json:"row"\`
    Col   int    \`json:"col"\`
    Stone string \`json:"stone"\`
}

func getGameState() (*GameState, error) {
    resp, err := http.Get("https://omok.ntbl.me/api/state")
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var state GameState
    if err := json.NewDecoder(resp.Body).Decode(&state); err != nil {
        return nil, err
    }
    return &state, nil
}

func makeMove(row, col int, stone string) (*GameState, error) {
    move := Move{Row: row, Col: col, Stone: stone}
    payload, err := json.Marshal(move)
    if err != nil {
        return nil, err
    }

    resp, err := http.Post(
        "https://omok.ntbl.me/api/move",
        "application/json",
        bytes.NewBuffer(payload),
    )
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("failed to make move: %s", resp.Status)
    }

    var state GameState
    if err := json.NewDecoder(resp.Body).Decode(&state); err != nil {
        return nil, err
    }
    return &state, nil
}`}
                  />
                </TabsContent>

                <TabsContent value="powershell" className="space-y-4">
                  <PrismCodeBlock
                    language="powershell"
                    code={`# 게임 상태 조회
$state = Invoke-RestMethod -Uri "https://omok.ntbl.me/api/state" -Method Get
Write-Host "현재 차례: $($state.currentPlayer)"

# 돌 놓기
$moveBody = @{
    row = 7
    col = 7
    stone = "black"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "https://omok.ntbl.me/api/move" -Method Post -Body $moveBody -ContentType "application/json"
    Write-Host "착수 성공: $($result | ConvertTo-Json)"
} catch {
    Write-Error "착수 실패: $($_.Exception.Message)"
}

# 게임 초기화
Invoke-RestMethod -Uri "https://omok.ntbl.me/api/reset" -Method Post`}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
