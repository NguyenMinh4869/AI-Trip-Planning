import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'TripWiz',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  // Additional options
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('Current time:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Get database pool for use in other modules
export const getPool = () => pool;

// Close all connections
export const closePool = async () => {
  await pool.end();
};

// Example query functions
export const getUserById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error getting user:', err);
    throw err;
  }
};

export const createUser = async (userData) => {
  try {
    const { email, passwordHash, name, image } = userData;
    const result = await pool.query(
      'INSERT INTO "User" (id, email, "passwordHash", name, image, "emailVerified", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [email, passwordHash, name, image, new Date()]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

export const getTripPlans = async (authorId) => {
  try {
    const result = await pool.query('SELECT * FROM "TripPlan" WHERE "authorId" = $1 ORDER BY "createdAt" DESC', [authorId]);
    return result.rows;
  } catch (err) {
    console.error('Error getting trip plans:', err);
    throw err;
  }
};

export const createTripPlan = async (tripData) => {
  try {
    const { authorId, data, location } = tripData;
    const result = await pool.query(
      'INSERT INTO "TripPlan" (id, "authorId", data, location, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [authorId, data, location]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error creating trip plan:', err);
    throw err;
  }
};

// Export default pool for direct use
export default pool;
