"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { LoginUser } from "@/cms/AccountHelpers/account-helper";
import { account, team } from "@/cms/cms.config";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/Loader";

const AuthContext = createContext({
  currentUser: null,
  isUserLoggedIn: false,
  Login: () => {},
  Logout: () => {},
  isLoading: false,
  isAdmin: false,
  isSuperAdmin: false,
  isAdjuster: false,
});

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isAdjuster, setAdjuster] = useState(false);
  const [isSuperAdmin, setSuperadmin] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const persistUserData = (userData, roles) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("userRoles", JSON.stringify(roles));
  };

  const loadUserDataFromStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    const storedRoles = JSON.parse(localStorage.getItem("userRoles"));
    if (storedUser && storedRoles) {
      setUser(storedUser);
      setUserLoggedIn(true);
      setAdmin(storedRoles.includes("admins"));
      setSuperadmin(storedRoles.includes("superadmins"));
      setAdjuster(storedRoles.includes("adjusters"));
    }
  };

  const handleLogin = async (email, password) => {
    setUserLoading(true);
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{8,}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Enter a valid email",
        className: "text-red-600",
      });
      return;
    }
    if (!passwordRegex.test(password)) {
      toast({
        title: "Password should contain at least 8 characters",
        className: "text-red-600",
      });
      return;
    }
    const res = await LoginUser(email, password);
    if (res.success) {
      toast({
        title: "Signed in successfully",
        className: "text-green-700",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "left-accent",
        containerStyle: {
          backgroundColor: "green.500",
          color: "white",
        },
      });
      setUser(res.data);
      const result = await team.list();
      const { teams } = result;
      const roles = [];
      if (teams && teams.length > 0) {
        teams.forEach((item) => {
          if (item && typeof item.name === "string") {
            const itemRole = item.name.toLowerCase().replace(/\s/g, "");
            if (itemRole === "superadmins") {
              setSuperadmin(true);
              roles.push("superadmins");
            }
            if (itemRole === "admins") {
              setAdmin(true);
              roles.push("admins");
            }
            if (itemRole === "adjusters") {
              setAdjuster(true);
              roles.push("adjusters");
            }
          }
        });
      } else {
        setSuperadmin(false);
        setAdmin(false);
        setAdjuster(false);
      }
      persistUserData(res.data, roles);
      setUserLoggedIn(true);
      setUserLoading(false);
      router.push("/claims");
      window.location.reload();
    } else {
      toast({
        title: res?.message,
        className: "text-red-600",
      });
      setUserLoading(false);
      setUserLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await account.deleteSessions();
      if (result) {
        setUserLoggedIn(false);
        localStorage.removeItem("userData");
        localStorage.removeItem("userRoles");
        toast({
          title: "You have been signed out",
          className: "text-green-700",
          duration: 5000,
          isClosable: true,
          position: "top-right",
          variant: "left-accent",
          containerStyle: {
            backgroundColor: "green.500",
            color: "white",
          },
        });
        router.push("/login");
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error?.message || "An error occurred while logging out.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (navigator.onLine) {
        try {
          const userDetails = await account.get();
          if (userDetails) {
            setUser(userDetails);
            const res = await team.list();
            setUserLoggedIn(true);
            const roles = [];
            if (res) {
              const { teams } = res;
              if (teams && teams.length > 0) {
                teams.forEach((item) => {
                  if (item && typeof item.name === "string") {
                    const itemRole = item.name.toLowerCase().replace(/\s/g, "");
                    if (itemRole === "superadmins") {
                      setSuperadmin(true);
                      roles.push("superadmins");
                    }
                    if (itemRole === "admins") {
                      setAdmin(true);
                      roles.push("admins");
                    }
                    if (itemRole === "adjusters") {
                      setAdjuster(true);
                      roles.push("adjusters");
                    }
                  }
                });
              } else {
                setSuperadmin(false);
                setAdmin(false);
                setAdjuster(false);
              }
            }
            persistUserData(userDetails, roles);
          } else {
            setUserLoggedIn(false);
          }
        } catch (error) {
          console.log("error", error.message);
          setUserLoggedIn(false);
        }
      } else {
        loadUserDataFromStorage();
      }
      setUserLoading(false);
    };
    getUser();
  }, []);

  const ctxValue = useMemo(
    () => ({
      currentUser: user,
      Login: handleLogin,
      Logout: handleLogout,
      isUserLoggedIn: userLoggedIn,
      isLoading: userLoading,
      isAdmin,
      isSuperAdmin,
      isAdjuster,
      userLoading,
    }),
    [user, handleLogin, handleLogout, userLoggedIn, userLoading, isAdmin, isSuperAdmin, isAdjuster]
  );

  if (userLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
