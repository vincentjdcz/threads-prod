import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [postText, setPostText] = useState('');
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(); //lets us preview an image, like we did with the avatar image. Also holds state for image, in this case the image of our post
  const imageRef = useRef(null); //we use this to reference an element (by assigning this variable to that element in its ref prop)
  const [ remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [ loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if(inputText.length > MAX_CHAR) { //if the input exceeds max characters
        const truncatedText = inputText.slice(0, MAX_CHAR); //truncate the text
        setPostText(truncatedText); //set the state for post text to be the truncated text
        setRemainingChar(0); //set the state tracking the remaining characters to be 0
    } else { //we have not exceeded max characters
        setPostText(inputText); //set state for post text to the input text
        setRemainingChar(MAX_CHAR - inputText.length); //set the state tracking the remaining characters to be the remaining evailable characters (max length - the characters used in the text so far)
    }
  }

  const handleCreatePost = async () => {
    setLoading(true);
    try {

        const res = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({postedBy: user._id, text: postText, img:imgUrl})
        })
        const data = await res.json();
        if(data.error) {
            showToast("Error", data.error, "error");
            return;
        }
        showToast("Success", "Post created successfully", "success");
        onClose(); //close the modal
        setPostText("");
        setImgUrl("");
    } catch (error) {
        showToast("Error", error, "error");
    } finally {
        setLoading(false);
    }

  };

  return ( 
    <> 
        <Button
            position={"fixed"}
            bottom={10}
            right={10}
            leftIcon={<AddIcon />}
            bg={useColorModeValue("gray.300", "gray.dark")}
            onClick={onOpen}
        >
            Post
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
        
          <FormControl>
            <Textarea 
              placeholder='Post content goes here..'
              onChange={handleTextChange}
              value={postText}
            />
            <Text fontSize="xs"
               fontWeight="bold"
               textAlign={"right"}
               m={1}
               color="gray.800" >
                {remainingChar}/{MAX_CHAR}
            </Text>

            <Input
              type="file"
              hidden
              ref={imageRef}
              onChange={handleImageChange}
            />
            <BsFillImageFill
              style={{marginLeft:"5px", cursor:"pointer"}}
              size={16}
              onClick={() => imageRef.current.click()}
            />
          </FormControl>
          
          {imgUrl && (
            <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt='Selected img' />
                <CloseButton 
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
            </Flex>
          )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost

/*
Notes:

leftIcon: 
Per ChakraUI:
Button with icon
You can add left and right icons to the Button component using the leftIcon and rightIcon props respectively.

Note: The leftIcon and rightIcon prop values should be react elements NOT strings.

useDisclosure(): 
useDisclosure
useDisclosure is a custom hook used to help handle common open, close, or toggle scenarios. It can be used to control feedback component such as Modal, AlertDialog, Drawer, etc.

Import#
import { useDisclosure } from '@chakra-ui/react'
Return value#
The useDisclosure hook returns an object with the following fields:

Name	Type	Default	Description
isOpen	boolean	false	If true, it sets the controlled component to its visible state.
onClose	function		Callback function to set a falsy value for the isOpen parameter.
onOpen	function		Callback function to set a truthy value for the isOpen parameter.
*/