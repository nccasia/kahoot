const login = async (email: string, password: string) => {
  // Call the API to login
  console.log(email, password);
};
const register = async (email: string, password: string) => {
  // Call the API to register
  console.log(email, password);
};
const authServices = {
  // add other functions here to export
  login,
  register,
};
export default authServices;
