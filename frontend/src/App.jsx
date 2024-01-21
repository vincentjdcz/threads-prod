import { Button } from "@chakra-ui/button" 
import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";


function App() {
  
  const user = useRecoilValue(userAtom);
  console.log(user);
  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} /> 
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
        <Route path="/:username" element={<UserPage />}/>
        <Route path="/:username/post/:pid" element={<PostPage />}/>
        LEFT OFF 4:09:08
      </Routes>
      {user && <LogoutButton />}
    </Container>
  );
}

export default App

/*
Navigate 
TLDR: My guess - and we're guessing instead of thoroughly trying to understand as usual because there is way too much being introduced in this tutorial, we'll never finish it - 
is that simply put, if that component is rendered it instead renders whatever is being rendered by the route indicated by the "to" property. 
In other words, if that component is rendered we will instead navigate to the route indicated in "to".

Navigate Docs:
How to use the Navigate component
The Navigate component is one of the several built-in components in React router version 6. It is a wrapper for the useNavigate hook, and the current location changes when you render it.

import { Navigate } from "react-router-dom";

Import Navigate from react-router-dom to start using it. The Navigate component takes up to three props, only one of which is required. The other two are optional.

Below are the explanations for these three props.

<Navigate to="/dashboard" state={{ todos: []}} replace={true} />

to - A required prop. Its value should be the path which you want to navigate.
replace - An optional boolean prop. Setting its value to true will replace the current entry in the history stack.
state - An optional prop. You can use it to pass data from the component that renders Navigate.
The code below illustrates how you can use the Navigate component for navigation. We are rendering it conditionally after a state update and using the state prop to pass a route state.

const App = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [user, setUser] = useState(null);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setLoginDetails((loginDetails) => ({ ...loginDetails, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const user = await loginUser(loginDetails);
    setUser(user);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={loginDetails.email}
            onChange={changeHandler}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={loginDetails.password}
            onChange={changeHandler}
            required
          />
        </label>
        <button type="submit"> Login </button>
      </form>
      {user && <Navigate to="/dashboard" state={user} replace={true} />}
    </div>
  );
};

After navigation, the component rendered by the matching route can access the state prop passed to Navigate using the useLocation hook like so:

const location = useLocation();
console.log(location.state);
// The default value of location.state is null if you don't pass any data.

The props you pass to the Navigate component are the same as the arguments required by the function returned by the useNavigate hook.


discord banner
Conclusion
Navigate component is one of the built-in components that shipped with React router version 6. It is a React component equivalent of the useNavigate hook. It uses useNavigate internally. The props you pass to Navigate are the same as the arguments you pass to the function returned by useNavigate.

Unlike functional components in React, ES6 classes do not support hooks. Therefore, Navigate is a handy equivalent of useNavigate when working with class-based React components.

{user && <LogoutButton />} - Remember, when you have a logical && like this it returns the last operand
*/
