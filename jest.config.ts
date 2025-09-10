import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Next.js app의 경로를 지정
  dir: './',
})

// Jest 커스텀 설정
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)"
  ],
}

// createJestConfig는 Next.js의 설정을 Jest로 변환하기 위해
// 이 설정을 비동기로 내보냅니다.
export default createJestConfig(config)
