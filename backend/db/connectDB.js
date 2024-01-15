import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            //To avoid warnings in the console
            useNewUrlParser: true,
            useUnifiedTopology: true

        }); //This connects to our database. looks like the second parameter (the object) offers some options for the connection
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error( `Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;
/* 
    NOTES: 
    The async function declaration creates a binding of a new async function to a given name. The await keyword is permitted within the function body, enabling asynchronous, promise-based behavior to be written in a cleaner style and avoiding the need to explicitly configure promise chains.
    An async function declaration creates an AsyncFunction object. Each time when an async function is called, it returns a new Promise which will be resolved with the value returned by the async function, or rejected with an exception uncaught within the async function.

    Async functions can contain zero or more await expressions. Await expressions make promise-returning functions behave as though they're synchronous by suspending execution until the returned promise is fulfilled or rejected. The resolved value of the promise is treated as the return value of the await expression. Use of async and await enables the use of ordinary try / catch blocks around asynchronous code.



*/