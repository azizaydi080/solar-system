const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// ✅ MongoDB Connection (Fixed)
async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/testdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if connection fails
    }
}
connectDB();

// ✅ Define Schema and Model
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const PlanetModel = mongoose.model('planets', dataSchema);

// ✅ API Endpoints
app.post('/planet', async function(req, res) {
    try {
        const planetData = await PlanetModel.findOne({ id: req.body.id });

        if (!planetData) {
            return res.status(404).send("Error: Planet not found (Choose 0 - 9)");
        }

        res.json(planetData);
    } catch (err) {
        console.error("Error fetching planet data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/os', function(req, res) {
    res.json({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV || "development"
    });
});

app.get('/live', function(req, res) {
    res.json({ "status": "live" });
});

app.get('/ready', function(req, res) {
    res.json({ "status": "ready" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
