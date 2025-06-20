// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('self-development-app');

// Create a user for the application
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'self-development-app'
    }
  ]
});

// Create initial collections with indexes
db.createCollection('users');
db.createCollection('meals');
db.createCollection('budgets');
db.createCollection('tasks');
db.createCollection('events');
db.createCollection('transactions');
db.createCollection('activities');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.meals.createIndex({ userEmail: 1, date: 1 });
db.budgets.createIndex({ userEmail: 1, month: 1, year: 1 });
db.tasks.createIndex({ userEmail: 1, date: 1 });
db.events.createIndex({ userEmail: 1, date: 1 });
db.transactions.createIndex({ userEmail: 1, date: 1 });
db.activities.createIndex({ userEmail: 1, date: 1 });

print('Database initialization completed successfully!');