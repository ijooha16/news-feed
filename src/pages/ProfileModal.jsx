import styled from "styled-components";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import UsersAPI from "../supabase/dao/userDao";
import { uploadFile } from "../supabase/dao/ImgDao";

const ProfileModal = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    introduction: "",
    link: "",
    mbti: "",
    profile_img: "",
  });

  const [savedData, setSavedData] = useState({
    nickname: "",
    introduction: "",
    link: "",
    mbti: "",
    profile_img: "",
  });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await UsersAPI.getUserInfo();
      const userData = data?.[0];
      console.log("getUserInfo:", data);
      if (userData) {
        setFormData({
          nickname: userData.nickname,
          introduction: userData.introduction,
          link: userData.link,
          mbti: userData.mbti,
          profile_img: userData.profile_img || "",
        });
        setSavedData({
          nickname: userData.nickname,
          introduction: userData.introduction,
          link: userData.link,
          mbti: userData.mbti,
          profile_img: userData.profile_img || "",
        });
      }
    };
    fetchUserData();
  }, [user]);

  const handleProfileUpdate = async e => {
    e.preventDefault();

    if (!user) return;

    try {
      console.log(formData);
      const { data, error } = await UsersAPI.updateUser(formData);

      if (error) throw error;

      setSavedData({ ...formData });

      console.log("complete", data);
    } catch (error) {
      alert(error.message);
      console.error("업데이트 오류", error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpdate = async e => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedImage = await uploadFile(file);
        const imageUrl = uploadedImage.profile_img;

        setFormData({ ...formData, profile_img: imageUrl });

        const { data, error } = await UsersAPI.updateUser({
          ...formData,
          profile_img: imageUrl,
        });

        if (error) {
          throw error;
        }
        console.log("이미지 업로드 완료", data);
      } catch (error) {
        alert("업로드 실패");
        console.error("Error image", error);
      }
    }
  };

  return (
    <ProfileBox>
      <Profile>
        <EditImg>
          <img src={formData.profile_img || "/default-image.jpg"} />
          <input type="file" accept="image/*" onChange={handleImageUpdate} />
        </EditImg>
        <EditForm onSubmit={handleProfileUpdate}>
          <EditNickname>
            <label>{savedData.nickname || "닉네임"}</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              placeholder="닉네임"
              onChange={handleChange}
              required
            />
          </EditNickname>

          <EditIntro>
            <label>{savedData.introduction || "한줄소개"}</label>
            <input
              type="text"
              name="introduction"
              value={formData.introduction}
              placeholder="소개를 입력해주세요."
              onChange={handleChange}
              required
            />
          </EditIntro>

          <EditLink>
            <label>{savedData.link || "링크"}</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              placeholder="링크"
              onChange={handleChange}
              required
            />
          </EditLink>

          <EditMBTI>
            <label>{savedData.mbti || "MBTI"}</label>
            <input
              type="text"
              name="mbti"
              value={formData.mbti}
              placeholder="mbti"
              onChange={handleChange}
              required
            />
          </EditMBTI>
          <button type="submit">저장</button>
        </EditForm>
      </Profile>
    </ProfileBox>
  );
};
export default ProfileModal;

const ProfileBox = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.768);
  z-index: 2;
`;

const Profile = styled.div`
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

const EditImg = styled.div`
  width: 25px;
  height: 25px;
`;

const EditForm = styled.form`
  height: 20%;
  background: #cee0ff;
  position: absolute;
  bottom: 0;
  width: -webkit-fill-available;
  padding: 10px;
  border-radius: 20px;

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

  @media (max-width: 200px) {
    position: static;
    border-radius: 0;
    height: auto;
  }
`;

const EditNickname = styled.div`
  background-color: #cee0ff;
  border-radius: 0 20px 20px 0;

  @media (max-width: 700px) {
    border-radius: 0;
    padding: 10px 0;
  }
`;

const EditIntro = styled.div`
  background-color: #cee0ff;
  border-radius: 0 20px 20px 0;

  @media (max-width: 700px) {
    border-radius: 0;
    padding: 10px 0;
  }
`;

const EditLink = styled.div`
  background-color: #cee0ff;
  border-radius: 0 20px 20px 0;

  @media (max-width: 700px) {
    border-radius: 0;
    padding: 10px 0;
  }
`;

const EditMBTI = styled.div`
  background-color: #cee0ff;
  border-radius: 0 20px 20px 0;

  @media (max-width: 700px) {
    border-radius: 0;
    padding: 10px 0;
  }
`;
