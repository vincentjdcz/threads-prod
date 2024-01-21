'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';


export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: ''
  });

  const fileRef = useRef(null);

  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  const { handleImageChange, imgUrl } = usePreviewImg(); //for our profile picture
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent page refresh I think or reload
    if(updating) return; //if we just clicked submit and it's still in the process of submitting, do nothing and return since we're still in the middle of updating
    setUpdating(true); //we do this so that we can render a loading icon in the submit button while the request is processing
    try {
      const res = await fetch( `/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({...inputs, profilePic: imgUrl})
      });
      const data = await res.json(); //updated user object
      if(data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data); //if successful, update our user state with the newly updated user
      localStorage.setItem("user-threads", JSON.stringify(data)); //update our localStorage too ...I don't know why we need this when our user atom already tracks this
                                                                  //apparently it's because local storage persists after a refresh, while recoil state does not
    } catch (error) {
      showToast('Error', error, 'error');
    } finally {
      setUpdating(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
    <Flex
      align={'center'}
      justify={'center'}
      my={6}
>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}/>
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/> 
            </Center>
          </Stack>
        </FormControl>
        
        <FormControl >
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="John Doe"
            value={inputs.name}
            onChange={(e) => setInputs({...inputs, name: e.target.value})}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>

        <FormControl >
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="johndoe"
            value={inputs.username}
            onChange={(e) => setInputs({...inputs, username: e.target.value})}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        
        <FormControl >
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            value={inputs.email}
            onChange={(e) => setInputs({...inputs, email: e.target.value})}
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>

        <FormControl >
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Your bio."
            value={inputs.bio}
            onChange={(e) => setInputs({...inputs, bio: e.target.value})}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>

        <FormControl >
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            value={inputs.password}
            onChange={(e) => setInputs({...inputs, password: e.target.value})}
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}
            type='submit'
            isLoading={updating}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}

/*
Notes:

fileRef:
Per chatGPT:
const fileRef = useRef(null);: This line uses the useRef hook to create a reference (fileRef) to a DOM element. In this case, it's a reference to the file input (<Input type='file' hidden ref={fileRef}/>) that will be hidden initially.

<Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>: This line renders a button using a library or framework (possibly Chakra UI or a similar one). The onClick handler is set to an arrow function that calls fileRef.current.click(). When the button is clicked, it triggers a click on the hidden file input. This is a common pattern used to open the file dialog when a user clicks on a custom-styled button.

<Input type='file' hidden ref={fileRef}/>: This line renders an input element of type file. The hidden attribute ensures that it's not visible to the user. The ref={fileRef} associates the fileRef reference created earlier with this file input. The ref will allow you to interact with the file input in the component code.

Per react.dev:
When you pass a ref to a ref attribute in JSX, like <div ref={myRef}> , React will put the corresponding DOM element into myRef.current . Once the element is removed from the DOM, React will update myRef.current to be null . You can read more about this in Manipulating the DOM with Refs.

Explanation for <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}/>

I guess for logical OR, it returns the first truthy value. So if imgUrl is null, it would set src to user.profilePic. If it's not, then src would be set to it

*/