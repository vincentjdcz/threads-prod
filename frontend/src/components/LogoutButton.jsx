import { Button } from "@chakra-ui/react"
import useShowToast from "../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { FiLogOut } from "react-icons/fi"
const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const handleLogout = async () => {
    try {
        
        const res = await fetch("api/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            }
        });
        const data = await res.json();
        console.log(data);
        if(data.error) {
            showToast("Error", data.error, "error");
            return;
        }
        localStorage.removeItem("user-threads"); //remove user from local storage
        setUser(null); //set our userAtom (holds state of our user) value to null
        //I guess we don't need to clear cookies on our end? I guess since we clear it on the backend, when we get a response with no cookie the browser clears its cookie too?
        //^Re: line above - chatgpt says you should clear it yourself on the front end
    } catch (error) {
        showToast("Error", error, "error");
    }
  }
  return (
    <Button
        position="fixed"
        top="30px"
        right="30px"
        size="sm"
        onClick={handleLogout}
    ><FiLogOut size={20}/></Button>
  )
}

export default LogoutButton