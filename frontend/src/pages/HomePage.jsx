import { Flex, Spinner } from "@chakra-ui/react";
import useShowToast from '../hooks/useShowToast';
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();
    useEffect( () => {
        const getFeedPosts = async () => {
            setLoading(true);
            setPosts([]); //we do this because if we comefrom the user's profile page to the homepage, there is a flickering moment where the user's posts are displayed because when we enter the HomePage the state of posts is still set to the posts of the user. By doing this we clear the state of posts before setting it to what we get from the fetch below
            try {
                const res = await fetch("https://threads-prod-backend.onrender.com/api/posts/feed", {
                  method: 'GET',
                  credentials: 'include',  // Include credentials (cookies) in the request
                });
                const data = await res.json()
                console.log("res: ", res); //TEST
                console.log("data: ", data); //TEST
                if(data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data);
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        }
        getFeedPosts();
    }, [showToast, setPosts])
    return (
        <>
          {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
          {loading && (
            <Flex justify="center">
              <Spinner size="xl" />
            </Flex>
          )}
          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy}/>
          ))}
        </>
    );
};

export default HomePage;

/*
Notes:

useEffect() (from reactjs docs):
Example Using Hooks
We’ve already seen this example at the top of this page, but let’s take a closer look at it:

import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
What does useEffect do? By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates. In this effect, we set the document title, but we could also perform data fetching or call some other imperative API.
*/