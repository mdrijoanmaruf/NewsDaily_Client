import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
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
  
  // Use the custom axios hook
  const axios = useAxios();

  // TanStack Query for user profile data
  const {
    data: userProfileData,
    isLoading: userProfileLoading,
    refetch: refetchUserProfile
  } = useQuery({
    queryKey: ["userProfileData", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const response = await axios.get(`/api/users/${user.email}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!user?.email
  });

  // Update isPremium when userProfileData changes
  useEffect(() => {
    if (userProfileData && userProfileData.subscriptionEndDate) {
      const endDate = new Date(userProfileData.subscriptionEndDate);
      const currentDate = new Date();
      setIsPremium(currentDate < endDate);
    } else {
      setIsPremium(false);
    }
  }, [userProfileData]);

  // Legacy method for backward compatibility
  const checkSubscriptionStatus = async (email) => {
    if (email) {
      await refetchUserProfile();
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

  // Function to update user profile and refresh data
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    try {
      if (!user) throw new Error("No user logged in");
      await updateProfile(user, profileData);
      setUser({ ...user, ...profileData });
      if (user.email) {
        await refetchUserProfile();
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
      // No need to manually fetch user data, TanStack Query will handle it
      if (!currentUser?.email) {
        setIsPremium(false);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  // Periodically check subscription status
  useEffect(() => {
    // Optionally, you can refetch user profile data periodically
    let interval;
    if (user?.email) {
      interval = setInterval(() => {
        refetchUserProfile();
      }, 60000); // Check every minute
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user, refetchUserProfile]);

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
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
