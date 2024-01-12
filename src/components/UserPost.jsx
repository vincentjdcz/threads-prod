import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom"
import Actions from "./Actions";
import { useState } from "react";

const UserPost = () => {
    const [liked, setLiked] = useState(false); //useState() is a hook, I think that gets the current state. Its parameter is the state value you want initially, and I guess setLiked is the setState function returned by the useState() hook
    return (
        <Link to={"/markzuckerberg/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />
                    <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size="xs"
                            name="John Doe"
                            src="https://biy.ly/dan-abramov"
                            position={"absolute"}
                            top={"0px"}
                            left={"15px"}
                            padding={"2px"} 
                   
                        />
                        <Avatar
                            size="xs"
                            name="John Doe"
                            src="https://biy.ly/sage-adebayo"
                            position={"absolute"}
                            bottom={"0px"}
                            right={"-5px"}
                            padding={"2px"} 
                        />
                        <Avatar
                            size="xs"
                            name="John Doe"
                            src="https://biy.ly/prosper-baba"
                            position={"absolute"}
                            bottom={"0px"}
                            left={"4px"}
                            padding={"2px"} 
                        />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerberg</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1}/>
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>This is my first post</Text>
                    <Box 
                        borderRadius={6}
                        overflow={"hidden"}
                        border={"1px solid"}
                        borderColor={"gray.light"}
                    >
                        {/*Notice that borderColor is separate - seems this is in order to use gray.light syntax. I guess if you want to use gray.light it has to be in a string on its own*/}
                        <Image src='/post1.png' w={"full"} />
                    </Box>
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>
                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize="sm">123 replies</Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize="sm">456 likes</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default UserPost;

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
        
*/