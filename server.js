const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

/*
    Render apna PORT automatically deta hai.
    Local computer par 3000 use hoga.
*/
const PORT = process.env.PORT || 3000;

console.log("=================================");
console.log("🔧 Starting Minecraft Toolkit...");
console.log("=================================");

/*
    Check API key
*/
if (!process.env.OPENAI_API_KEY) {
    console.log("❌ OPENAI_API_KEY is missing!");
} else {
    console.log("✅ OpenAI API key found");
}

/*
    OpenAI client
*/
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000
});

/*
    JSON requests
*/
app.use(express.json());

/*
    CORS
    Allows your GitHub Pages website to
    communicate with this backend.
*/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

/*
    Serve website files
    This also allows the project to work locally.
*/
app.use(express.static(__dirname));

/*
    Home route
*/
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/*
    AI API
*/
app.post("/api/ask", async (req, res) => {

    console.log("");
    console.log("=================================");
    console.log("📨 AI REQUEST RECEIVED");
    console.log("=================================");

    try {

        const question = req.body.question;

        console.log("Question:", question);

        /*
            Validate question
        */
        if (
            !question ||
            typeof question !== "string" ||
            question.trim() === ""
        ) {
            console.log("❌ Empty question");

            return res.status(400).json({
                error: "Question is required."
            });
        }

        console.log("🤖 Sending request to OpenAI...");

        /*
            OpenAI Responses API
        */
        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            instructions:
                "You are a helpful Minecraft assistant. " +
                "Answer Minecraft questions clearly and simply. " +
                "Help with Minecraft gameplay, crafting, commands, " +
                "mobs, blocks, items, Redstone, farms, survival tips, " +
                "enchantments and Minecraft mechanics. " +
                "Keep answers easy for a beginner to understand.",

            input: question
        });

        console.log("✅ OpenAI response received!");

        const answer =
            response.output_text ||
            "Sorry, I could not generate an answer.";

        console.log(
            "Answer length:",
            answer.length
        );

        /*
            Send answer to website
        */
        res.json({
            answer: answer
        });

    } catch (error) {

        console.log("");
        console.log("❌❌❌ AI ERROR ❌❌❌");
        console.error(error);
        console.log("❌❌❌ END ERROR ❌❌❌");
        console.log("");

        res.status(500).json({
            error:
                error.message ||
                "AI request failed."
        });
    }
});

/*
    Start server
*/
app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("=================================");
    console.log("🎮 MINECRAFT TOOLKIT STARTED");
    console.log("=================================");
    console.log(
        "🌐 Server running on port:",
        PORT
    );
    console.log("=================================");
    console.log("");
});