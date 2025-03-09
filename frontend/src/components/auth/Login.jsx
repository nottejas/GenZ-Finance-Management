import React from 'react';
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back! 👋</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue managing your finances
          </p>
        </div>
        
        <div className="mt-8">
          <SignIn 
            routing="path" 
            path="/login"
            redirectUrl="/"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white shadow-sm border border-gray-200",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border border-gray-200 hover:bg-gray-50",
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
                footerActionLink: "text-purple-600 hover:text-purple-700"
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login; 