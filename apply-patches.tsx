import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const redisWorkersType = join('node_modules', 'redis-on-workers', 'dist', 'index.d.ts')

if (existsSync(redisWorkersType)) {
  const content = readFileSync(redisWorkersType, 'utf8')
  if (!content.includes('export declare class RedisInstance')) writeFileSync(redisWorkersType, content.replace('declare class RedisInstance', 'export declare class RedisInstance'))
} else console.log(`Warning: Could not find Redis workers type definition at ${redisWorkersType}`)
