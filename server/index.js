import express  from "express";
import * as dotenv from "dotenv"
import cors from "cors"
const app = express();

const PORT =  process.env.PORT || 4000
import connectDB from "./mongodb/connection.js"; 
dotenv.config();
import postRoutes from "./routes/postRoutes.js"
import dalleRoutes from "./routes/dalleRoutes.js"

app.use(cors());
app.use(express.json({ limit: "50mb" }))

app.use("/api/v1/post",postRoutes)
app.use("/api/v1/dalle", dalleRoutes)



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