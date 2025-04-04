import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { useLocation } from 'react-router-dom';

const Register = () => {
  const location = useLocation();
  const isSSOCallback = location.pathname.includes('/sso-callback');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black py-10 px-4">
      <div className="w-full max-w-md mx-auto">
        {!isSSOCallback && (
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">Create Your Account 🚀</h1>
            <p className="text-gray-300">
              Join thousands of Gen Z users managing their finances smarter
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-center w-full">
          <SignUp 
            path="/register"
            routing="path"
            redirectUrl="/"
            afterSignUpUrl="/"
            afterSignInUrl="/"
            signInUrl="/login"
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

export default Register; 