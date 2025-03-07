const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// PostgreSQL connection configuration
const client = new Client({
  user: process.env.USER, // Using your macOS username since 'postgres' user doesn't exist
  host: 'localhost',
  database: 'glbfiles', // This database will need to be created first
  password: 'ashish', // Your password
  port: 5432,
});

async function uploadGlbFile(filePath) {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to PostgreSQL database');
    
    // Read the .glb file
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    // Insert the file into the database
    const query = {
      text: 'INSERT INTO files(filename, filetype, data) VALUES($1, $2, $3) RETURNING id',
      values: [fileName, '.glb', fileContent],
    };
    
    const result = await client.query(query);
    console.log(`File uploaded successfully with ID: ${result.rows[0].id}`);
    
  } catch (error) {
    console.error('Error uploading file:', error);
  } finally {
    // Close the database connection
    await client.end();
    console.log('Database connection closed');
  }
}

// Path to your .glb file in the local repository
const glbFilePath = path.join(__dirname, 'public', 'multiPlantSceneCompress.glb');

// Upload the file
uploadGlbFile(glbFilePath);
