import express from 'express';
import checkRouter from "./routes/movieRoute.js";
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
mongoose.connect("mongodb+srv://Nikhil:nikhil3005$1503@cluster0.qnjnaze.mongodb.net/MovieUser").then(()=>{
    console.log("connected to MongoDB")
}).catch((err)=>{
    console.log("error while connecting to mongo ",err);
})

app.use(express.json());
app.use(cors()); 
app.use(checkRouter);

app.listen(5000, () => {
    console.log("server running");
});
