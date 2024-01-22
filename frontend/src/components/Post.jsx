import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns"

const Post = ({post, postedBy}) => {
    const [liked, setLiked] = useState(false); //useState() is a hook, I think that gets the current state. Its parameter is the state value you want initially, and I guess setLiked is the setState function returned by the useState() hook
    const [user, setUser] = useState(null);
    const showToast = useShowToast();

    const navigate = useNavigate();
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/users/profile/" + postedBy);
                const data = await res.json(); //data is the user who posted this post
                console.log(data);
                if(data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) { 
                showToast("Error", error.message, "error");
                setUser(null);
            }
        }

        getUser();
    }, [postedBy, showToast]) //only have postedBy and not post because this useEffect is only using postedBy (and we include showToast because that's an external function we use inside the useEffect)
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
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex> {/* Likes */}

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize="sm">{post.replies.length} replies</Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize="sm">{post.likes.length} likes</Text>
                    </Flex> {/* Replies */}
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


*/