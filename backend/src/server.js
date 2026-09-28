const path = require('path');
const dotenv = require('dotenv');

// Load environment configuration from backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

let server;

/**
 * Server startup lifecycle.
 * Enforces sequential startup:
 * 1. Connects to database
 * 2. Starts HTTP server on success
 * 3. Registers graceful shutdown handlers
 */
async function startServer() {
  try {
    console.log(`[Server] Starting M² Cakery Backend in ${NODE_ENV} mode...`);

    // 1. Establish Database Connection First
    await connectDB();

    // 2. Start HTTP Server
    server = app.listen(PORT, () => {
      console.log(`[Server] M² Cakery API running on port ${PORT}`);
      console.log(`[Server] Health Check: http://localhost:${PORT}/api/health`);
    });

    // 3. Graceful Shutdown Handlers
    const handleShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);

      if (server) {
        server.close(async () => {
          console.log('[Server] HTTP server stopped accepting connections.');
          try {
            await disconnectDB();
            console.log('[Server] Graceful shutdown completed cleanly.');
            process.exit(0);
          } catch (dbErr) {
            console.error('[Server] Error during database disconnect:', dbErr.message);
            process.exit(1);
          }
        });

        // Safety timeout to force exit if closing hangs
        setTimeout(() => {
          console.error('[Server] Shutdown timed out. Forcing termination.');
          process.exit(1);
        }, 10000).unref();
      } else {
        process.exit(0);
      }
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('[Server] Fatal startup failure:', error.message);
    process.exit(1);
  }
}

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();
