import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  const isSSOCallback = location.pathname.includes('/sso-callback');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black py-10 px-4">
      <div className="w-full max-w-md mx-auto">
        {!isSSOCallback && (
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">Welcome Back! 👋</h1>
            <p className="text-gray-300">
              Sign in to continue managing your finances
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-center w-full">
          <SignIn 
            path="/login"
            routing="path"
            redirectUrl="/"
            afterSignInUrl="/"
            signUpUrl="/register"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "bg-dark border border-custom p-4 rounded shadow-lg w-full",
                headerTitle: "h3 fw-bold text-primary",
                headerSubtitle: "text-secondary",
                socialButtonsBlockButton: "btn btn-dark border-custom text-secondary w-full mb-2",
                formButtonPrimary: "btn btn-primary w-full",
                footerActionLink: "text-primary",
                formFieldInput: "form-control bg-dark border-custom text-white",
                formFieldLabel: "text-secondary",
                dividerLine: "border-custom",
                dividerText: "text-secondary"
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login; 