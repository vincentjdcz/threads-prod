import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
//Consider returning the likes array in the post controller instead so that we can get updated likes

const Actions = ({ post }) => { //renamed post prop to post_ so as not to confuse the post prop from the post state that we define a couple lines down

  //if(!post_) return; //they don't do this in the video. they just check if post exists in PostPage before rendering. But already spent 2 hours trying to figure out why it becomes null here so doing this for now, check this aback later
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post.likes.includes(user?._id)); 
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  


  const handleLikeAndUnlike = async () => {
	if(!user) return showToast('Error', 'You must be logged in to like a post', 'error');
	if(isLiking) return;
	setIsLiking(true)
	try {
	  const res = await fetch("https://threads-prod-backend.onrender.com/api/posts/like/" + post._id, {
		method: "PUT",
		credentials: 'include',  // Include credentials (cookies) in the request
		headers: {
			"Content-Type": "application/json",
		}
	  });
	  const data = await res.json();
	  if(data.error) return showToast('Error', data.error, 'error');
	  if(!liked) {
		//post is not yet liked
		const updatedPosts = posts.map((p) => { //map will iterate over all posts
			if(p._id === post._id) { //if we find the post we are liking
				return { ...p, likes: [...p.likes, user._id]}; //add our user id to the likes array of that post. remember ...p spreads all the attributes of p, so we're taking all the attributes p originally had then changing the likes attribute. 
			}
			return p;
		});
		setPosts(updatedPosts);
	  } else {
		//post is already liked, so we're unliking
		const updatedPosts = posts.map((p) => { //iterate over posts
			if(p._id === post._id) { //if post is the one we are unliking
				console.log("Post Before: ", p);
				console.log("User Id: ", user._id);
				return ({...p, likes: p.likes.filter((id) => id !== user._id)}); //remove our current user from the likes array
			
			}
			//console.log("Posts after: ", updatedPosts);
			return p;
		})
		setPosts(updatedPosts);
	  }

	  setLiked(!liked);
	} catch (error) {
		showToast("Error", error, "error");
	} finally {
		setIsLiking(false);
	}
  }

  const handleReply = async () => {
    if(!user) return showToast("Error", "You must be logged in to reply to a post", "error"); //case where user is not logged in
	if (isReplying) return;
	setIsReplying(true);
	try {
      const res = await fetch("https://threads-prod-backend.onrender.com/api/posts/reply/" + post._id, {
		method: "PUT",
		credentials: 'include',  // Include credentials (cookies) in the request
		headers: {
			"Content-Type": "application/json",

		},
		body: JSON.stringify({text:reply})
	  }) //remember, in the backend we use the label "text" to grab the reply from the request body
	  const data = await res.json();

	  if(data.error) return showToast("Error", data.error, "error");

	  const updatedPosts = posts.map((p) => { //iterate over all posts
		if(p._id === post._id) { //if post is the same as the post we are replying to (the post we are viewing)
			return {...p, replies: [...p.replies, data]}; //add our reply to the replies of that post
		}
		return p; //otherwise just return the post as is
	  }) 
	  setPosts(updatedPosts); //see postsAtom for description of what state it holds.since we are modifying this state, the page we are on (whether feed, postPage, or our profile) will rerender
	  showToast("Success", "Reply posted successfully", "success");
	  console.log(data);
	  onClose(); //close the modal window
	  setReply("");
	} catch (error) {
		showToast("Error", error.message, "error");
	} finally {
		setIsReplying(false);
	}
  }

  return (
	<Flex flexDirection = "column">
    <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
				<svg
					aria-label='Like'
					color={liked ? "rgb(237, 73, 86)" : ""}
					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
					height='19'
					role='img'
					viewBox='0 0 24 22'
					width='20'
					onClick={handleLikeAndUnlike}
				>
					<path
						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
						stroke='currentColor'
						strokeWidth='2'
					></path>
				</svg>

				<svg
					aria-label='Comment'
					color=''
					fill=''
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={onOpen}
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>

				<RepostSVG />
				<ShareSVG />
				</Flex>
				<Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize="sm">{post.replies.length} replies</Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize="sm">{post.likes.length} likes</Text>
                    </Flex> {/* Replies */}

					<Modal
					isOpen={isOpen}
					onClose={onClose}
				>
					<ModalOverlay />
					<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
						<Input as="textarea" placeholder='Reply goes here..'
						 value={reply}
						 onChange={(e) => setReply(e.target.value)}/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' size={"sm"} mr={3}
						  isLoading={isReplying}
						  onClick={handleReply}>
						Reply
						</Button>
					</ModalFooter>
					</ModalContent>
				</Modal>
			</Flex>

  )
}

const RepostSVG = () => {
	return (
		<svg
			aria-label='Repost'
			color='currentColor'
			fill='currentColor'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Repost</title>
			<path
				fill=''
				d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
			></path>
		</svg>
	);
};

const ShareSVG = () => {
	return (
		<svg
			aria-label='Share'
			color=''
			fill='rgb(243, 245, 247)'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Share</title>
			<line
				fill='none'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
				x1='22'
				x2='9.218'
				y1='3'
				y2='10.083'
			></line>
			<polygon
				fill='none'
				points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
			></polygon>
		</svg>
	);
};
export default Actions 

/*
	NOTES:
	<Input> in the modal in the tutorial does not have as="textarea". You added that so that you can 
	adjust the input size. Keep this in mind if something goes wrong later
*/