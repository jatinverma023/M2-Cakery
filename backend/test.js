const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_m2_cakery_auth_verification_2026';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CLIENT_URL = 'http://localhost:5173';

const app = require('./src/app');
const Admin = require('./src/models/Admin');
const Product = require('./src/models/Product');
const {
  validateImageFile,
  deleteImage,
  deleteMultipleImages,
  uploadImageBuffer,
} = require('./src/services/cloudinaryService');

async function runTestSuite() {
  console.log('====================================================');
  console.log('  M² Cakery V2 — Phase 2 Comprehensive Test Suite  ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // SUITE 1: Health & Security Headers
    console.log('--- SUITE 1: Health & Security Headers ---');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    assert(healthJson.success === true, 'Health check reports success: true');
    assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'Helmet nosniff header present');

    // SUITE 2: Admin Model & Password Security
    console.log('\n--- SUITE 2: Admin Model & Password Security ---');
    const rawPassword = 'SecretPassword123!';
    const hash = await Admin.hashPassword(rawPassword);
    assert(hash && hash.startsWith('$2'), 'Admin.hashPassword produces valid bcrypt hash');
    assert(hash !== rawPassword, 'Password is not stored in plaintext');

    const dummyAdmin = new Admin({
      email: 'owner@m2cakery.com',
      passwordHash: hash,
      role: 'admin',
    });
    const match = await dummyAdmin.comparePassword(rawPassword);
    assert(match === true, 'comparePassword succeeds with correct password');

    const noMatch = await dummyAdmin.comparePassword('WrongPassword!');
    assert(noMatch === false, 'comparePassword rejects incorrect password');

    const serialized = dummyAdmin.toJSON();
    assert(serialized.passwordHash === undefined, 'toJSON strips passwordHash from serialized output');
    assert(serialized.email === 'owner@m2cakery.com', 'toJSON preserves public admin fields');

    // SUITE 3: JWT Generation & Verification
    console.log('\n--- SUITE 3: JWT Generation & Verification ---');
    const validPayload = { id: 'admin123', email: 'owner@m2cakery.com', role: 'admin' };
    const validToken = jwt.sign(validPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(validToken, process.env.JWT_SECRET);
    assert(decoded.email === 'owner@m2cakery.com', 'JWT verifies and decodes valid payload');

    const expiredToken = jwt.sign(validPayload, process.env.JWT_SECRET, { expiresIn: '0s' });
    let expiredRejected = false;
    try {
      jwt.verify(expiredToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') expiredRejected = true;
    }
    assert(expiredRejected, 'Rejects expired JWT token');

    // SUITE 4: Auth Endpoints & Middleware
    console.log('\n--- SUITE 4: Auth Endpoints & Middleware ---');
    const missingRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' }),
    });
    assert(missingRes.status === 400, 'POST /api/auth/login rejects empty email (400)');

    const badEmailRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'notanemail', password: 'password123' }),
    });
    assert(badEmailRes.status === 400, 'POST /api/auth/login rejects malformed email (400)');

    const originalFindOne = Admin.findOne;
    Admin.findOne = async () => null;
    const notFoundLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@m2cakery.com', password: 'password123' }),
    });
    const notFoundLoginJson = await notFoundLoginRes.json();
    assert(notFoundLoginRes.status === 401, 'POST /api/auth/login returns 401 for unknown user');
    assert(notFoundLoginJson.message === 'Invalid email or password', 'Generic error message returned without account disclosure');

    Admin.findOne = async () => dummyAdmin;
    const successLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@m2cakery.com', password: rawPassword }),
    });
    const successLoginJson = await successLoginRes.json();
    assert(successLoginRes.status === 200, 'POST /api/auth/login returns 200 on valid credentials');
    assert(Boolean(successLoginJson.data.token), 'Returns JWT token');
    assert(successLoginJson.data.admin.passwordHash === undefined, 'Does NOT leak passwordHash in login response');
    Admin.findOne = originalFindOne;

    const unauthMeRes = await fetch(`${baseUrl}/api/auth/me`);
    assert(unauthMeRes.status === 401, 'GET /api/auth/me rejects unauthenticated request (401)');

    const authMeRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const authMeJson = await authMeRes.json();
    assert(authMeRes.status === 200, 'GET /api/auth/me accepts valid Bearer token (200)');
    assert(authMeJson.data.admin.email === 'owner@m2cakery.com', 'req.admin attached with authenticated email');

    // SUITE 5: Product Model Validation & Archival
    console.log('\n--- SUITE 5: Product Model Validation & Archival ---');
    const validProd = new Product({
      title: 'Botanical Wedding Cake',
      category: 'wedding',
      description: 'Elegant multi-tier wedding design.',
      pricingType: 'starting_from',
      price: 2500,
      images: [
        { url: 'https://res.cloudinary.com/m2cakery/image/upload/v1/wedding.jpg', isPrimary: true },
      ],
      featured: true,
      published: true,
      archived: false,
    });
    assert(!validProd.validateSync(), 'Valid product model passes validation');

    const invalidCatProd = new Product({
      title: 'Invalid Cake',
      category: 'smartphones',
      pricingType: 'enquire',
    });
    assert(Boolean(invalidCatProd.validateSync()?.errors.category), 'Rejects invalid category enum');

    const invalidPricingProd = new Product({
      title: 'Invalid Cake',
      category: 'birthday',
      pricingType: 'auction',
    });
    assert(Boolean(invalidPricingProd.validateSync()?.errors.pricingType), 'Rejects invalid pricingType enum');

    const missingPriceProd = new Product({
      title: 'Fixed Price Cake',
      category: 'birthday',
      pricingType: 'fixed',
      price: null,
    });
    assert(Boolean(missingPriceProd.validateSync()?.errors.price), 'Requires valid price for fixed pricingType');
    assert(validProd.archived === false, 'archived field defaults to false');

    // SUITE 6: Product API Route Protection & Visibility
    console.log('\n--- SUITE 6: Product API Route Protection & Visibility ---');
    const testId = new mongoose.Types.ObjectId().toString();

    const unauthCreateRes = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Cake', category: 'birthday' }),
    });
    assert(unauthCreateRes.status === 401, 'POST /api/products requires admin authentication (401)');

    const unauthPutRes = await fetch(`${baseUrl}/api/products/${testId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    });
    assert(unauthPutRes.status === 401, 'PUT /api/products/:id requires admin authentication (401)');

    const unauthDelRes = await fetch(`${baseUrl}/api/products/${testId}`, {
      method: 'DELETE',
    });
    assert(unauthDelRes.status === 401, 'DELETE /api/products/:id requires admin authentication (401)');

    const badCreateRes = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({ title: '', category: 'invalid-cat' }),
    });
    assert(badCreateRes.status === 400, 'POST /api/products validates input fields (400)');

    const invalidIdRes = await fetch(`${baseUrl}/api/products/not-a-valid-id`);
    assert(invalidIdRes.status === 400, 'GET /api/products/:id rejects malformed ObjectId (400)');

    const origFindById = Product.findById;
    Product.findById = async () => ({
      _id: testId,
      title: 'Draft Cake',
      category: 'birthday',
      published: false,
      archived: false,
    });
    const publicDraftRes = await fetch(`${baseUrl}/api/products/${testId}`);
    assert(publicDraftRes.status === 404, 'Public user cannot view unpublished product (404)');

    const adminDraftRes = await fetch(`${baseUrl}/api/products/${testId}`, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    assert(adminDraftRes.status === 200, 'Admin with token CAN view unpublished product (200)');

    Product.findById = async () => ({
      _id: testId,
      title: 'Archived Cake',
      category: 'anniversary',
      published: true,
      archived: true,
    });
    const publicArchivedRes = await fetch(`${baseUrl}/api/products/${testId}`);
    assert(publicArchivedRes.status === 404, 'Public user cannot view archived product (404)');
    Product.findById = origFindById;

    // SUITE 7: Cloudinary Service Unit Validation
    console.log('\n--- SUITE 7: Cloudinary Service Unit Validation ---');
    const validFile = { mimetype: 'image/webp', size: 1024 * 500 };
    assert(validateImageFile(validFile) === true, 'validateImageFile accepts valid image/webp file');

    let rejectedType = false;
    try {
      validateImageFile({ mimetype: 'text/html', size: 500 });
    } catch (err) {
      if (err.message.includes('Invalid image type')) rejectedType = true;
    }
    assert(rejectedType, 'validateImageFile rejects non-image mime types');

    let rejectedSize = false;
    try {
      validateImageFile({ mimetype: 'image/jpeg', size: 6 * 1024 * 1024 });
    } catch (err) {
      if (err.message.includes('exceeds the maximum allowed size')) rejectedSize = true;
    }
    assert(rejectedSize, 'validateImageFile rejects files larger than 5MB');

    const emptyDelResult = await deleteImage('');
    assert(emptyDelResult.success === true, 'deleteImage handles empty publicId safely without throwing');

    const multiDelResult = await deleteMultipleImages([]);
    assert(Array.isArray(multiDelResult) && multiDelResult.length === 0, 'deleteMultipleImages handles empty array safely');

    let unconfiguredUploadRejected = false;
    try {
      await uploadImageBuffer(Buffer.from('fake-image-bytes'));
    } catch (err) {
      if (err.message.includes('Cloudinary is not configured') || err.message.includes('upload failed')) {
        unconfiguredUploadRejected = true;
      }
    }
    assert(unconfiguredUploadRejected, 'uploadImageBuffer fails gracefully with clear error when Cloudinary is not configured');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n====================================================`);
    console.log(`  Phase 2 Test Summary: ${passed} Passed, ${failed} Failed  `);
    console.log(`====================================================`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTestSuite();
