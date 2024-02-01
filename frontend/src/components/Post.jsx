import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns"
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({post, postedBy}) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const navigate = useNavigate();
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("https://threads-prod-backend.onrender.com/api/users/profile/" + postedBy);
                const data = await res.json(); //data is the user who posted this post

                if(data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) { 
                showToast("Error", error.message, "error");
                setUser(null);
            }
        };

        getUser();
    }, [postedBy, showToast]) //only have postedBy and not post because this useEffect is only using postedBy (and we include showToast because that's an external function we use inside the useEffect)
    
    const handleDeletePost = async (e) => {
        try {
            e.preventDefault(); //we do this because each post is wrapped in a link. so if we click anywhere in the post we would get sent to that post if we don't do this
            if(!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`https://threads-prod-backend.onrender.com/api/posts/${post._id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post deleted", "success");
            setPosts(posts.filter((p) => p._id !== post._id));
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

    if(!user) return null;

    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size="md" name={user?.name} src={user?.profilePic} 
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);//navigate to the route indicated
                        }}
                    />
                    <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                        {post.replies[0] && (
                            <Avatar
                            size="xs"
                            name="John Doe"
                            src={post.replies[0].userProfilePic}
                            position={"absolute"}
                            top={"0px"}
                            left={"15px"}
                            padding={"2px"} 
                   
                        />
                        )}
                        
                        {post.replies[1] && (
                            <Avatar
                            size="xs"
                            name="John Doe"
                            src={post.replies[1].userProfilePic}
                            position={"absolute"}
                            bottom={"0px"}
                            right={"-5px"}
                            padding={"2px"} 
                        />
                        )}
                        {post.replies[2] && (
                            <Avatar
                            size="xs"
                            name="John Doe"
                            src={post.replies[2].userProfilePic}
                            position={"absolute"}
                            bottom={"0px"}
                            left={"4px"}
                            padding={"2px"} 
                        />
                        )}
                        
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}> {/* This portion is the "right side" of the post - not the left column portion */}
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}
                            >
                                {user?.username}
                            </Text>
                            <Image src='/verified.png' w={4} h={4} ml={1}/>
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"xs"} w={36} textAlign={"right"} color={"gray.light"}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                            {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post.text}</Text> {/*Post text*/}
                    {post.img && (
                        <Box 
                        borderRadius={6}
                        overflow={"hidden"}
                        border={"1px solid"}
                        borderColor={"gray.light"}
                    >
                        {/*Notice that borderColor is separate - seems this is in order to use gray.light syntax. I guess if you want to use gray.light it has to be in a string on its own*/}
                        <Image src={post.img} w={"full"} />
                    </Box>
                    )} {/*Post img if it exists*/}
                    
                    <Flex gap={3} my={1}>
                        <Actions post={post}/>
                    </Flex> {/* Likes */}

                    
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;

/*
GUESS AS TO HOW UI WILL LOOK:
 <Link to={"/markzuckerberg/post/1"}>
            <Flex>
                <Flex>

                </Flex>
                <Box>
                    <FleX>
                        <Flex>

                        </Flex>
                        <Flex>

                        </Flex>
                    </FleX>
                </Box>
                <Text>

                </Text>
                {Image}
                <Flex>

                </Flex>
                <FleX>
                    
                </FleX>
            </Flex>
        </Link>
*/

/*
    NOTES:

    POSITIONING OF 3 AVATARS IN BOX IN LEFT COLUMN:
        These avatars are absolute positioned, and 2 say bottom 0 and 1 says top 0.
        You would think this would make 2 appear at the bottom and 1 at the top (because
        top and bottom discribe the distance from the top (or bottom) of the element to the edge of the container element.
        However, the only content in the box is those 3 components, and since all of them are 
        absolutely positioned, they are removed from the document flow and so the Box component 
        is effectively empty. It ends up being a straight horizontal line taking up the width
        of its container. So, the top and the bottom edge of Box end up being the same thing. 
        So the 1 component with a top of 0 would end up below the line (The distance of the top of the child component and the top
        of the container component should be 0), and the two elements with a bottom of 0 (The distance between the bottom of the child
        component and the bottom of the container component should be 0) end up on top.
    
    
    user?.username //? checks if user exists (i'm guessing) and if it does then do .name on it

window.confirm():
window.confirm() instructs the browser to display a dialog with an optional message, and to wait until the user either confirms or cancels the dialog.

Under some conditions — for example, when the user switches tabs — the browser may not actually display a dialog, or may not wait for the user to confirm or cancel the dialog.

Syntax
JS
Copy to Clipboard
confirm(message)
Parameters
message
A string you want to display in the confirmation dialog.

Return value
A boolean indicating whether OK (true) or Cancel (false) was selected. If a browser is ignoring in-page dialogs, then the returned value is always false.
*/