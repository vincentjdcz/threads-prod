import { useToast } from '@chakra-ui/react';
import React from 'react'

const useShowToast = () => {
    const toast = useToast();
    const showToast = (title, description, status) => {
        toast({
            title,
            description,
            status,
            duration: 3000,
            isClosable: true
        });
    };
    return showToast;
}

export default useShowToast

/*
    we decided to create a custom hook. This is basically a function that returns a function
    that takes in title, description, and status and returns a toast
*/