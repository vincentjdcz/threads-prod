import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";

const UserPage = () => {
    const [user, setuser] = useState(null); //user we want to get posts from
    const {username} = useParams(); //username of the user we want to get posts for. remember, useParams() gets the parameterized values that we defined in the route
    const showToast = useShowToast();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [fetchingPosts, setFetchingPosts] = useState(true); //starting as true because we fetch as soon as component mounts
    useEffect(() => {
        const getUser = async() => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if(data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setuser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };

        const getPosts = async () => {
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();
                console.log(data);
                setPosts(data);
                if (data.error) {
                    showToast("ERROR", data.error, "error");
                }

            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };

        getUser();
        getPosts();
    }, [username, showToast]); //see useEffect() explanation below
    if(!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size="xl" />
            </Flex>
        )
    }
    if (!user && !loading) return <h1>User not found</h1>; //if there is no user or user doesn't exist
    console.log("USER PAGE USER OBJECT: ", user);
    return <>
        <UserHeader user={user}/>
        {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
                <Spinner size={"xl"} />
            </Flex>
        )}
        {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}
        {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
        ))}
    </>
};

export default UserPage;

/*
    NOTES:
    <> is called a fragment in React
    A common pattern in React is for a component to return multiple elements. Fragments let you group a list of children without adding extra nodes to the DOM.

    useEffect() explanation:
    per chatGPT:

    useEffect is a React Hook that allows you to perform side effects in function components. Side effects may include data fetching, subscriptions, manually changing the DOM, and more. It is called with a function that contains the code you want to run, and it runs after the component has rendered.

    The basic syntax of useEffect is as follows:

    javascript
    Copy code
    useEffect(() => {
    // Code for side effects
    return () => {
        // Cleanup code (optional)
    };
    }, [dependencies]);
    The first argument is the function that contains the code for your side effect.
    The second argument is an array of dependencies. If any of the dependencies change between renders, the effect will run again.
    Here's a breakdown:

    Effect Function: Contains the code you want to run as a side effect. This can include setting up event listeners, fetching data, or interacting with the DOM.

    Cleanup Function: (Optional) If your effect involves any cleanup, such as canceling network requests or removing event listeners, you can return a function from the effect that will run when the component is unmounted or when the dependencies change.

    Dependencies Array: An array of values that the effect depends on. If any of these values change between renders, the effect will run again. If the array is empty, the effect runs only once after the initial render.


    Me: is there a reason for creating the getUser function and then calling it, as opposed to just executing the code inside the getUser function? it seems redundant as we're not using the getUser function anywhere else
    ChatGPT
    The use of a separate getUser function in this case may be for organizational and readability purposes. Breaking the asynchronous logic into a named function can make the code more modular and easier to understand, especially if the logic inside the useEffect hook becomes more complex.

    Advantages of using a named function:

    Readability: Breaking down the logic into smaller, named functions makes it easier for someone reading the code to understand its purpose. Each function can have a clear responsibility.

    Reusability: If, in the future, you need to reuse the logic to fetch user data from different parts of your code, having a separate function allows you to do so without duplicating the code.

    Testing: Separating the logic into functions makes it easier to test each function independently. You can write unit tests for the getUser function to ensure it behaves as expected.

    However, for simpler cases where the logic is straightforward and won't be reused, you might see the logic directly placed inside the useEffect callback without defining a separate function.

    Ultimately, the decision to use a separate function or not often depends on the complexity of the logic and the developer's preference for code organization and readability.

    Why do we add showToast to the dependency array being passed to useEffect()?
    ChatGPT:
    Great observation! Adding showToast to the dependency array is a good practice to address a potential issue related to closures in JavaScript.

In JavaScript closures, functions created inside another function have access to the variables of the outer function even after the outer function has completed. When using a function from the outer scope inside useEffect, it's considered a best practice to include it in the dependency array if it's part of the component's state or props. This helps prevent issues where the function refers to stale state or props.

In this case, showToast is likely a function provided by a hook or a higher-level component. While it might not directly depend on the username prop, including it in the dependency array ensures that the latest version of showToast is used within the getUser function. If showToast were to change during the component's lifecycle, omitting it from the dependency array might result in using a stale version of the function.

However, if you are certain that showToast won't change during the component's lifecycle, you can safely omit it from the dependency array to avoid unnecessary re-renders triggered by changes in showToast. It's a balancing act between preventing potential bugs related to stale closures and optimizing performance by minimizing unnecessary re-renders.
    */