import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
    const { user, loading } = useGetUserProfile();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const { pid } = useParams();
    const currentUser = useRecoilValue(userAtom);
    const navigate = useNavigate();
    const currentPost = posts[0]; //The post for which we are currently on the PostPage of
    useEffect(() => {
        const getPost = async () => {
            setPosts([]);//we do this because if we comefrom the some previous page with posts to the postpage, there is a flickering moment where the user's posts are displayed because when we enter the HomePage the state of posts is still set to the posts of the user. By doing this we clear the state of posts before setting it to what we get from the fetch below
            try {
                const res = await fetch(`https://threads-prod-backend.onrender.com/api/posts/${pid}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;

                }
                console.log(data);
                //setPost(data); //reminder, since post is a state (we call useState to initialize it), calling this setPost will cause a re-render of any components that use that state
                setPosts([data]);
            } catch (error) {
                showToast(Error, error.message, "error");
            }
        } 
        getPost();
    }, [showToast, pid, setPosts]); 

    const handleDeletePost = async () => { //note, we reuse the same function in Post.jsx, can turn this into a hook instead. For now we copy and paste it here
        try {
           if(!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`https://threads-prod-backend.onrender.com/api/posts/${currentPost._id}`, {
                method: "DELETE",
                credentials: 'include',  // Include credentials (cookies) in the request
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post deleted", "success");
            navigate(`/${user.username}`);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

    if(!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }
//LEFT OFF 6:51:46
    if(!currentPost) return null; //GO BACK TO THIS for some reason <Action /> ends up with an undefined post (or undefined post.likes) - UPDATE: Seems it resolved somehow, this works as of the last testing
        return ( 
    <>
        <Flex>
            <Flex w={"full"} alignItems={"center"} gap={3}>
                <Avatar src={user.profilePic} size={"md"} name={user.name} cursor={"pointer"} onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}/>
                <Flex>
                    <Text fontSize={"sm"} fontWeight={"bold"} cursor={"pointer"} onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}>{user.username}</Text>
                    <Image src='/verified.png' w="4" h={4} m1={4} />
                </Flex>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"xs"} w={36} textAlign={"right"} color={"gray.light"}>
                                {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                            </Text>
                            {currentUser?._id === user._id && <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />}
                        </Flex>
        </Flex>
        <Text my={3}>{currentPost.text}</Text>
        
        {currentPost.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
            {/*Notice that borderColor is separate - seems this is in order to use gray.light syntax. I guess if you want to use gray.light it has to be in a string on its own*/}
            <Image src={currentPost.img} w={"full"} />
        </Box>
        )}

        <Flex gap={3} my={3}>
            <Actions post={currentPost}/>    
        </Flex>


        <Divider my={4}/>
        <Flex justifyContent="space-between">
            <Flex gap={2} alignItems="center">
                <Text fontSize="2xl">👋</Text>
                <Text color="gray.light">Get the app to like, reply and post</Text>
            </Flex>
            <Button>Get</Button>
        </Flex>
        <Divider my={4}/>
        
        {currentPost.replies.map(reply => (
            <Comment 
            key={reply._id}
            reply={reply}
            lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
        />
        ))}
        
    </> 
    
    )
    
};

export default PostPage;