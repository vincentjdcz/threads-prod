import express from "express";
import { followUnfollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from '../controllers/userController.js';
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

//NOTE: /signup is not the full path of the request. It's starts with /api/users (see server.js) then here we continue with /signup

router.get("/profile/:query", getUserProfile); //Note: if in postman you notice it says "cannot GET [...]" or "cannot POST [...]" double check that your route is correctly defined. make sure the path is right (first param) and the method is correct (like post vs get etc)
//another note on above ^. :query will either be a username or a user id
router.post("/signup", signupUser); 
router.post("/login", loginUser); 
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser); //we'll use one route for both following and unfollowing a user because we're just toggling. Also we've added a protectRoute middleware
router.put("/update/:id", protectRoute, updateUser);

export default router;


/*

NOTES:

In Express.js, a router is a way to modularize and organize your routes. It allows you to group related routes together and define routes in separate files or modules. This helps in organizing your code and makes it more maintainable, especially as your application grows.

Here are the key concepts related to Express routers:

Router Creation:
You create a router using the express.Router() method. This method returns a router instance that you can use to define routes.

javascript
Copy code
const express = require('express');
const router = express.Router();
Route Handling:
Once you have a router, you can use it to define routes similar to how you would with the main app object.

javascript
Copy code
router.get('/', (req, res) => {
  res.send('This is the home page.');
});

router.get('/about', (req, res) => {
  res.send('About us page.');
});
Mounting Routers:
You can mount a router in your main Express application using app.use().

javascript
Copy code
const app = express();

app.use('/pages', router);
This means that all routes defined in the router will be prefixed with /pages.

Separation of Concerns:
Routers enable you to separate your routes into different files or modules, improving code organization.

javascript
Copy code
// usersRouter.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('List of users.');
});

module.exports = router;
javascript
Copy code
// app.js
const express = require('express');
const usersRouter = require('./usersRouter');

const app = express();
app.use('/users', usersRouter);
Route Parameters:
Routers support route parameters just like the main app. For example:

javascript
Copy code
router.get('/users/:userId', (req, res) => {
  res.send(`Details for user ${req.params.userId}`);
});

ChatGPT convo:
so when you mount a router to your app, do the requests received by app get forwarded to the router?
ChatGPT
Yes, that's correct! When you mount a router in your Express application using app.use(), it means that the routes defined in the router will be accessible under the specified path.

For example, if you have the following code:

javascript
Copy code
const express = require('express');
const app = express();

const router = express.Router();

router.get('/users', (req, res) => {
  res.send('List of users.');
});

app.use('/api', router);
In this case, any request to /api/users will be handled by the router. The app.use('/api', router) statement tells Express to use the router for any path that starts with /api. The router takes over the handling of routes under that path.

So, if you make a request to http://yourdomain.com/api/users, it will be processed by the router, and the response will be "List of users." This allows you to structure your application in a modular way, making it easier to manage and organize your routes.
*/