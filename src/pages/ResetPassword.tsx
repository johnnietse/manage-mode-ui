
import React from 'react';
import { useLocation } from 'react-router-dom';
import UpdatePasswordForm from '@/components/UpdatePasswordForm';

const ResetPassword = () => {
  const location = useLocation();
  // Check if there's a hash in the URL which indicates a password reset link
  const hasResetParams = location.hash.includes('type=recovery');

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-background">
      {hasResetParams ? (
        <UpdatePasswordForm />
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid or Expired Link</h1>
          <p>The password reset link appears to be invalid or has expired.</p>
          <p className="mt-4">
            <a href="/" className="text-primary hover:underline">
              Return to the login page
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
