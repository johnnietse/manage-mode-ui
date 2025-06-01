
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ResetPasswordForm from './ResetPasswordForm';

export function AuthForms() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showResetForm, setShowResetForm] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const { signIn, signUp, loading } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const clearError = () => setFormError('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!loginEmail.trim() || !loginPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      await signIn(loginEmail, loginPassword);
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.message || 'Failed to sign in. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!registerEmail.trim() || !registerPassword || !fullName.trim()) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (registerPassword.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await signUp(registerEmail, registerPassword, fullName);
    } catch (error: any) {
      console.error('Registration error:', error);
      setFormError(error.message || 'Failed to create account. Please try again.');
    }
  };

  if (showResetForm) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <ResetPasswordForm onBack={() => setShowResetForm(false)} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">TaskMaster</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              clearError();
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      clearError();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="px-0 font-normal text-sm"
                      type="button"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      clearError();
                    }}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearError();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      clearError();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    placeholder="At least 6 characters"
                    required
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      clearError();
                    }}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AuthForms;
