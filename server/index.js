import express  from "express";
import * as dotenv from "dotenv"
import cors from "cors"
const app = express();
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const PORT = 4000 || process.env.PORT
import connectDB from "./mongodb/connection.js"; 
dotenv.config();
import postRoutes from "./routes/postRoutes.js"
import dalleRoutes from "./routes/dalleRoutes.js"

app.use(cors());
app.use(express.json({ limit: "50mb" }))

app.use("/api/v1/post",postRoutes)
app.use("/api/v1/dalle", dalleRoutes)

// serving the frontend
app.use(express.static(path.join(__dirname, "../client/dist")));


app.get("*", function (_, res) {
    res.sendFile(
        path.join(__dirname, "../client/dist/index.html"),
        function (err) {
            res.status(500).send(err)
        }
    )
})

app.get("/", async (req, res) => {
    res.send("hello from DAll-E!")
})

const startServer = async () => {

    try {
        connectDB(process.env.MONGODB_URL)
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT} and database is connected`);
        })
    } catch (error) {
     console.log(error);   
    }
    
}

startServer()