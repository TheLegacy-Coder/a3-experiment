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

// 1900: 52.76    2020: 54.36  R
// 1902: 51.57    2018: 53.51  R
// 1904: 51.14    2016: 54.90  R
// 1906: 51.71    2014: 52.53  R
// 1908: 52.07    2012: 55.27  R
// 1910: 52.41    2010: 52.98  R
// 1912: 50.22    2008: 52.28  R
// 1914: 51.83    2006: 54.24  R
// 1916: 50.84    2004: 53.08  R
// 1918: 51.85    2002: 53.20  R
// 1920: 51.07    2000: 53.25  R
// 1922: 52.02    1998: 54.22  R
// 1924: 50.57    1996: 51.88  R
// 1926: 51.94    1994: 52.85  R
// 1928: 51.91    1992: 52.59  R
// 1930: 51.97    1990: 53.50  R
// 1932: 51.72    1988: 52.62  R
// 1934: 54.09    1986: 53.31  L
// 1936: 52.14    1984: 51.97  L
// 1938: 53.17    1982: 51.33  L 


app.post("/submit", async (req, res) => {
    const nextPage = req.body.next_page;
    delete req.body.next_page;
    console.log(req.body)
    await db.collection("forms").insertOne(req.body);
    
    if (nextPage) {
        res.redirect(nextPage);
    } else {
        // Change this
        let barComparisonResult = req.body.bar_comparison === "Right" ? 1 : 0;
        let lineComparisonResult = req.body.line_comparison === "Right" ? 1 : 0;
        let radialComparisonResult = req.body.radial_comparison === "Right" ? 1 : 0;
        res.send(`
            Successful Submission! Thank you for participating in our experiment!\n\n
            Your score: ${(barComparisonResult + lineComparisonResult + radialComparisonResult)*100 / 3}%
        `);
    }
})

app.listen(3000, () => {
    console.log("Server running")
})