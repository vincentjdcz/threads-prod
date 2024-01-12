import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout"
import { Avatar } from "@chakra-ui/avatar";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuItem, MenuList, Portal, useToast } from "@chakra-ui/react";
const UserHeader = () => {

    const toast = useToast();
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
    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>Mark Zuckerberg</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>markzuckerberg</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size={
                        {
                            base: "md",
                            md: "xl"
                        }
                    }/>
                    {/* Looks like size can take in an object whereby you define values based on different viewport sizes. Seems base is the smallest, medium is some threshold of viewport size, and there's probably more for larger viewport sizes*/}
                </Box>
            </Flex>
            <Text>Co-founder, executive chairman and CEO of Meta Platforms.</Text>
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>3.2K followers</Text>
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

    */
