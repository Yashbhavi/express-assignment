const express = require('express');
const bodyParser = require('body-parser');
const { PubSub } = require('@google-cloud/pubsub');
// const { Firestore } = require("@google-cloud/firestore")
const dotenv = require("dotenv")

dotenv.config()

const PORT = process.env.PORT || 8080
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (adjust as needed)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // If you want to allow cookies
    if (req.method === 'OPTIONS') {
        console.log("INSIDE SET HEADERS================================")
      return res.status(200).end(); // Respond to preflight request
    }
    next();
  });

app.use(bodyParser.json());

// const db = new Firestore({
//     projectId: 'assignment-444606',
//     keyFilename: path.join(__dirname,'./keys/service-account.json'),
//   });

const pubsub = new PubSub();
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
    // const docRef = db.collection('button_clicks').doc(`button_${button}_${ip}`);
    // await docRef.set({
    //     buttonColor: button,
    //     ipAddress: ip,
    //     timestamps: Firestore.FieldValue.serverTimestamp(),
    // });

    console.log(`[LOG] Button: ${button}, IP: ${ip}, Timestamp: ${new Date().toISOString()}`);
};

app.get("/", (req,res) => {
    return res.json({message: "Hello from express-assignment"})
})

app.post('/click', async (req, res) => {
    const { button } = req.body;
    const ip = req.socket.remoteAddress

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

    console.log("[LOG] Inside CLICK APi ------------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    res.json({ message: `${button} button clicked.` });
});

app.get("/hello", (req,res) => {
    res.json({message: "Hello from updated code in Node JS", data: ["1","2","3","4"]})
    console.log("INSIDE NEW HELLO POST API-----------------------------")
})

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
