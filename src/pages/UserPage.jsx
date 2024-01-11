import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
    return <>
        <UserHeader />
        <UserPost />
    </>
};

export default UserPage;

/*
    NOTES:
    <> is called a fragment in React
    A common pattern in React is for a component to return multiple elements. Fragments let you group a list of children without adding extra nodes to the DOM.
*/