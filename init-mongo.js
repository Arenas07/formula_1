db.createUser({
  user: 'formula1_user',
  pwd: 'formula1_password',
  roles: [
    {
      role: 'readWrite',
      db: 'formula1_db'
    }
  ]
});

db = db.getSiblingDB('formula1_db');

// Crear colecciones iniciales
db.createCollection('users');
db.createCollection('drivers');
db.createCollection('teams');
db.createCollection('races');

// Crear índices
db.users.createIndex({ "email": 1 }, { unique: true });
db.drivers.createIndex({ "driverNumber": 1 }, { unique: true });
db.teams.createIndex({ "name": 1 }, { unique: true }); 