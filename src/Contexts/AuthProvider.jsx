import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../Firebase/firebase.init";
import axios from "axios";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const checkSubscriptionStatus = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/subscription-status/${email}`);
      setIsPremium(response.data.isPremium);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setIsPremium(false);
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const googleProvider = new GoogleAuthProvider();
  
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("User in the onAuthStateChange : ", currentUser);
      setLoading(false);
      
      // Check subscription status when user logs in
      if (currentUser?.email) {
        checkSubscriptionStatus(currentUser.email);
      } else {
        setIsPremium(false);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  // Periodically check subscription status
  useEffect(() => {
    let interval;
    if (user?.email) {
      interval = setInterval(() => {
        checkSubscriptionStatus(user.email);
      }, 60000); // Check every minute
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);

  const authInfo = {
    user,
    loading,
    isPremium,
    createUser,
    signIn,
    logOut,
    signInWithGoogle,
    checkSubscriptionStatus,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
