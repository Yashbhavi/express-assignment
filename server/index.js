const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require("cors")
const { PubSub } = require('@google-cloud/pubsub');
const path = require('path');

const app = express();
app.use(cors(
    {
    origin: "*",
    methods: ['GET','POST'],
    allowedHeaders: ['Content-Type']
}
))

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

const pubsub = new PubSub();
const redisClient = redis.createClient();
const BUTTON_LIMIT = 10;
const WINDOW_DURATION = 60 * 1000; // 1 minute

const rateLimits = {
    blue: {},
    red: {}
};

const publishRateLimitEvent = async (button, ip) => {
    const topicName = "rate-limit-events";
    const message = { button, ip, timestamp: new Date().toISOString() };
    await pubsub.topic(topicName).publishMessage({ data: Buffer.from(JSON.stringify(message)) });
};

const logClick = async (button, ip) => {
    // Example: log to a database (mocked here)
    console.log(`[LOG] Button: ${button}, IP: ${ip}, Timestamp: ${new Date().toISOString()}`);
};

app.get("/", (req,res) => {
    return res.json({message: "Hello from express-assignment"})
})

app.post('/click', async (req, res) => {
    const { button } = req.body;
    const ip = req.ip;

    if (!['blue', 'red'].includes(button)) {
        return res.status(400).json({ message: 'Invalid button' });
    }

    // Rate Limiting Logic
    const now = Date.now();
    rateLimits[button][ip] = rateLimits[button][ip] || [];
    const timestamps = rateLimits[button][ip].filter(ts => now - ts < WINDOW_DURATION);

    if (timestamps.length >= BUTTON_LIMIT) {
        await publishRateLimitEvent(button, ip);
        return res.status(429).json({ message: `Rate limit reached for ${button} button.` });
    }

    // Update rate limit and log click
    timestamps.push(now);
    rateLimits[button][ip] = timestamps;
    await logClick(button, ip);

    res.json({ message: `${button} button clicked.` });
});

// Fallback for React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(8080, () => console.log('App running on port 8080'));
