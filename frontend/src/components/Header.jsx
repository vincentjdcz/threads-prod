import { Avatar, Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from 'react-icons/ai';
import { Link as RouterLink } from 'react-router-dom'
import { RxAvatar } from 'react-icons/rx'
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
const Header = () => {
    const {colorMode, toggleColorMode} = useColorMode()
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    return <Flex justifyContent={"space-between"} mt={6} mb="12">

        {user && (
            <Link as={RouterLink} to="/">
              <AiFillHome size={24} />
            </Link>
        )}
        {!user && (
            <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('login')}>
              Login
            </Link>
        )}
        <Image
            cursor={"pointer"}
            alt='logo'
            w={6}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
        />
        {user && user.profilePic && (
            <Flex alignItems = "center" gap={4}>
            <Link as={RouterLink} to={`/${user.username}`}>
            <Avatar size="24" boxShadow={"md"} src={user?.profilePic}/>
            </Link>
            <Link as={RouterLink} to={`/`}>
            <Button
                size="xs"
                onClick={logout}
            ><FiLogOut size={20}/></Button>
            </Link>
            </Flex>
        )}
        
        {user && !user.profilePic && (
            <Flex alignItems = "center" gap={4}>
            <Link as={RouterLink} to={`/${user.username}`}>
              <RxAvatar size={24} />
            </Link>
            <Link as={RouterLink} to={`/`}>
            <Button
                size="xs"
                onClick={logout}
            ><FiLogOut size={20}/></Button>
            </Link>
            </Flex>
        )}
        
        {!user && (
            <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
              Sign up
            </Link>
        )}
    </Flex>
};

export default Header;

/*
    NOTES:
    useColorMode() is what's known as a React Hook
    Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.
    Hooks are functions that let you “hook into” React state and lifecycle features from function components.
    Hook functions return a pair: the current state value and a function that lets you update it.
    In this case it looks like the hook userColorMode() is returning the current value of colorMode (which we use
    to determine which logo we display - light or dark ) and a toggleColorMode() function that would seem to
    toggle between the light and dark color mode values

    Remember, the background changing between the different colormodes is handled in main.jsx where we created our 
    custom styles used to extend the theme of chakraUI
    */