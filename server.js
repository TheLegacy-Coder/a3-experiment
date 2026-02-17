import express from "express";
import { MongoClient, ObjectId, Timestamp } from "mongodb";
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

let userId = new ObjectId();

// Correct Answers (used for calculating percentage correct at end of trial)
let correctAnswers = {
    "1900": "Right",
    "1902": "Right",
    "1904": "Right",
    "1906": "Right",
    "1908": "Right",
    "1910": "Right",
    "1912": "Right",
    "1914": "Right",
    "1916": "Right",
    "1918": "Right",
    "1920": "Right",
    "1922": "Right",
    "1924": "Right",
    "1926": "Right",
    "1928": "Right",
    "1930": "Right",
    "1932": "Right",
    "1934": "Left",
    "1936": "Left",
    "1938": "Left",
}


// Keeps track of how many questions user got correct
let correctCount = 0;

// Keep track of average mean for each year
let averages = {
    "1900": 52.76, "2020": 59.36,
    "1902": 47.57, "2018": 53.51,
    "1904": 51.14, "2016": 64.90,
    "1906": 51.71, "2014": 64.53,
    "1908": 44.07, "2012": 55.27,
    "1910": 38.41, "2010": 52.98,
    "1912": 50.22, "2008": 54.28,
    "1914": 49.83, "2006": 54.24,
    "1916": 50.84, "2004": 53.08,
    "1918": 45.85, "2002": 53.20,
    "1920": 51.07, "2000": 69.25,
    "1922": 42.02, "1998": 54.22,
    "1924": 46.57, "1996": 51.88,
    "1926": 43.94, "1994": 52.85,
    "1928": 51.91, "1992": 52.59,
    "1930": 51.97, "1990": 53.50,
    "1932": 51.72, "1988": 52.62,
    "1934": 54.09, "1986": 53.31,
    "1936": 52.14, "1984": 51.97,
    "1938": 62.17, "1982": 51.33,
}

// 1900: 52.76    2020: 54.36  R    -> 2020 +5
// 1902: 51.57    2018: 53.51  R    -> 1902 -4
// 1904: 51.14    2016: 54.90  R    -> 2016 +10
// 1906: 51.71    2014: 52.53  R    -> 2014 +12
// 1908: 52.07    2012: 55.27  R    -> 1908 -8
// 1910: 52.41    2010: 52.98  R    -> 1910 -14
// 1912: 50.22    2008: 52.28  R    -> 2008 +2
// 1914: 51.83    2006: 54.24  R    -> 1914 -2
// 1916: 50.84    2004: 53.08  R    -> Leave as is
// 1918: 51.85    2002: 53.20  R    -> 1918 - 6
// 1920: 51.07    2000: 53.25  R    -> 2000 +16
// 1922: 52.02    1998: 54.22  R    -> 1922 -10
// 1924: 50.57    1996: 51.88  R    -> 1924 -4
// 1926: 51.94    1994: 52.85  R    -> 1926 -8
// 1928: 51.91    1992: 52.59  R    -> 1992 + 3
// 1930: 51.97    1990: 53.50  R    -> Leave as is
// 1932: 51.72    1988: 52.62  R    -> 1988 + 7
// 1934: 54.09    1986: 53.31  L    -> 1986 - 5
// 1936: 52.14    1984: 51.97  L    -> 1984 - 6
// 1938: 53.17    1982: 51.33  L    -> 1938 + 9

// year1
// year2
// year1avg
// year2avg
// barGuess
// lineGuess
// radialGuess

app.post("/submit", async (req, res) => {
    const nextPage = req.body.next_page;
    delete req.body.next_page;
    req.body.year1Avg = averages[req.body.year1];
    req.body.year2Avg = averages[req.body.year2];
    req.body.user_id = userId;

    let barCorrect = req.body.bar_comparison === correctAnswers[req.body.year1];
    let lineCorrect = req.body.line_comparison === correctAnswers[req.body.year1];
    let radialCorrect = req.body.radial_comparison === correctAnswers[req.body.year1];
    req.body.bar_result = barCorrect ? "Correct" : "Incorrect";
    req.body.line_result = lineCorrect ? "Correct" : "Incorrect";
    req.body.radial_result = radialCorrect ? "Correct" : "Incorrect";
    correctCount += barCorrect + lineCorrect + radialCorrect;

    await db.collection("forms").insertOne(req.body);

    console.log(req.body)
    
    if (nextPage) {
        res.redirect(nextPage);
    } else {
        // Change this
        let barComparisonResult = req.body.bar_comparison === "Right" ? 1 : 0;
        let lineComparisonResult = req.body.line_comparison === "Right" ? 1 : 0;
        let radialComparisonResult = req.body.radial_comparison === "Right" ? 1 : 0;
        res.send(`
            Successful Submission! Thank you for participating in our experiment!\n\n
            Your score: ${(correctCount)*100 / 60}%
        `);
    }
})

app.listen(3000, () => {
    console.log("Server running")
})