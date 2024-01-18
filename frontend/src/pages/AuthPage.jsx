import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard"
import authScreenAtom from '../atoms/authAtom';
import { useRecoilValue } from "recoil";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  return (
    <>
    {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
    </>
  );
};

export default AuthPage

/*
NOTES

Typing in "rafce" will give you boiletplate for this page
*/