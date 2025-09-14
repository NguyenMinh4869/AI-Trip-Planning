import { testConnection, closePool } from './src/lib/database.js';

console.log('🔄 Testing database connection...');
console.log('Database: TripWiz');
console.log('Host: localhost:5432');
console.log('User: postgres');
console.log('');

// Test connection
testConnection().then((success) => {
  if (success) {
    console.log('');
    console.log('✅ Database setup completed successfully!');
    console.log('You can now use the database in your application.');
  } else {
    console.log('');
    console.log('❌ Database connection failed.');
    console.log('Please check your PostgreSQL configuration and .env file.');
  }
  
  // Close connection
  closePool().then(() => {
    console.log('Database connection closed.');
    process.exit(success ? 0 : 1);
  });
});
