import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../Firebase/firebase.init";
import useAxios from "../Hook/useAxios";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  
  // Use the custom axios hook
  const axios = useAxios();

  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`/api/users/${email}`);
      if (response.data.success) {
        const userData = response.data.data;
        setUserProfileData(userData);
        
        // Check if user has active subscription based on subscriptionEndDate
        if (userData.subscriptionEndDate) {
          const endDate = new Date(userData.subscriptionEndDate);
          const currentDate = new Date();
          setIsPremium(currentDate < endDate);
        } else {
          setIsPremium(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsPremium(false);
      setUserProfileData(null);
    }
  };

  // Legacy method for backward compatibility
  const checkSubscriptionStatus = async (email) => {
    await fetchUserData(email);
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

  // Function to update user profile and refresh data
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    try {
      if (!user) throw new Error("No user logged in");
      
      await updateProfile(user, profileData);
      
      // Force refresh the user object to get updated data
      setUser({ ...user, ...profileData });
      
      // If email exists, also update database
      if (user.email) {
        await fetchUserData(user.email);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("User in the onAuthStateChange : ", currentUser);
      setLoading(false);
      
      // Fetch complete user data when user logs in
      if (currentUser?.email) {
        fetchUserData(currentUser.email);
      } else {
        setIsPremium(false);
        setUserProfileData(null);
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
        fetchUserData(user.email);
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
    userProfileData,
    createUser,
    signIn,
    logOut,
    signInWithGoogle,
    checkSubscriptionStatus,
    fetchUserData,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
