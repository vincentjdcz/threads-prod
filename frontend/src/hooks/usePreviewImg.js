
import { useState } from 'react'
import useShowToast from './useShowToast'
const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const showToast = useShowToast();
    const handleImageChange = (e) => {
        const file = e.target.files[0]; //when a file location is uploaded to a file upload input, it can be found at e.target.files[0]
        
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader(); //create a file reader
            reader.onloadend = () => { //define callback to execute when file is done loading
                setImgUrl(reader.result); //set the state to be the result of the file read
            }
            reader.readAsDataURL(file); //read the file (in this case the image file) in such a way that the result is a URL that can be used as the src of an img element (or I guess any element that would display an image)
        } else {
            showToast("Invalid file type", "Please select an image file", "error");
            setImgUrl(null);
        }
    }

    return { handleImageChange, imgUrl, setImgUrl}
}

export default usePreviewImg 

/*
Notes:
 
ChatGPT:
This code defines a custom React hook called usePreviewImg. Let's break down what it does:

javascript
Copy code
const usePreviewImg = () => {
    // State to store the URL of the preview image
    const [imgUrl, setImgUrl] = useState(null);

    // Event handler for changes in the image input
    const handleImageChange = (e) => {
        // Get the selected file from the input
        const file = e.target.files[0];

        // Check if a file is selected and if it's an image
        if (file && file.type.startsWith("image/")) {
            // Create a FileReader to read the contents of the file
            const reader = new FileReader();

            // Define what happens when the FileReader finishes reading
            reader.onloadend = () => {
                // Set the preview image URL in the state
                setImgUrl(reader.result);
            };

            // Read the contents of the file as a data URL
            reader.readAsDataURL(file);
        }
    };

    // Return the event handler and the URL of the preview image
    return { handleImageChange, imgUrl };
};
Explanation:

const [imgUrl, setImgUrl] = useState(null);: This line declares a state variable imgUrl to store the URL of the preview image, and setImgUrl is the function to update that state.

const handleImageChange = (e) => {...}: This is an event handler function that will be used to handle changes in the image input. It's designed to be used with an input element of type file.

const file = e.target.files[0];: Extracts the selected file from the input event.

if (file && file.type.startsWith("image/")) {...}: Checks if a file is selected and if it's an image by examining its MIME type.

const reader = new FileReader();: Creates a FileReader object, which allows asynchronous reading of file contents.

reader.onloadend = () => {...}: Defines a callback that will be called when the FileReader finishes reading the file.

reader.readAsDataURL(file);: Initiates reading the contents of the file as a data URL, which can be used to set the source of an image.

return { handleImageChange, imgUrl };: Returns an object with the handleImageChange function and the imgUrl state variable. This object can be used in a component to handle image changes and get the URL of the preview image.

User
can you elaborate more on 

reader.readAsDataURL(file);

I am not familiar with that code
ChatGPT
Certainly! reader.readAsDataURL(file) is a method used with the FileReader API in JavaScript to read the contents of a File object and convert them into a data URL. This data URL represents the file's contents as a base64-encoded string, which can be used as the source of an image or for other purposes.

Here's a breakdown of how it works:

Create a FileReader object:

javascript
Copy code
const reader = new FileReader();
This line creates a new instance of the FileReader class.

Define a callback for when reading is complete:

javascript
Copy code
reader.onloadend = () => {
    // Code to execute when reading is complete
};
The onloadend event is triggered when the FileReader has finished reading the file. At this point, the file contents are available.

Read the contents of the file as a data URL:

javascript
Copy code
reader.readAsDataURL(file);
This line initiates the reading of the file. The readAsDataURL method instructs the FileReader to read the contents of the specified File object (file) and convert them into a data URL.

Handle the result in the callback:

javascript
Copy code
reader.onloadend = () => {
    // Access the result using reader.result
    const dataUrl = reader.result;
};
Once the reading is complete, the reader.result property contains the data URL representing the file's contents. This data URL can be used, for example, as the source of an image element.

In the context of the usePreviewImg hook, setImgUrl(reader.result) is used to update the state with the data URL of the preview image, allowing it to be displayed in the user interface.

User
so if I take reader.result and set the src of an <img> to be that, that image will be displayed?
ChatGPT
Exactly! If you set the src attribute of an <img> element to the value of reader.result, the image will be displayed. Here's an example:

javascript
Copy code
const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Set the state with the data URL
            setImgUrl(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

// In your JSX/React component:
<img src={imgUrl} alt="Preview" />
In this example, when the handleImageChange function is called (e.g., in response to a file input change), it reads the contents of the selected image file and sets the state (imgUrl) with the data URL. The <img> element in the JSX then displays the preview of the image using the src attribute set to the imgUrl.
*/