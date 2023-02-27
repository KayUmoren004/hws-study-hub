import React from "react";

const UserContext = React.createContext([{}, () => {}]);

const UserProvider = (props) => {
  // State
  const [state, setState] = React.useState({
    name: "",
    email: "",
    phoneNumber: "",
    uid: "",
    isLoggedIn: null,
    profilePhotoUrl: "",
    isEmailVerified: false,
    isPhoneVerified: false,
    tags: ["default"],
    status: "",
    isTF: false,
    totalHelped: 0,
  });

  // Return
  return (
    <UserContext.Provider value={[state, setState]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
