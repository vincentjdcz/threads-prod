import express from 'express'; //Note: in order to use import syntax over require, you need to type to "module" in package.json (as we did in this case - see package.json)
import dotenv from "dotenv";
import connectDB from './db/connectDB.js'; //NOTE if you are importing a specific file, you should have the extension, in this case .js
import cookieParser from 'cookie-parser';

import userRoutes from "./routes/userRoutes.js"

dotenv.config();

connectDB();

const app = express(); //this will be our app that listens for requests. express is what allows us to listen for requests
const PORT = process.env.PORT || 5000;

//Middlewares: (functions called between request and response)
app.use(express.json()); //parses incoming JSON data from req.body and make the parsed output avalable as part of the request (I don't remember what part - we'll probably see later)
app.use(express.urlencoded({ extended: true})); //parse form data in req.body, extended: true means even if the body has nested objects it will parse no problem
app.use(cookieParser()); //gets cookie from request and sets cookie in response

//Routes:
app.use("/api/users", userRoutes);


//ASIDE: "dev": "nodemon server.js" in the scripts property in package.json allows us to run application using nodemon which 
//alows us to avoid having to restart the server every time we make a change
//the "Start" property is "for production" (according to guy in video)
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));