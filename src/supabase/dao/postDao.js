import supabase from "../client";

const PostsAPI = {
  // 게시글 가져오기
  getPosts: async () => {
    try {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("게시글 가져오기 오류:", error.message);
      return [];
    }
  },
  getPostsbyId: async post_id => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("post_id", post_id);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("게시글 가져오기 오류:", error.message);
      return [];
    }
  },

  // 게시글 추가
  insertPost: async formData => {
    try {
      const { data, error } = await supabase.from("posts").insert([
        {
          uid: sessionStorage.getItem("id"),
          title: formData.title,
          travel_location: formData.travelLocation,
          content: formData.content,
          img_list: JSON.stringify({ img: "imgTEST" }),
        },
      ]);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("게시글 생성 오류:", error.message);
      return null;
    }
  },

  // 게시글 수정
  updatePost: async (formData, post_id) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({
          uid: sessionStorage.getItem("id"),
          title: formData.title,
          travel_location: formData.travel_location,
          content: formData.content,
          img_list: JSON.stringify({ img: "imgTEST" }),
        })
        .eq("post_id", post_id);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("게시글 수정 오류:", error.message);
      return null;
    }
  },

  // 게시글 삭제
  deletePost: async post_id => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("post_id", post_id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("게시글 삭제 오류:", error.message);
      return false;
    }
  },
};

export default PostsAPI;