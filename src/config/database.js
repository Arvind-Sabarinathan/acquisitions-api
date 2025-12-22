import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure Neon based on environment
if (process.env.NODE_ENV === 'development') {
  // Neon Local configuration (HTTP-only, no WebSockets)
  // Detect if running in Docker (neon-local service) or locally (localhost)
  const isDocker = process.env.DATABASE_URL?.includes('neon-local');
  const host = isDocker ? 'neon-local' : 'localhost';

  neonConfig.fetchEndpoint = `http://${host}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;

  console.log(
    `[Database] Running in DEVELOPMENT mode with Neon Local at ${host}`
  );
} else {
  // Production: Use default Neon Cloud settings (HTTPS + WebSockets)
  console.log('[Database] Running in PRODUCTION mode with Neon Cloud');
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { sql, db };
