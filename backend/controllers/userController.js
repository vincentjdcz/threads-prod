import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from 'cloudinary';
import mongoose from "mongoose";
import Post from "../models/postModel.js";
const getUserProfile = async (req, res) => {
    
    const { query } = req.params; //remember req.params has the parts of the url that you parameterized when you defined the routes
    //^ remember, query is either a username or user id
    console.log("in userController, query: ", query); //TEST
    try {
        let user;
        //query is userId
        if(mongoose.Types.ObjectId.isValid(query)){ //checks if query is a valid mongoose object id
            user = await User.findOne({_id: query}).select("-password").select("-updatedAt");
        } else {
          //query is username
          console.log("searching username: ", query);
          user = await User.findOne({username:query}).select("-password").select("-updatedAt"); //you can chain select()'s
                    
        }
        if(!user) return res.status(400).json({error: "User not found"});
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in getUserProfile: ", err.message);
    }
}

const signupUser = async(req, res) => {
    try {
        const {name, email, username, password} = req.body; //remember our express.json() middleware converts the request data to an object that we can work with for us, and is avalable at req.body
        const user = await User.findOne({$or:[{email},{username}]});

        if(user) {
            return res.status(400).json({error: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({error: "Invalid user data"});
        }

    } catch (error) {
        res.status(500).json({error : error.message}); //.status(500) sets the status to 500 and .json converts the object passed into it to json and sends it as part of the response
        console.log("Error in signupUser: ", err.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }); //get the User with the username we're looking for
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); //check if the password provided (first paramter) is correct (by comparing it to the second parameter - which is the hashed version of the password we stored in the database)
        console.log("isPasswordCorrent: ", isPasswordCorrect); //TEST
        console.log("user: ", user); //TEST

        if(!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password"});

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        });

    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in loginUser: ", error.message);
    }
};

const logoutUser = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge:1}); //remember, res.cookie sets the cookie. Here we are setting the jwt cookie that we set before to a "". And we're setting the maxAge of this new cookie to 1. Effectively what this does is clear the old cookie which actually had the jwt token
        res.status(200).json({message: "User logged out succesfully"});
    } catch (err) {
        res.status(500).json({ error: error.message});
        console.log("Error in logoutUser: ", err.message);
    }
};

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params; //remember, this is destructuring. This will get the id property of the params object. Also remember id is the id of the user we want to follow
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) return res.status(400).json({error: "You cannot follow/unfollow yourself"}); //remember, id is the id of the profile we are viewing and trying to follow. req.user._id is the id of the user signed in. Here we are checking if the user is trying to follow themself
    
        if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"});

        const isFollowing = currentUser.following.includes(id); 

        if(isFollowing){
            //case where user is already following the target user, so we're going to unfollow
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id}}); //first param for findByIdAndUpdate is an id, second is an object with some updated value(s). Or, it can be an operator, in this case $pull, which describes how to update the value. $pull removes the value specified in the object that it maps to from the array specified by the name of the property if the object that it maps to. So here we remove id from following 
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id}});
            res.status(200).json({message: "User unfollowed successfully"});
        } else {
            //case where user is not yet following the target user, so we're going to follow
            await User.findByIdAndUpdate(req.user._id, { $push: {following: id}}); //similar to $pull above, but as you can probably guess push adds the element to the array
            await User.findByIdAndUpdate(id, { $push: {followers: req.user._id}});
            res.status(200).json({message: "User followed successfully"});
        };
    
    } catch (err) {
       res.status(500).json({error: err.message});
       console.log("Error in followUnfollowUser: ", err.message); 
    }
};

const updateUser = async (req, res) => {
    const { name, email, username, password, bio} = req.body; //potential values to update, sent in the req body
    let { profilePic } = req.body; //doing this on separate line because we need let because we are going to reassign the value of profilePic later
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({error: "User not found"});

        if(req.params.id !== userId.toString()) return res.status(400).json({ error: "You cannot update other user's profile"});

        if(password) { //if updating password we need to hash it first the same way we did before
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if(profilePic) {
            if(user.profilePic){
                //check if user alraedy has a profilePic
                //remember profilePic in the if above is the profilePic sent from the updateUer request
                //user.profilePic holds the current user profile pic, if they have one
                //if they already have one, delete the current before updating it with the new one

                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
                //remember, we store the cloudinary secure url in profilePic, and that is formated in a specific way.
                //seems, according to this, the id is found after the last / in the secure url, before the first . of that portion
                //this id is what the destroy() method takes as input
            }
            console.log("before upload");
            const uploadedResponse = await cloudinary.uploader.upload(profilePic); //self explanatory, upload profilePic to cloudinary
            console.log("after upload");
            profilePic = uploadedResponse.secure_url; //according to Chatgpt, this secure_url is the secure url to the location of the img we ploaded to cloudinary
        }

        //what we are doing below is setting each of the user document's properties to the new value if it exists, or the same value otherwise
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        await Post.updateMany(
            {"replies.userId":userId},
            {
                $set: {
                    "replies.$[reply].username":user.username,//set the username for all reply objects in the replies array that are matched (note the array filter below will filter for reply objects with a  specific userId)
                    "replies.$[reply].userProfilePic":user.profilePic //set the profilePic for all reply objects in the replies array that are matched (note the array filter below will filter for reply objects with a  specific userId)
                }
            },
            { arrayFilters: [{ "reply.userId": userId }]} //filter arrays (in our case we are impacting the replies array) so that it contains only objects that have the specified userId
        ); //See Updating Replies Note below for explanation
        
        //password should be null in response
        user.password = null;
        
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in updateUser: ", err.message);
    }
};


export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile };

/*
    Notes:

LINE 5:    
Per ChatGPT Jan 13, 2024:
In MongoDB, the $or operator is used to perform a logical OR operation on an array of two or more conditions. In the context of your code snippet:

javascript
Copy code
const user = await User.findOne({ $or: [{ email }, { username }] });
This query is looking for a user in the MongoDB collection (presumably, a User collection) where either the email or the username matches the specified values. The { email } and { username } syntax is a shorthand in JavaScript (destructuring assignment) where the object key and value have the same name. It's equivalent to writing { email: email, username: username }.

So, the query is searching for a user where either the email matches the provided value or the username matches the provided value. The await keyword is used here because findOne is typically an asynchronous operation in MongoDB when used with a driver like Mongoose.

Here's a breakdown of the query:

$or: [...]: Matches documents that satisfy at least one of the specified conditions.
{ email }: Matches documents where the email field is equal to the provided value.
{ username }: Matches documents where the username field is equal to the provided value.
The result is a user document that satisfies either of these conditions.

LINE 11:
Per ChatGPT Jan 13, 2024
The code you provided is using the bcrypt library, which is commonly used for hashing passwords securely. In this specific line:

javascript
Copy code
const salt = await bcrypt.genSalt(10);
bcrypt is the library being used, and it should be previously imported in your code (e.g., const bcrypt = require('bcrypt');).

genSalt(10) is a function provided by bcrypt. It generates a salt, which is a random string of characters used to modify the hashing algorithm. The 10 is the cost factor, indicating the number of rounds the hashing function will be executed. Higher numbers increase the time it takes to hash the password, making it more secure but also slower.

await is used because genSalt is an asynchronous function. The await keyword is used in an async function to pause execution until the asynchronous operation (in this case, generating the salt) is complete.

So, the line of code generates a salt with 10 rounds of hashing, and the result is stored in the salt variable. This salt is typically combined with the user's password before hashing to enhance the security of the password storage process.

bcrypt is the library being used.

hash is a function provided by bcrypt. It takes two arguments:

password: The plaintext password that you want to hash.
salt: The salt generated using bcrypt.genSalt().
await is used because bcrypt.hash is an asynchronous function. The await keyword is used in an async function to pause execution until the asynchronous operation (in this case, hashing the password) is complete.

The result of the bcrypt.hash operation, which is the hashed password, is assigned to the variable hashedPassword.

So, this line of code hashes the provided plaintext password using the generated salt, and the resulting hashed password is stored in the hashedPassword variable. This hashed password is what you would typically store in your database instead of the plaintext password for security reasons.

In cryptography, a "salt" is a random value that is used as an additional input to a hash function along with the data being hashed. The purpose of a salt is to ensure that the same input (e.g., the same password) will produce different hash values, making it more difficult for attackers to use precomputed tables (rainbow tables) or other techniques like dictionary attacks.

Here's why it's called a "salt" and its purpose:

Uniqueness: A salt adds randomness to the hashing process. Even if two users have the same password, their hashes will be different because they have different salts.

Defense Against Rainbow Tables: Rainbow tables are precomputed tables of hash values for common passwords. Salting makes it infeasible to use these tables because each password has a unique salt.

Increased Security: Salting significantly increases the complexity and time required for attackers to perform a successful brute-force or dictionary attack.

By using a unique salt for each password, the overall security of password storage is improved. The salt is typically stored along with the hashed password in a secure manner.

LINE 47:
The salt is incorporated into the hash (as plaintext). The compare function simply pulls the salt out of the hash and then uses it to hash the password and perform the comparison.
Bcrypt compares hashed and plaintext passwords without the salt string because the hashed password contains the salt string which we created at the time of hashing.

For example :

Take this plain password :

546456546456546456456546111

Hashed password of the plain text above using Bcrypt :

$2b$10$uuIKmW3Pvme9tH8qOn/H7uZqlv9ENS7zlIbkMvCSDIv7aup3WNH9W

So in the above hashed password, there are three fields delimited by $ symbol.

I) First part $2b$ identifies the Bcrypt algorithm version used.

II) Second part $10$ 10 is the cost factor (nothing but the salt rounds used while creating the salt string) If we do 15 rounds, then the value will be $15$

III) Third part is the first 22 characters which are the salt string. In this case it is

uuIKmW3Pvme9tH8qOn/H7u

The remaining string is the hashed password - Zqlv9ENS7zlIbkMvCSDIv7aup3WNH9W

So basically, the saltedHash = salt string + hashedPassword to protect from rainbow table attacks.

ALSO LINE 47:
The line of code user?.password is using the optional chaining (?.) operator, which is a feature introduced in ECMAScript 2020 (ES11/ES2020) and supported in modern JavaScript environments.

Here's what it does:

If user is not null and not undefined, it accesses the password property of the user object.
If user is null or undefined, it returns undefined without throwing a TypeError.
This is especially useful when dealing with nested properties or methods where you want to safely access a property without explicitly checking each level of the nested structure for null or undefined.

user?.password || "": This part uses the logical OR (||) operator. If user?.password is undefined, it provides a default value of an empty string (""). This is a common pattern to handle cases where user might be null or undefined, ensuring that the comparison function doesn't throw an error due to accessing properties on null or undefined.



See Updating Replies Note below for explanation
Convo from chat gpt:
can you explain what is going on here:

        await Post.updateMany(
            {"replies.userId":userId},
            {
                $set: {
                    "replies.$[reply].username":user.username,
                    "replies.$[reply].userProfilePic":user.profilePic
                }
            }
        )

ChatGPT
Certainly! This code is using the updateMany method in MongoDB to update multiple documents in a collection based on a specified condition. Let's break down the components of this update operation:

javascript
Copy code
await Post.updateMany(
    {"replies.userId": userId},
    {
        $set: {
            "replies.$[reply].username": user.username,
            "replies.$[reply].userProfilePic": user.profilePic
        }
    }
);
await Post.updateMany(: This part initiates the update operation on the "Post" collection. The updateMany method is used to update multiple documents that match a specified condition.

{"replies.userId": userId}: This is the query condition. It specifies that the update should be applied to documents where the "replies" array contains an object with a "userId" field equal to the provided userId.

$set:: The $set operator is used to set the values for the specified fields in the documents that match the query condition.

"replies.$[reply].username": user.username and "replies.$[reply].userProfilePic": user.profilePic: These are the fields being updated. The $[reply] is a positional operator used to identify the element in the "replies" array that matched the query condition. It allows updating the specific element without knowing its exact position in the array.

So, in summary, this code updates all documents in the "Post" collection where the "replies" array contains an object with a "userId" field matching the provided userId. It sets the "username" and "userProfilePic" fields of the matching "replies" array element to the values from the user object. The $[reply] positional operator is crucial for updating the correct element within the array.

User
can you explain this:

       await Post.updateMany(
            {"replies.userId":userId},
            {
                $set: {
                    "replies.$[reply].username":user.username,
                    "replies.$[reply].userProfilePic":user.profilePic
                }
            },
            { arrayFilters: [{ "reply.userId": userId }]}
        );
ChatGPT
Certainly! The additional part in this code is the use of arrayFilters. Let me break it down:

javascript
Copy code
await Post.updateMany(
    {"replies.userId": userId},
    {
        $set: {
            "replies.$[reply].username": user.username,
            "replies.$[reply].userProfilePic": user.profilePic
        }
    },
    { arrayFilters: [{ "reply.userId": userId }]}
);
{ arrayFilters: [{ "reply.userId": userId }]}: This part introduces the arrayFilters option. It allows specifying conditions on which elements in the array to update. In this case, it uses the arrayFilters option to filter the elements in the "replies" array based on the condition "reply.userId": userId.

"replies.$[reply].username": user.username and "replies.$[reply].userProfilePic": user.profilePic: These are the fields being updated, similar to the previous explanation. The $[reply] positional operator still identifies the specific element in the "replies" array that matches the query condition.

With arrayFilters, you can filter the array elements based on certain conditions, allowing for more precise updates within nested arrays. In this case, it ensures that only elements in the "replies" array where "reply.userId": userId are updated. This is particularly useful when dealing with arrays of objects in MongoDB updates.

User
is the arrayFilters option redundant since we already have our first parameter in the updateMany function being the filter object?
ChatGPT
The arrayFilters option is not redundant; rather, it serves a specific purpose in scenarios where you need to apply different conditions for updating elements within an array.

In the provided updateMany example:

javascript
Copy code
await Post.updateMany(
    {"replies.userId": userId},
    {
        $set: {
            "replies.$[reply].username": user.username,
            "replies.$[reply].userProfilePic": user.profilePic
        }
    },
    { arrayFilters: [{ "reply.userId": userId }]}
);
The first parameter {"replies.userId": userId} is the filter criteria for matching documents in the collection. It identifies documents where the "replies" array contains elements with the specified "userId."

The arrayFilters option, on the other hand, is used to further filter which specific elements within the "replies" array should be updated. In this case, it ensures that only array elements with "reply.userId": userId are considered for the update.

So, it allows you to apply different conditions to filter the elements within the array, giving you more granular control over which array elements get updated based on additional criteria.

In summary, the first parameter filters the documents, and the arrayFilters option filters the elements within the array for updating. Both work together to provide a targeted update operation.
*/