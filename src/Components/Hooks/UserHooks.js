import { useState, useEffect } from "react";
import { getLoggedinUser, getUserToken } from "../../helpers/api_helper";

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const [loading] = useState(userProfileSession ? false : true);
  const [userProfile] = useState(userProfileSession ? userProfileSession : null);

  return { userProfile, loading };
};

const useSession = () => {
  const session = getUserToken();
  const [userSession, setUserSession] = useState(session);
  useEffect(() => {
    setUserSession(session);
  }, [session]);
  return { userSession };
};

export { useProfile, useSession };
