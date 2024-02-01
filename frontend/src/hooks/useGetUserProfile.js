import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from './useShowToast';

const useGetUserProfile = () => {
  const [user, setUser] = useState(null); //user of profile we are viewing
  const [loading, setLoading] = useState(true);
  const {username} = useParams(); //username of profile we are loading (as parameterized in the URL)
  const showToast = useShowToast()
  /* 
  REMEMBER, any component that has a useState somewhere inside it will re-render any of its components that rely on 
  that state when that state changes. That's why we can return {loading, user} without awaiting the async getUser function.
  So initially UserPage (for example - since it uses this component) will initially get {true, null} and since
  the logic in that page says to display a spinner icon when loading is true, it will initially display a spinner.
  Then, when user state is fetched and set, and loading state is set to true, a re-render of the components that rely
  on this state will happen and the proper user header will be displayed instead of the loading spinner
  */
  useEffect(() => {

    const getUser = async() => {
        try {
            const res = await fetch(`https://threads-prod-backend.onrender.com/api/users/profile/${username}`);
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setUser(data);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };
    getUser();
  }, [username, showToast]);
  return {loading, user};
}

export default useGetUserProfile

/*
Notes:
The useParams hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the <Route path>. Child routes inherit all params from their parent routes.
ex:
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function ProfilePage() {
  // Get the userId param from the URL.
  let { userId } = useParams();
  // ...
}

function App() {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId" element={<ProfilePage />} />
        <Route path="me" element={...} />
      </Route>
    </Routes>
  );
}


*/