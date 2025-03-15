import { building } from '$app/environment'
import { env } from '$env/dynamic/private'

export function getEnv(name: string, event?: any) {
  return event?.platform?.env?.[name] || process.env[name] || (building ? 'tmp_build_value' : env[name])
}
