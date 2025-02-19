export default class TokenUtil {
  static getToken = () => {
    try {
      return localStorage.getItem("jwtToken");
    } catch (error) {
      console.error("Error retrieving JWT token from localStorage:", error);
      return null;
    }
  };

  static saveToken = (token) => {
    try {
      localStorage.setItem("jwtToken", token);
    } catch (error) {
      console.error("Error saving JWT token to localStorage:", error);
    }
  };

  static removeToken = () => {
    try {
      localStorage.removeItem("jwtToken");
    } catch (error) {
      console.error("Error removing JWT token from localStorage:", error);
    }
  };
}
