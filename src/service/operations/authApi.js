import { toast } from "react-hot-toast";
import { endpoints } from "../api";
import { apiConnector } from "../apiConnector";
import { setIsAuth, setLoading, setToken, setUser } from "../../slices/authSlice";

const {
  SIGNUP_API,
  LOGIN_API,
  UPDATE_PASSWORD_API,
  RESET_PASSWORD_API,
  FORGET_PASSWORD_API,
  GET_ME_API,
} = endpoints;

export function signUp(role, name, email, password, password_confirmation, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        role,
        name,
        email,
        password,
        password_confirmation,
      });
      console.log("SIGNUP API RESPONSE.........", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successfully");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR.........", error);
      const errorMessage = error.response.data.error;
      toast.error(errorMessage);
      navigate("/signup");
    } finally {
      toast.dismiss(toastId);
    }
    dispatch(setLoading(false));
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE.........", response);

      if (response.status !== 200) {
        throw new Error(response.data);
      }

      toast.success("Login Successfully");
      dispatch(setToken(response.data.access_token));
      dispatch(setIsAuth(true));
      const expirationTime = Date.now() + response.data.expires_in * 1000; // Convert to milliseconds
      localStorage.setItem("token", JSON.stringify(response.data.access_token));
      localStorage.setItem("expirationTime", JSON.stringify(expirationTime)); // Store expiration time
      // const userImage = response.data?.data?.user?.user_profile?.avatar
      //   ? response.data.data.user.user_profile.avatar
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.user.user_profile.firstName} ${response.data.data.user.user_profile.lastName}`;
      // dispatch(setUser({ ...response.data.data.user, avatar: userImage }));

      navigate("/dashboard");
    } catch (error) {
      console.log("LOGIN API ERROR........", error);
      const errorMessage = error.response.data.error;
      toast.error(errorMessage);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getMe(navigate, token) {
  return async (dispatch) => {
    // console.log(token);
    if (!token) {
      console.log("No token provided, redirecting to sign-in.");
      toast.error("No token found. Please log in.");
      dispatch(setToken(null));
      dispatch(setIsAuth(false));
      return;
    }
    const toastId = toast.loading("Fetching current user...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", GET_ME_API, null, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      console.log("GET ME API RESPONSE.........", response);

      if (response.status !== 200) {
        throw new Error(response.data);
      }
      dispatch(setUser(response.data));
      dispatch(setIsAuth(true));
      toast.success("Current Login User Fetched Successfully");

      navigate("/dashboard");
    } catch (error) {
      console.log("LOGIN API ERROR........", error);

      const errorMessage = error?.response?.data?.error || "Failed to fetch user";
      toast.error(errorMessage);
      dispatch(setToken(null));
      dispatch(setIsAuth(false));
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      // navigate("/authentication/sign-in");
    } finally {
      dispatch(setLoading(false));
    }
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    console.log("LOGOUT");
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setIsAuth(false));
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    toast.success("Logged Out");
    navigate("/authentication/sign-in");
  };
}

// export function updatePassword(currentPassword, newPassword, passwordConfirm, token, navigate) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Updating password...");
//     dispatch(setLoading(true));

//     try {
//       const response = await apiConnector(
//         "PATCH",
//         UPDATE_PASSWORD_API,
//         {
//           currentPassword,
//           newPassword,
//           passwordConfirm,
//         },
//         {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         }
//       );

//       console.log("UPDATE PASSWORD RESPONSE.....", response);

//       if (response.status !== 200) {
//         throw new Error("Couldn't update your password");
//       }

//       toast.success("Password has been updated successfully");
//       navigate("/");
//     } catch (error) {
//       console.log("UPDATE PASSWORD ERROR", error);
//       toast.error("Failed to update password");
//     }
//     toast.dismiss(toastId);
//     dispatch(setLoading(false));
//   };
// }

export function resetPassword(email, password, password_confirmation, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", `RESET_PASSWORD_API`, {
        token,
        email,
        password,
        password_confirmation,
      });
      console.log("RESET PASSWORD RESPONSE.....", response);

      if (response.status !== 200) {
        throw new Error("Couldn't reset your password");
      }

      toast.success("Password has been reset successfully");
      navigate("/login");
    } catch (error) {
      console.log("RESET PASSWORD ERROR", error);
      const errorMessage = error.response.data.error;
      toast.error(errorMessage);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// export function forgotPassword(email, navigate) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading...");
//     dispatch(setLoading(true));

//     try {
//       const response = await apiConnector("POST", FORGET_PASSWORD_API, {
//         email,
//       });

//       console.log("FORGOT PASSWORD RESPONSE.....", response);

//       if (response.status !== 200) {
//         throw new Error("Failed to send reset password email");
//       }

//       toast.success("Reset password link has been sent to your email");
//       navigate("/"); // Redirect to home or login page
//     } catch (error) {
//       console.log("FORGOT PASSWORD ERROR", error);
//       toast.error("Failed to send reset password email");
//     }

//     toast.dismiss(toastId);
//     dispatch(setLoading(false));
//   };
// }
