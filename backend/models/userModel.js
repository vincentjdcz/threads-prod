import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ""
    }
}, 
{
    timestamps: true
}
);

const User = mongoose.model('User', userSchema); //can think of this as like a constructor. So the schema defines how each document should look (the "shape" - i.e what fields it should have) and you create a model out of that schema and use the model (like a constructor) to instantiate documents (database entries)

export default User;
/*
NOTES:
it seems (according to ChatGPT Jan 12, 2024) that mongoose.Schema() takes a second parameter, that is an options object that dictates further options for the schema
in this case we add an option that adds created at and updated at fields to our documents
*/