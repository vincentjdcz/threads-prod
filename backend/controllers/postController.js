import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;

        if(!postedBy || !text) {
            return res.status(400).json({message: "Postedby and text fields are required"});
        }

        const user = await User.findById(postedBy);
        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        if(user._id.toString() !== req.user._id.toString()){ //check that the user trying to create the post (which we got from the request by way of postedBy) is the same as the user currently logged in (which we can get from the req because of the protectedRoute middleware)
            return res.status(401).json({message: "Unauthorized to create post"});
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({message: `Text must be less than ${maxLength} characters`});
        }

        const newPost = new Post({postedBy, text, img});
        await newPost.save();
    
        res.status(201).json({message: "Post created successfully", newPost});
    
    } catch (err) {
       res.status(500).json({message: err.message});
       console.log(err);
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ post });

    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Unauthorized to delete post"});
        }

        await Post.findByIdAndDelete(req.params.id); //delete the post
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const {id:postId} = req.params; //remember, id:postId renames id to postId
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({message: "Post not found"});
        }

        const userLikedPost = post.likes.includes(userId); //check if user already liked post

        if(userLikedPost) {
            //unlike post
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}}); //did something similar for follow/unfollow - see explanation there
            res.status(200).json({message: "Post unliked successfully"});
        } else {
            //like post
            post.likes.push(userId); //why didn't we do it the same way we did for the followers case? REVISE after to make it consistent
            await post.save();
            res.status(200).json({message: "Post liked successfully"});

        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

const replyToPost = async (req, res) => {
    try {
        const {text} = req.body; //this text is the reply (or comment) being posted on the post. It's in the req.body because it is coming from a form
        const postId = req.params.id; //we get postId from req.params because it's part of the browser url
        const userId = req.user._id; //user._id is available on the req object thanks to our protectRoute middleware
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text) { //no comment (reply) provided
            return res.status(400).json({message: "Text field is required"});
        }

        const post = await Post.findById(postId);
        if(!post) { 
            return res.status(404).json({message: "Post not found"});
        }

        const reply = {userId, text, userProfilePic, username}; //this is the reply object to be stored in the replies array of the post. remember, userId is the id of the current user, the user posting a comment -same with the rest of these fields

        post.replies.push(reply); //add the reply object to the replies array of the post
        await post.save(); //save it

        res.status(200).json({message: "Reply added successfully", post}); //respond to request

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}; 

const getFeedPosts = async (req, res) => {
    try {
        //guess: iterate over everyone we're following, and add their posts to some aggregated array (maybe using the spread operator) then return that
        //our guess is wrong. users don't "own" posts (like, they don't have an array of all the posts they've posted). instead, posts have a posted by. So we look for all the posts where postedBy is in our array of users we follow
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const following = user.following; //get the users that this user follows

        //find all posts where postedBy is in following.
        const feedPosts = await Post.find({postedBy: {$in:following}}).sort({createdAt: -1}); //sort in descending order so latest posts are on top
        res.status(200).json({feedPosts});

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}
export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };


/*
NOTES:

NOTE 1:

mongoDb docs:
The 
$in
 operator selects the documents where the value of a field equals any value in the specified array.

ChatGPT:
Post.find({ postedBy: { $in: following } }): This part queries the database for posts. It's using the find method to retrieve documents from the "Post" collection where the "postedBy" field matches any value in the "following" array. The $in operator is used to match any of the values in the specified array.

.sort({ createdAt: -1 }): After finding the documents, this part sorts them based on the "createdAt" field in descending order (-1 means descending). This is typically used to get the most recent posts first.

Mongodb docs:
Syntax
The 
sort()
 method has the following parameter:

Parameter
Type
Description
sort
document
A document that defines the sort order of the result set.
The sort parameter contains field and value pairs, in the following form:

{ field: value }

The sort document can specify 
ascending or descending sort on existing fields
 or 
sort on text score metadata.

Ascending/Descending Sort
Specify in the sort parameter the field or fields to sort by and a value of 1 or -1 to specify an ascending or descending sort respectively.

The following operation sorts the documents first by the age field in descending order and then by the posts field in ascending order:

db.users.find({ }).sort( { age : -1, posts: 1 } )

 */
