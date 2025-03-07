import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT, // Changed from DB_PORT to PGPORT to match your .env file
});

export async function GET() {
  try {
    // Modified query to match your table structure
    // You created a 'files' table, not 'models', and the binary data column is named 'data', not 'file_data'
    const result = await pool.query('SELECT data, filename FROM files WHERE id = $1', [1]);
    
    if (result.rows.length > 0) {
      const modelData = result.rows[0].data;
      const filename = result.rows[0].filename; // Get the actual filename from the database
      
      return new NextResponse(modelData, {
        status: 200,
        headers: {
          'Content-Type': 'model/gltf-binary',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    } else {
      console.log('Model not found');
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
