import express from 'express'; //Note: in order to use import syntax over require, you need to type to "module" in package.json (as we did in this case - see package.json)
import dotenv from "dotenv";
import connectDB from './db/connectDB.js'; //NOTE if you are importing a specific file, you should have the extension, in this case .js
import cookieParser from 'cookie-parser';

import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

import corsOptions from './config/corsOptions.js';
import cors from "cors"
import {v2 as cloudinary} from "cloudinary";
dotenv.config();

connectDB();

const app = express(); //this will be our app that listens for requests. express is what allows us to listen for requests
const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//Middlewares: (functions called between request and response)
//{limit} WAS NOT PART OF THE TUTORIAL - NEEDED TO GOOGLE WHY I WAS GETTIGN ERRORS ABOUT REQUESTS BEIGN TOO LARGE, TURNS OUT WE NEED TO SET THE LIMIT (default is 100kb)
app.use(express.json({ limit: '50mb' })); //parses incoming JSON data from req.body and make the parsed output avalable as part of the request (I don't remember what part - we'll probably see later)
app.use(express.urlencoded({ extended: true, limit: '50mb'})); //parse form data in req.body, extended: true means even if the body has nested objects it will parse no problem
app.use(cookieParser()); //gets cookie from request and sets cookie in response
app.use(cors(corsOptions));
//Routes:
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

//ASIDE: "dev": "nodemon server.js" in the scripts property in package.json allows us to run application using nodemon which 
//alows us to avoid having to restart the server every time we make a change
//the "Start" property is "for production" (according to guy in video)
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));