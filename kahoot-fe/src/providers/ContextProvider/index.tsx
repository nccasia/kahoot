import React from "react";
import AppProvider from "./AppProvider";
import AuthProvider from "./AuthProvider";

const ContextProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <AppProvider>
      <AuthProvider>
        {/* add other provider hear */}
        {children}
      </AuthProvider>
    </AppProvider>
  );
};

export default ContextProvider;
