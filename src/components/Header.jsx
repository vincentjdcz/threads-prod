import { Flex, Image, useColorMode } from "@chakra-ui/react";

const Header = () => {
    const {colorMode, toggleColorMode} = useColorMode()
    return <Flex justifyContent={"center"} mt={6} mb="12">
        <Image
            cursor={"pointer"}
            alt='logo'
            w={6}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
        />
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