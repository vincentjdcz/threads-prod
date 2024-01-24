import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout"
import { Avatar } from "@chakra-ui/avatar";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Button, Menu, MenuButton, MenuItem, MenuList, Portal, useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {Link as RouterLink} from 'react-router-dom'
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({user}) => { //remember, props gets passed as an object mapping different prop names to the different prop values. Here we are destructuring and extracting the user prop from the props object


    const toast = useToast();
    const currentUser = useRecoilValue(userAtom); //get the current user logged in
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id)); //remember, user is the user of the page we're on, currentUser is our logged in user. we do currentUser? because a user may or may not be logged in when viewing the user's profile page
    const showToast = useShowToast();
    const [updating, setUpdating] = useState(false);

    const copyURL = () => {
        const currentURL = window.location.href; //get the current browser URL in the address bar
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({ 
                title: "Profile copied",
                status: "success",
                description: "Profile link copied.",
                duration: 3000,
                isClosable: true
            }); //toast, in this case, is the little popup at the bottom of the screen that will happen after you click the copy menu option
        }); //copy the current URL to the clipboard
    };

    const handleFollowUnfollow = async () => {
        if(!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }
        if (updating) return;
        setUpdating(true);
        try {

            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            //NOTE what we are doing here is just updating the follower count on the client side. We are not actually
            //updating it with numbers from the backend.
            if(following) {
                showToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop();
            } else {
                showToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser?._id); //adding ? for good measure I guess? since we shouldn't be able to follow if we're not loggd in
            }

            setFollowing(!following);

            console.log(data);
        } catch(error) {
            showToast("Error", error, "error");
        } finally {
            setUpdating(false);
        }
    }

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                            threads.net
                        </Text> 
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic && (
                        <Avatar name={user.name} src={user.profilePic} size={
                            {
                                base: "md",
                                md: "xl"
                            }
                        }/>
                    )}

                    {!user.profilePic && (
                        <Avatar name={user.name} src="https://bit.ly/broken-link" size={
                            {
                                base: "md",
                                md: "xl"
                            }
                        }/>
                    )}

                    {/* Looks like size can take in an object whereby you define values based on different viewport sizes. Seems base is the smallest, medium is some threshold of viewport size, and there's probably more for larger viewport sizes*/}
                </Box>
            </Flex>
            <Text>{user.bio}</Text>
            {currentUser?._id === user._id && (
                <Link as={RouterLink} to='/update'>
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            )}

            {currentUser?._id !== user._id && (<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}> 
                {following ? "Unfollow" : "Follow"}
                </Button>
            )}

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} followers</Text>
                    <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"}/>
                    </Box>
                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"}/>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"grey.dark"}>
                                    <MenuItem bg={"grey.dark"} onClick={copyURL}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}> Threads</Text>
                </Flex>
                <Flex flex={1} borderBottom={"1px solid grey"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}> Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader

/*
    NOTES:
    Vstack is a vertical stack from ChakraUI
    As its name suggests, elements inside are stacked vertically
    I guess it uses flexbox but specifically vertically.
    It seems you want to use <Box>s inside a stack, which seem like a <div>
    Per ChakraUI:
    Box is the most abstract component on top of which all other Chakra UI components are built. By default, it renders a `div` element

    <Menu>
    Everything inside the <Menu> is how we implement a button that, when clicked, will open up a little menu


    <Link as={RouterLink} explanation:
    The as prop in the context of React Router (used with Link or NavLink components) is not a standard prop provided by React Router. It's not part of the official React Router API. However, it might be used in some codebases or projects as a custom prop to control the underlying rendering of the link.

In your example:

jsx
Copy code
<Link as={RouterLink} to='/update'>
    <Button size={"sm"}>Update Profile</Button>
</Link>
Here, as={RouterLink} is a custom usage of the as prop. It appears to be an alias for the RouterLink component, indicating that the link should be rendered using the RouterLink component from React Router.

In other words, instead of rendering a standard HTML a element for the link (which is the default behavior of Link), it's using RouterLink to render the link. This can be useful when you want to use a different underlying component for rendering links, perhaps for styling or other customization reasons.

It's important to note that the as prop is not a standard prop in the React Router documentation, so its behavior would depend on how it's implemented in the specific codebase you're working with. If it's a custom addition to the project, you'd need to check the project's documentation or codebase to understand its exact purpose and behavior. 

The 'as' prop - from ChakraUI https://chakra-ui.com/docs/styled-system/style-props#the-as-prop:

The as prop#
The as prop is a feature in all of our components that allows you to pass an HTML tag or component to be rendered.

For example, say you are using a Button component, and you need to make it a link instead. You can compose a and Button like this:

<Button as='a' target='_blank' variant='outline' href='https://chakra-ui.com'>
  Hello
</Button>
<Button as='a' target='_blank' variant='outline' href='https://chakra-ui.com'>
  Hello
</Button>
EDITABLE EXAMPLE
This allows you to use all of the Button props and all of the a props without having to wrap the Button in an a component.

In their example, what was rendered was a button that, when clicked, navigated to a page. So, it seems, when you have a component
with an "as" prop, what gets rendered visually is the component (in this case a button) but has the behaviours of what's assigned
to the "as" prop (in this case an "a" element - which is a link that navigates somewehre when clicked).

In our code, it seems we have a <Link> (chakraUI link) that has an "as" property of {RouterLink}. I assume this results in a 
ChakraUi Link being displayed, with the features and functionalities of of both ChakraUI Links and react-router-dom Links
*/
