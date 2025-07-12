import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

const useAuth = () => {
  const authInfo = useContext(AuthContext);
  return authInfo;
}

export default useAuth