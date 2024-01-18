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
	useToast,
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
export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		password: ""
	}); //remember, use state takes in a default state and returns the current state and a state setter function. Guess we're using React's useState here instead of Recoil because this state doesn't need to be shared with any other components. Just using it to store the form info to send in our fetch req

	
	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);
	const handleSignup = async () => {
		try {
			const res = await fetch("/api/users/signup", { //because we set proxy in vite.config.js such that all requests starting with /api gets forwarded to http://localhost:5000, this request - which starts with /api - will get forwarded to http://localhost:5000 (which is why we don't need to include http://localhost:5000 in the fetch URL)
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(inputs)
			});
			const data = await res.json() //don't confuse this with the res.json() code we use in backend. Here, res is the name we give to the response we receive from the fetch req. In the backend, res is the name of I guess the response object that we use to repond to requests, so they're probably different kinds of objects with different .json() methods
			
			if(data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			//fetch() is how we make requests over the network. First param is the resource we want to make the request to, and the second is options (which include request header, type, body, etc). There are more params, see docs for details
		
			localStorage.setItem("user-threads", JSON.stringify(data)); //localStorage is a web storage API in web browsers that allows you to store key-value pairs in a web browser with no expiration time.
			setUser(data);//our userAtom holds an object, not a jsonString so we pass data in as is - it comes to us as a json object

		} catch (err) {
			showToast("Error", err, "error");
		}
	}

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>Full name</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({...inputs, name: e.target.value })}
										value={inputs.name}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({...inputs, username: e.target.value})}
										value={inputs.username}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type='email'
								onChange={(e) => setInputs({...inputs, email: e.target.value})}
								value={inputs.email}

							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e) => setInputs({...inputs, password: e.target.value})}
									value={inputs.password}
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
								loadingText='Submitting'
								size='lg'
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleSignup}
							>
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Already a user?{" "}
								<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}

/*
The youtube video just copied this from a page that had templates for chakraui when he recorded the video. It seems those templates are now
for premium chakraui accounts, so we just took this straight from the github repo for the finished version of this product.

RE FETCH 
In order for fetch to work, we set a proxy in vite.config.js
Here is information on proxies and why we set them in development:

ChatGPT: asked to explain the proxy code in vite.config.js
Certainly! In the Vite configuration you've shared, the proxy option is used to set up a proxy for your development server. Let's break down the relevant part:

javascript
Copy code
proxy: {
  "/api": {
    target: "http://localhost:5000",
    changeOrigin: true,
    secure: false
  }
}
This configuration is specifying a proxy for requests that start with /api. Here's what each option means:

/api: This is the path prefix that triggers the proxy. So, any request that starts with /api will be forwarded to the specified target.

target: "http://localhost:5000": This is the target server to which the requests will be forwarded. In this case, any request starting with /api will be forwarded to the server running at http://localhost:5000.

changeOrigin: true: This option changes the origin of the host header to the target URL. It is often necessary when the target server checks the host header for security reasons.

secure: false: This disables certificate validation when making requests to the target server over HTTPS. It's set to false for development purposes. In a production environment, you would want this to be true to ensure secure communication.

So, in summary, when your frontend code makes a request to a path starting with /api, Vite's development server will forward that request to the specified target server (http://localhost:5000) as if the request originated from there. This is commonly used during development when the frontend and backend are served from different servers, and you want to avoid CORS (Cross-Origin Resource Sharing) issues.




User
Why do we need to do this though? both my front end and back end are running on local host, isn't that considered the same domain?
ChatGPT
You're correct that if both your frontend and backend are running on localhost, they share the same domain. In such a case, you might not encounter CORS issues that typically arise when making requests between different domains.

The use of a proxy in development servers, like the one provided by Vite in your configuration, is more relevant when your frontend and backend are served by different servers or ports, even if they share the same domain. The reason for this is that modern browsers enforce the same-origin policy, which restricts web pages from making requests to a different domain (including different ports).

When you're developing, your frontend might run on a different port (e.g., localhost:3000), and your backend might run on another port (e.g., localhost:5000). The same-origin policy would normally prevent your frontend from making requests directly to the backend due to this port difference. That's where the proxy configuration comes in handy—it allows your frontend to make requests to /api (which matches the proxy prefix), and the development server forwards those requests to your backend, effectively bypassing the same-origin policy.

So, in summary, the proxy is useful during development when you have separate frontend and backend servers, even if they share the same domain. In a production environment where both frontend and backend are served from the same domain and port, the proxy is typically not needed.

User
I see, so not only do requests need to come from the same domain in order to avoid CORS issues, they also need to come from the same port, is that right?
ChatGPT
Yes, that's correct. The same-origin policy enforced by browsers considers both the domain and the port. For two resources to be considered of the same origin, they must have the same protocol, domain, and port.

If any of these components (protocol, domain, or port) differ between the origin of the web page making a request and the target of that request, the browser considers it a cross-origin request. This triggers the same-origin policy, which restricts certain actions to maintain security.

In development scenarios, when you have your frontend and backend running on different ports, the same-origin policy would typically prevent direct communication between them. Using a proxy during development helps overcome this restriction by allowing your frontend to make requests to a common path (e.g., /api) that gets proxied to the backend server.

User
what are you supposed to do if you want to host your front end and your back end on different servers in production? or what if you make api calls to some external api?
ChatGPT
In production, when your frontend and backend are hosted on different servers or domains, you may encounter Cross-Origin Resource Sharing (CORS) issues. To address this, you need to configure your server to include the appropriate CORS headers in its responses.

For Express (Node.js) servers, you can use the cors middleware to enable CORS. Here's a basic example:

javascript
Copy code
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Your routes and other middleware

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
This middleware (cors()) automatically includes the necessary headers to allow cross-origin requests. You can also configure it to be more specific about which origins are allowed and what methods are allowed for cross-origin requests.

If you're making requests to an external API, that API needs to include the appropriate CORS headers on its responses. You generally don't have control over external APIs, so they need to support cross-origin requests. If they do, your frontend can make requests to them without any issues.

MORE ON fetch()
The global fetch() method starts the process of fetching a resource from the network, returning a promise that is fulfilled once the response is available.

The promise resolves to the Response object representing the response to your request.

A fetch() promise only rejects when a network error is encountered (which is usually when there's a permissions issue or similar). A fetch() promise does not reject on HTTP errors (404, etc.). Instead, a then() handler must check the Response.ok and/or Response.status properties.

ABOUT onChange
remember the e in the handler function is the event that occurred. I guess when there's a change, the anonymous function we assign to onChange will be called with the event object for the event (aka the change) that happened
We set value = inputs.[name of the value we're insterested in] so that the inputs object is the single source of truth for these input elements in our form

ABOUT localstorage:

localStorage is a web storage API in web browsers that allows you to store key-value pairs in a web browser with no expiration time. It provides a simple way to persistently store data locally within a user's browser.

Here are some common use cases for localStorage:

Client-Side Data Storage: You can use localStorage to store data on the client side, such as user preferences, settings, or any data that you want to persist between sessions.

Caching: It can be used to cache data on the client side to reduce the need to fetch the same data from a server repeatedly. This can improve the performance of web applications by reducing the amount of data that needs to be retrieved over the network.

Session Management: While not suitable for storing sensitive data (as it can be accessed and modified by the user), localStorage can be used for managing session-related information on the client side.

Here's a simple example of how to use localStorage:

javascript
Copy code
// Storing data
localStorage.setItem('key', 'value');

// Retrieving data
const storedValue = localStorage.getItem('key');

// Removing data
localStorage.removeItem('key');
It's important to note that the data stored in localStorage is limited to about 5 MB per domain, and it is synchronous, meaning that it can block the execution of other JavaScript code. Additionally, since the data is stored on the client side, it's accessible to anyone who has access to the user's device, so it should not be used for storing sensitive information.
*/