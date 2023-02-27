import { createContext } from "react";
import Firebase from "./Firebase";

const FirebaseContext = createContext();
const FirebaseProvider = (props) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
