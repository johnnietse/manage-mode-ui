
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
    const checkPasswordRecoverySession = async () => {
      try {
        setLoading(true);
        
        // Check if URL contains access_token and type=recovery
        const hash = location.hash;
        console.log('Reset link hash:', hash);
        
        if (hash && hash.includes('access_token=') && hash.includes('type=recovery')) {
          // Extract the access token from the hash
          const accessToken = hash
            .substring(1) // Remove the leading #
            .split('&')
            .find(param => param.startsWith('access_token='))
            ?.split('=')[1];
            
          if (!accessToken) {
            console.error('No access token found in URL');
            throw new Error('Invalid access token in URL');
          }
          
          console.log('Found access token in URL, attempting to set session');
          
          // Set the session from the recovery token
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: '',
          });
          
          if (error) {
            console.error('Error setting session:', error);
            throw error;
          } else {
            console.log('Successfully set recovery session:', data.session?.user?.email);
            setValidLink(true);
          }
        } else {
          console.error('Invalid or missing reset link parameters:', hash);
          setValidLink(false);
          throw new Error('Invalid reset link format. Make sure you use the complete link from your email.');
        }
      } catch (error: any) {
        console.error('Error checking password recovery session:', error);
        setValidLink(false);
        toast({
          title: "Invalid or expired link",
          description: error.message || "Please request a new password reset link",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkPasswordRecoverySession();
  }, [location.hash]);

  const handleReturnToLogin = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-4">Verifying your reset link...</p>
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
            <CardTitle className="text-2xl font-bold text-center">Invalid or Expired Link</CardTitle>
            <CardDescription className="text-center">
              The password reset link appears to be invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mb-4 text-center text-muted-foreground">
              Please request a new password reset link.
            </p>
            <Button onClick={handleReturnToLogin} className="w-full">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResetPassword;
