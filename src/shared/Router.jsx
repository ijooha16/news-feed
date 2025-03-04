import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider.jsx";
import { useContext } from "react";

import Home from "../pages/Home.jsx";
import MyPage from "../pages/MyPage.jsx";
import Posting from "../pages/Posting.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import Layout from "../components/layout/Layout.jsx";
import ProfileModal from "../pages/ProfileModal.jsx";
import PostingModal from "../pages/PostingModal.jsx";

const Router = () => {
  //const { isSignin } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<PostingModal />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/posting" element={<Posting />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<ProfileModal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
