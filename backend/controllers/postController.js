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

export { createPost };

