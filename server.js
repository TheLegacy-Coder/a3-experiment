import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let client = new MongoClient(process.env.URI);
await client.connect();
let db = client.db("formDB");


app.post("/submit", async (req, res) => {
    await db.collection("forms").insertOne(req.body);
    res.send("Successful Submission");
})

app.listen(3000, () => {
    console.log("Server running")
})