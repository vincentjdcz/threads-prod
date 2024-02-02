import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

/*import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
*/
export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		username: "",
		password: ""
	}); //When you call useState() multiple times and assign them to differently named state variables and stateSetter variables, different pieces of state are created. so here we have state stored in a variable called show password, and another state stored in a variable called inputs
	const showToast = useShowToast();
	const [loading, setLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure()
	onOpen();
	const handleLogin =  async () => {
		setLoading(true);
		try {

			const res = await fetch("https://threads-prod-backend.onrender.com/api/users/login", {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(inputs)
			})
			const data = await res.json();
			console.log("login res: ", res); //TEST
			console.log("login data: ", data); //TEST
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	}
	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Login
					</Heading>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}
                w={{
                    base:"full",
                    sm: "400px",
                    
                }}
                >
					<Stack spacing={4}>

						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type='text'
								value={inputs.username}
								onChange={(e) => setInputs((inputs) => ({...inputs, username: e.target.value}))}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({...inputs, password: e.target.value}))}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText='Logging in'
								size='lg'
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleLogin}
								isLoading={loading}
							>
								Login
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Don&apos;t have an account?{" "}
								<Link color={"blue.400"} onClick={() => setAuthScreen("signup")}>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>

		<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Welcome!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <Text>
		  Welcome to this threads clone web application!<br/>
		  This project is very much a work in progress, so if you<br/>
		  interact with an element and it doesn't seem to work,<br/>
		  it's probably still in development.<br/>
		  </Text>
          <Box h="1px" w={"full"} bg="gray.light" my={2}></Box>
		  <Text>
		  Feel free to use the demo account:<br/>
			username: mzuck<br />
			passworD: mzuck123<br />
		  </Text>
		  <Box h="1px" w={"full"} bg="gray.light" my={2}></Box>
		  <Text>
		  Or create your own account and login and poke around. <br/><br/>

		  Some current features and functionalities:
		  </Text>
		  <ul>
			<li>Sign Up</li>
			<li>Log In </li>
			<li>View Home Page Feed</li>
			<li>View User Profile</li>
			<li>Update (own) User Profile</li>
			<li>Follow User (to find a user, append the username to the base 
		browser url. For example: https://threads-prod.onrender.com/mzuck)</li>
			<li>Unfollow User</li>
			<li>View Post</li>
			<li>Like Post</li>
			<li>Comment On Post</li>
			<li>Create Post (must be done from own user profile - create post button
		will be in bottom right corner)</li>
			<li>Delete (own) Post</li>
		  </ul>
		
		  <Text>Enjoy!</Text>
		  
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose} isLoading={loading}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
		</Flex>

		
	);
}

/*
The youtube video just copied this from a page that had templates for chakraui when he recorded the video. It seems those templates are now
for premium chakraui accounts, so we just took this straight from the github repo for the finished version of this product.
*/