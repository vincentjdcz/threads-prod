import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
const protectRoute = async (req, res, next) => {
    try {
         const token = req.cookies.jwt; //in req.cookies.jwt, "jwt" should be spelled the same as how you named it in the cookie
        if(!token) return res.status(401).json({message: "Unauthorized"}); //if token is not found in cookies then there is no logged in user

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //See notes below

        const user = await User.findById(decoded.userId).select("-password"); //note, userId is the payload (in this case {userId}) that we passed to jwt.sign when we created the token in generateTokenAndSetCookie.js. Also, seems select filters the fileds that we get back, - excludes whatever follows so we're exclusing the password
        req.user = user; //we are making user available in the request so that other functions that need the user have access to it(like followUnfollowUser() for example)
        next(); //this is a middleware, so we need to call next to move onto the next middleware.
    } catch (err) {
        res.status(500).json({message: err.message});
        console.log("Error in protectRoute: ", err.message);
    }
}

export default protectRoute;

/*
    NOTES:
    Per ChatGPT Jan 14, 2024:
    Yes, I'm familiar with the concept of protecting a route in web development. It generally refers to restricting access to a specific route or endpoint in a web application based on certain conditions or criteria. This is often done to ensure that only authorized users can access sensitive or protected areas of the application.

Common methods of protecting routes include:

Authentication: Users are required to log in, providing valid credentials such as a username and password. If the authentication is successful, the user is granted access to protected routes.

Authorization: Even after authentication, certain routes may require additional authorization to ensure that the authenticated user has the necessary permissions to access the resource. This is often done using roles or specific user attributes.

Middleware: In many web frameworks, middleware functions can be used to intercept requests before they reach a particular route. Middleware can check for authentication status, perform authorization checks, and take appropriate actions based on the results.

Route Guards (Front-end): In single-page applications (SPAs), route guards are used on the client side to control navigation and access to specific views based on the user's authentication and authorization status.

LINE 8 explained by ChatGPT:

The jwt.verify function is used to verify the authenticity of a JSON Web Token (JWT). Here's an explanation of the code you provided:

javascript
Copy code
const decoded = jwt.verify(token, process.env.JWT_SECRET);
token: This is the JWT that you want to verify.

process.env.JWT_SECRET: This is the secret key or the public key (depending on the signing algorithm) that was used to sign the JWT during its creation. It's used to ensure that the token has not been tampered with and was indeed issued by a trusted party.

The jwt.verify function does the following:

Checks the token's signature to verify that it's valid and hasn't been tampered with.
Checks the token's expiration date to ensure it hasn't expired.
Verifies other claims within the token, depending on what was included during its creation.
If the verification is successful, jwt.verify returns an object containing the decoded payload of the JWT. The decoded payload typically includes information such as the token's expiration date, the subject of the token (usually the user ID), and any additional custom claims.

If the verification fails (due to an invalid signature, expired token, etc.), jwt.verify will throw an error. It's good practice to wrap this code in a try-catch block to handle any potential errors gracefully.

*/