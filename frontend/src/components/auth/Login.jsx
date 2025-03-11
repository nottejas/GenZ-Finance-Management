import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  const isSSOCallback = location.pathname.includes('/sso-callback');

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-4">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {!isSSOCallback && (
          <div className="text-center mb-4">
            <h1 className="h2 fw-bold text-primary mb-2">Welcome Back! 👋</h1>
            <p className="text-secondary">
              Sign in to continue managing your finances
            </p>
          </div>
        )}
        
        <div className="mt-4">
          <SignIn 
            path="/login"
            routing="path"
            redirectUrl="/"
            afterSignInUrl="/"
            signUpUrl="/register"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-dark border border-custom p-4 rounded",
                headerTitle: "h3 fw-bold text-primary",
                headerSubtitle: "text-secondary",
                socialButtonsBlockButton: "btn btn-dark border-custom text-secondary w-100 mb-2",
                formButtonPrimary: "btn btn-primary w-100",
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