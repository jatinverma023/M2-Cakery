const path = require('path');
const dotenv = require('dotenv');

// Load environment configuration
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { connectDB, disconnectDB } = require('../src/config/db');
const Admin = require('../src/models/Admin');

/**
 * CLI script to seed or update the bakery administrator account.
 *
 * Usage:
 *   node scripts/createAdmin.js <email> <password>
 * Or via environment variables:
 *   ADMIN_EMAIL=admin@m2cakery.com ADMIN_PASSWORD=supersecure node scripts/createAdmin.js
 */
async function run() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = args[1] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Error: Email and password are required.');
    console.error('Usage: node scripts/createAdmin.js <email> <password>');
    console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD in environment variables.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Admin password must be at least 8 characters long.');
    process.exit(1);
  }

  try {
    console.log('[Setup] Connecting to MongoDB...');
    await connectDB();

    const existingAdmin = await Admin.findOne({ email });

    const passwordHash = await Admin.hashPassword(password);

    if (existingAdmin) {
      existingAdmin.passwordHash = passwordHash;
      await existingAdmin.save();
      console.log(`[Setup] Successfully updated password for existing admin: ${email}`);
    } else {
      await Admin.create({
        email,
        passwordHash,
        role: 'admin',
      });
      console.log(`[Setup] Successfully created new administrator: ${email}`);
    }

    await disconnectDB();
    console.log('[Setup] Completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Setup] Failed to create admin:', error.message);
    try {
      await disconnectDB();
    } catch (_) {}
    process.exit(1);
  }
}

run();
