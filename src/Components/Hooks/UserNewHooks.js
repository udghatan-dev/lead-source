import { useState } from "react";
import { getLoggedinUser, getLoggedUser } from "../../helpers/api_helper";

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const [loading] = useState(userProfileSession ? false : true);
  const [userProfile] = useState(userProfileSession ? userProfileSession : null);

  return { userProfile, loading };
};

const useRole = () => {
  const userToken = getLoggedUser();
  return userToken;
};

export { useProfile, useRole };
