import { createClient, type InValue } from '@libsql/client/web'
import { Database } from '@sqlitecloud/drivers'
import { getEnv } from '../utils/env';

export default {
    execute: async ({ sql, args }: { sql: string; args?: any[] }) => {
        const sqliteCloudUrl = getEnv("SQLITE_CLOUD_URL")
        const tursoUrl = getEnv("TURSO_SQLITE_URL")
        const tursoToken = getEnv("TURSO_SQLITE_AUTH_TOKEN")
        if (tursoUrl && tursoToken) {
            const turso = createClient({ url: tursoUrl, authToken: tursoToken })
            const result = await turso.execute({ sql, args: args ? (args as InValue[]) : [] })
            await turso.close()
            return { rows: [...result.rows] }
        } else if (sqliteCloudUrl) {
            const sqliteCloud = new Database(sqliteCloudUrl)
            const result = await sqliteCloud.sql(sql, ...(args || []))
            await sqliteCloud.close()
            return { rows: result }
        }
        console.log('No SQLite database configured.')
        return { rows: [] }
    },
}
