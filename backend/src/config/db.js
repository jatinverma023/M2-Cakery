const mongoose = require('mongoose');

/**
 * Connect to MongoDB database using Mongoose.
 * Centralizes connection configuration and graceful lifecycle logging.
 *
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MongoDB connection failed: MONGODB_URI is not defined in environment variables. Please set MONGODB_URI in your .env file.'
    );
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    // Safely log connected host without leaking user credentials or connection string
    const host = conn.connection.host || 'unknown-host';
    const dbName = conn.connection.name || 'default';
    console.log(`[Database] MongoDB connected successfully to host: ${host} (db: ${dbName})`);

    // Handle connection events after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected.');
    });

    return conn.connection;
  } catch (error) {
    // Sanitize error message to avoid printing connection string credentials
    console.error(`[Database] MongoDB connection error: ${error.message}`);
    throw error;
  }
}

/**
 * Disconnect from MongoDB database.
 * Used for graceful shutdown and automated testing teardown.
 *
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(false);
    console.log('[Database] MongoDB connection closed cleanly.');
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};
