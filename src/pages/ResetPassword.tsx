
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UpdatePasswordForm from '@/components/UpdatePasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validLink, setValidLink] = useState(false);

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        setLoading(true);
        
        // Get the full URL including hash
        const fullUrl = window.location.href;
        console.log('Full reset URL:', fullUrl);
        
        // Check if this is a password reset link
        if (fullUrl.includes('type=recovery') && fullUrl.includes('access_token=')) {
          console.log('Valid password reset link detected');
          
          // Extract tokens from URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          console.log('Access token found:', !!accessToken);
          console.log('Refresh token found:', !!refreshToken);
          
          if (!accessToken) {
            throw new Error('No access token found in reset link');
          }
          
          // Set the session using the tokens from the reset link
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error('Error setting session from reset link:', error);
            throw error;
          }
          
          if (data?.session?.user) {
            console.log('Successfully authenticated user for password reset:', data.session.user.email);
            setValidLink(true);
            
            // Clear the URL hash to clean up the interface
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            throw new Error('Failed to authenticate with reset link');
          }
        } else {
          console.error('Invalid reset link - missing required parameters');
          throw new Error('Invalid password reset link. Please use the complete link from your email.');
        }
      } catch (error: any) {
        console.error('Password reset link error:', error);
        setValidLink(false);
        toast({
          title: "Invalid or expired reset link",
          description: error.message || "Please request a new password reset link from the login page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handlePasswordReset();
  }, []);

  const handleReturnToLogin = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-4 text-center">Verifying your reset link...</p>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              This may take a few seconds
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-background">
      {validLink ? (
        <UpdatePasswordForm />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-destructive">
              Reset Link Invalid
            </CardTitle>
            <CardDescription className="text-center">
              The password reset link appears to be invalid, expired, or already used.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                This can happen if:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• The link has expired (links expire after 1 hour)</li>
                <li>• The link has already been used</li>
                <li>• The link was not copied completely</li>
              </ul>
            </div>
            <Button onClick={handleReturnToLogin} className="w-full">
              Return to Login & Request New Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResetPassword;
