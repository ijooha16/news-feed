import { useContext, useState } from "react";
import styled from "styled-components";
import { HomeContext } from "../context/HomeContext";
import Comments from "../components/Comment";
import CommentsAPI from "../supabase/dao/commentDao";
import HeartIcon from "../components/HeartIcon";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";

const ShowModal = ({ post, closeModal }) => {
  const { users, comments } = useContext(HomeContext);
  const navigate = useNavigate();
  const getSession = sessionStorage.getItem("id");
  const [posts, setPosts] = useState();
  const [formData, setFormData] = useState({
    uid: sessionStorage.getItem("id"),
    content: "",
    post_id: post.post_id,
  });
  const img_path = JSON.parse(post.img_list);
  if (!post) return null;
  const handleSubmitComment = async e => {
    e.preventDefault();

    if (!formData.content) {
      alert("댓글 내용을 입력해주세요!");
      return;
    } else CommentsAPI.insertComment(formData, post.post_id);
  };

  const handleChangeInput = e => {
    const content = e.target.value;
    console.log(content);
    setFormData({
      uid: sessionStorage.getItem("id"),
      content: content,
      post_id: post.post_id,
    });
  };

  const removePostHandler = async post_id => {
    try {
      // 댓글 삭제
      const { error: commentError } = await supabase
        .from("comments")
        .delete()
        .eq("post_id", post_id);

      if (commentError) {
        console.error("댓글 삭제 오류:", commentError);
        return;
      }

      console.log("댓글 삭제 완료:", post_id);

      // 최신 상태를 유지하며 댓글 목록 업데이트
      setFormData(comments.filter(c => c.post_id !== post_id));

      // 좋아요 삭제
      const { error: likeError } = await supabase
        .from("likes")
        .delete()
        .eq("uid", getSession)
        .eq("post_id", post_id);

      if (likeError) {
        console.error("좋아요 삭제 오류:", likeError);
        return;
      }

      console.log("좋아요 삭제 완료:", post_id);

      // 최신 상태를 유지하며 좋아요 목록 업데이트
      // setFormData(prevComments => prevComments.filter(c => c.post_id !== post_id));

      // 게시물 삭제
      const { error: postError } = await supabase
        .from("posts")
        .delete()
        .eq("post_id", post_id);

      if (postError) {
        console.error("게시물 삭제 오류:", postError);
        return;
      }

      console.log("게시물 삭제 완료:", post_id);

      // 최신 상태를 유지하며 게시물 목록 업데이트
      setPosts(prevPosts => prevPosts.filter(e => e.post_id !== post_id));
      navigate("/my-page");
      closeModal();
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
  };

  const editPostHandler = async post => {
    sessionStorage.setItem("post_id", post.post_id);
    sessionStorage.setItem("post_title", post.title);
    sessionStorage.setItem("post_travel", post.travel_location);
    sessionStorage.setItem("post_content", post.content);
    console.log(post);
    navigate("/posting");
  };

  return (
    <EntireModal key={post.uid}>
      <PostModal>
        <Post>
          <PostTitle>{post.title}</PostTitle>
          <p>{users.nickname}</p>
          <ButtonDiv>
            <button onClick={() => editPostHandler(post)}>수정</button>
            <button onClick={() => removePostHandler(post.post_id)}>
              삭제
            </button>
          </ButtonDiv>
          <ModalImg src={img_path.publicUrl}></ModalImg>
          <Icons>
            <p>{comments.content}</p>
            <HeartIcon post_id={post.post_id} />
          </Icons>
          <p>{post.content}</p>
        </Post>
        <Comment>
          <CloseBtn onClick={closeModal}>&times;</CloseBtn>
          <UserCommentScrollBox>
            <Comments post_id={post.post_id} />
          </UserCommentScrollBox>
          <CommentInputDiv>
            <form>
              <input type="text" onChange={handleChangeInput}></input>
              <button type="submit" onClick={handleSubmitComment}>
                댓글등록
              </button>
            </form>
          </CommentInputDiv>
        </Comment>
      </PostModal>
    </EntireModal>
  );
};

export default ShowModal;

// styled-commponents

const ButtonDiv = styled.div`
  margin-left: auto;
`;

const ModalImg = styled.img`
  width: 400px;
`;
const EntireModal = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.768);
  z-index: 2;
`;

const PostModal = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 65%;
  min-height: 500px;
  background-color: #ffffff;
  display: flex;
  grid-template-columns: 1.5fr 1fr;
  border-radius: 20px;
  @media (max-width: 700px) {
    flex-direction: column;
    overflow-y: scroll;
    height: 80%;
  }
`;

const Post = styled.div`
  display: grid;
  justify-content: center;

  height: 100%;
  padding: 20px;
`;

const PostTitle = styled.div`
  padding: 10px;
  text-align: center;
  font-size: larger;
  font-weight: 800;
`;

const Icons = styled.div`
  display: flex;
`;

const Comment = styled.div`
  background-color: #cee0ff;
  border-radius: 0 20px 20px 0;
  width: 100%;
  height: 100%;
  @media (max-width: 700px) {
    border-radius: 0;
    padding: 10px 0;
  }
`;

const CloseBtn = styled.span`
  display: flex;
  justify-content: flex-end;
  margin: 10px 20px;
  font-size: larger;
  cursor: pointer;
  @media (max-width: 700px) {
    position: absolute;
    top: 15px;
    right: 0px;
  }
`;

const UserCommentScrollBox = styled.div`
  height: 70%;
  width: 95%;
  margin: 0 auto;
  overflow: hidden;
  overflow-y: scroll;
  padding-right: 20px;
  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #004ecc;
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #0062ff;
    cursor: pointer;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  @media (max-width: 700px) {
    padding: 10px 0;
  }
`;

const CommentInputDiv = styled.div`
  height: 20%;
  background: #cee0ff;
  position: absolute;
  bottom: 0;
  width: -webkit-fill-available;
  padding: 10px;
  border-radius: 20px;
  form {
    width: 100%;
    height: 100%;
    input {
      border-radius: 10px 10px 0 0;
      width: 100%;
      height: calc(100% - 40px);
      border: none;
      padding: 20px;
    }
    button {
      background: #003899;
      width: 100%;
      height: 40px;
      border: none;
      border-radius: 0px 0px 6px 6px;
      font-size: 14px;
      color: #fff;
      border-radius: 0 0 10px 10px;
      transition: background-color 0.3s ease-in-out;
      &:hover {
        background: #0062ff;
        cursor: pointer;
      }
    }
  }
  @media (max-width: 700px) {
    position: static;
    border-radius: 0;
    height: auto;
  }
`;