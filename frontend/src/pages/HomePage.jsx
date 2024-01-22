import { Flex, Spinner } from "@chakra-ui/react";
import useShowToast from '../hooks/useShowToast';
import { useEffect, useState } from "react";
import Post from "../components/Post";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();
    useEffect( () => {
        const getFeedPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json()
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
    }, [showToast])
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