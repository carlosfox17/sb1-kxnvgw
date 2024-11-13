import express from 'express';
import cors from 'cors';
import { readDb, writeDb } from './src/server/utils/db.js';
import emailRoutes from './src/server/routes/email.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/smtp', emailRoutes);

// Basic CRUD endpoints
app.get('/:resource', (req, res) => {
  try {
    const db = readDb();
    const data = db[req.params.resource];
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    console.error('Error reading resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/:resource', (req, res) => {
  try {
    const db = readDb();
    const resource = req.params.resource;
    if (!db[resource]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    const newItem = { id: Date.now().toString(), ...req.body };
    db[resource].push(newItem);
    writeDb(db);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/:resource/:id', (req, res) => {
  try {
    const db = readDb();
    const { resource, id } = req.params;
    if (!db[resource]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const index = db[resource].findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db[resource][index] = { ...db[resource][index], ...req.body };
    writeDb(db);
    res.json(db[resource][index]);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/:resource/:id', (req, res) => {
  try {
    const db = readDb();
    const { resource, id } = req.params;
    if (!db[resource]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const index = db[resource].findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db[resource].splice(index, 1);
    writeDb(db);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});