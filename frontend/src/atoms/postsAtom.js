import { atom } from 'recoil';

const postsAtom = atom({
    key: 'postAtom',
    default: []
});

export default postsAtom;

//based off self analysis, it seems postsAtom holds the post state of the current page we're on. 
/*
When we're in the user page, we call get posts we call setPosts and pass in the data we retreived
When we're in the post page, we call fetch the post we are interested in and call setPosts and pass in the post we fetched in an array
*/