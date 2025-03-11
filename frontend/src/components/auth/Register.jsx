import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { useLocation } from 'react-router-dom';

const Register = () => {
  const location = useLocation();
  const isSSOCallback = location.pathname.includes('/sso-callback');

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-4">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {!isSSOCallback && (
          <div className="text-center mb-4">
            <h1 className="h2 fw-bold text-primary mb-2">Create Your Account 🚀</h1>
            <p className="text-secondary">
              Join thousands of Gen Z users managing their finances smarter
            </p>
          </div>
        )}
        
        <div className="mt-4">
          <SignUp 
            path="/register"
            routing="path"
            redirectUrl="/"
            afterSignUpUrl="/"
            afterSignInUrl="/"
            signInUrl="/login"
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

export default Register; 