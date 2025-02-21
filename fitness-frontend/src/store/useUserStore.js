import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // Redux DevTools & persist
export const useUserStore = create(
  //use persist then the localstorage system automatically persists
  persist(
    devtools((set, get) => ({
      userInfo: {},
      token: "",
      setUserInfo: (userInfo) => set({ userInfo }),
      setToken: async (newToken, getUserInfo) => {
        set({ token: newToken });
        if (getUserInfo) {
          try {
            // After setting the token, the user information should be obtained immediately and stored
            // use newToken directly
            // const userInfo = await getUserInfo(newToken); //real logic
            const userInfo = {
              data: {
                name: "haowenhai",
                role: "member", //test role
                email: "111111",
              },
            }; //test data
            console.log("userInfo:", userInfo.data);
            set({ userInfo: userInfo.data }); // userInfo contains the user's role
            // return userInfo.data.role; // return role
          } catch (error) {
            console.error(error);
          }
        }
      },
      getDefaultPath: () => {
        const role = get().userInfo?.role;
        if (role === "member") return "/member";
        if (role === "admin") return "/admin";
        if (role === "trainer") return "/trainer";
        return "/error";
      },
    })),
    {
      name: "user-storage",
      partialize: (state) => ({ token: state.token, userInfo: state.userInfo }), // Only partial state is persisted
    }
  )
);

// 查询 Token 和 UserInfo
export const selectUserInfo = () => useUserStore((state) => state.userInfo);
export const selectToken = () => useUserStore((state) => state.token);
