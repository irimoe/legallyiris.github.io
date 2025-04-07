import type { cc } from 'bun:ffi'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

interface Config {
  workingDirectory: string
  server: {
    port: number
  }
  paths: {
    content: string
    dist: string
    databases: {
      analytics: string
      system: string
    }
  }
  systemAuth: {
    tokenEnvName: string
  }
}

// default config values
const defaultConfig: Config = {
  workingDirectory: process.cwd(),
  server: {
    port: 3000,
  },
  paths: {
    content: './packages/api/content',
    dist: './packages/www/dist',
    databases: {
      analytics: './data/analytics.sqlite',
      system: './data/system.sqlite',
    },
  },
  systemAuth: {
    tokenEnvName: 'SYSTEM_AUTH_TOKEN',
  },
}

export async function loadConfig(configPath?: string): Promise<Config> {
  let config = defaultConfig

  if (configPath) {
    try {
      const configFile = Bun.file(configPath)
      const text = await configFile.text()

      if (configFile.size > 0) {
        const userConfig = JSON.parse(text)
        config = { ...defaultConfig, ...userConfig }
      }
    } catch (error) {
      console.warn(`failed to load config from ${configPath}, using defaults:`)
      console.error(error)
    }
  }

  // ensure database directories exist
  const dbDir = dirname(config.paths.databases.analytics)
  const systemDbDir = dirname(config.paths.databases.system)

  if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true })
  if (!existsSync(systemDbDir) && systemDbDir !== dbDir) mkdirSync(systemDbDir, { recursive: true })

  return config
}

// parse command line args
function parseArgs(): { configPath?: string } {
  const args = process.argv.slice(2)
  let configPath: string | undefined

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && i + 1 < args.length) {
      configPath = args[i + 1]
      i++
    }
  }

  return { configPath }
}

const { configPath } = parseArgs()
export const config = await loadConfig(configPath)
