

// server.js
const express = require('express');
const Redis = require('ioredis');
const promClient = require('prom-client');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

const app = express();
const port = 3000;

// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// Create Prometheus counter for HTTP requests
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Sample route to interact with Redis
app.get('/cache', async (req, res) => {
  try {
    const cacheKey = 'cacheTime';
    const cachedTime = await redis.get(cacheKey);

    if (cachedTime) {
      res.send(`Cache hit: ${cachedTime}`);
    } else {
      const currentTime = new Date().toISOString();
      await redis.set(cacheKey, currentTime);
      res.send(`Cache miss: ${currentTime}`);
    }
  } catch (error) {
    console.error('Redis interaction error:', error);
    res.status(500).send('Redis error');
  }
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});

// Basic route for testing
app.get('/', (req, res) => {
  httpRequestCounter.inc(); // Increment the HTTP request counter
  res.send('Hello, world!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
