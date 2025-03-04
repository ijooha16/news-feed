import supabase from "../client";

const UsersAPI = {
  // 유저 정보 업데이트
  updateUser: async formData => {
    try {
      const userId = sessionStorage.getItem("id");
      if (!userId) throw new Error("로그인 정보가 없습니다");

      const { data, error } = await supabase
        .from("users")
        .update({
          nickname: formData.nickname,
          mbti: formData.mbti,
          introduction: formData.introduction,
          link: formData.link,
          profile_img: formData.profile_img,
        })
        .eq("uid", userId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("유저 정보 업데이트 오류:", error.message);
      return null;
    }
  },

  getUserInfo: async () => {
    try {
      const userId = sessionStorage.getItem("id");
      if (!userId) alert("사용자 정보가 없습니다");

      const { data, error } = await supabase
        .from("users")
        .select("profile_img, nick_name")
        .eq("uid", userId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("유저 정보 가져오기 오류:", error.message);
      return null;
    }
  },
};

export default UsersAPI;
