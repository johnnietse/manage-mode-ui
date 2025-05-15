
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Provider } from '@supabase/supabase-js';

export function AuthForms() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { signIn, signUp, signInWithProvider, loading } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(loginEmail, loginPassword);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(registerEmail, registerPassword, fullName);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleProviderSignIn = (provider: Provider) => {
    signInWithProvider(provider);
  };

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
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
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
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleProviderSignIn('google')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1">
                      <g clipPath="url(#clip0_1156_8)">
                        <path d="M15.6301 6.16009H8.00006V9.33342H12.3767C12.0301 11.3334 10.3034 12.6667 8.00006 12.6667C5.24006 12.6667 3.00006 10.4267 3.00006 7.66675C3.00006 4.90675 5.24006 2.66675 8.00006 2.66675C9.26673 2.66675 10.4167 3.14008 11.2967 3.92675L13.7301 1.49342C12.1967 0.06009 10.2034 -0.666748 8.00006 -0.666748C3.58673 -0.666748 0.000061 2.92008 0.000061 7.33342C0.000061 11.7467 3.58673 15.3334 8.00006 15.3334C11.9767 15.3334 15.3334 12.4001 15.3334 7.33342C15.3334 6.95342 15.3034 6.56008 15.2434 6.18008L15.6301 6.16009Z" fill="#FFC107"/>
                        <path d="M15.6301 6.16009H8.00006V9.33342H12.3767C11.6834 11.8001 9.50006 13.2001 7.00006 12.7001L7.01673 12.7167C4.87673 12.2634 3.21673 10.6034 2.76339 8.46342C2.69673 8.12008 2.66339 7.77675 2.66673 7.43342V7.43075C2.71006 5.05075 4.32673 3.02675 6.60006 2.50675C7.08006 2.39342 7.55339 2.34675 8.03339 2.36342C9.30006 2.36342 10.4501 2.83342 11.3301 3.62008L13.7634 1.18675C12.23 -0.21325 10.18 -0.86325 8.00673 -0.733249C3.59339 -0.466583 0.13339 3.06675 0.00672958 7.46675C-0.0599371 9.51342 0.673729 11.4634 2.00006 13.0001C3.82006 15.0567 6.61339 16.0834 9.38006 15.6934C12.0367 15.3234 14.2901 13.6234 15.3234 11.1234C15.8701 9.96008 16.0501 8.64675 15.8034 7.34675C15.76 6.98675 15.7167 6.62675 15.6301 6.27342V6.16009Z" fill="#FF3D00"/>
                        <path d="M2.00006 13.0001C3.74673 14.9901 6.33339 16.0001 9.00006 15.6668C11.6667 15.3334 13.9201 13.6334 14.9534 11.1334C15.5001 9.97008 15.6801 8.65674 15.4334 7.35674L15.6301 6.15674H8.00006V9.33007H12.3767C11.6834 11.7967 9.50006 13.1967 7.00006 12.6967L7.01673 12.7134C4.87673 12.2601 3.21673 10.6001 2.76339 8.46008C2.36673 6.79341 2.90006 5.16008 3.96673 3.94675L2.00006 2.00008C0.666729 3.60008 -0.0599371 5.66674 0.00672958 7.83341C0.00672958 9.60008 0.733396 11.3334 2.00006 13.0001Z" fill="#4CAF50"/>
                        <path d="M8.00006 -0.666748C10.2001 -0.666748 12.1867 0.0732522 13.7201 1.49992L11.2867 3.93325C10.4067 3.14659 9.26673 2.67325 8.00006 2.67325C5.81339 2.67325 3.92673 4.16659 3.32006 6.20659L1.33339 4.33325C2.56673 1.33325 5.11673 -0.666748 8.00006 -0.666748Z" fill="#1976D2"/>
                      </g>
                    </svg>
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleProviderSignIn('facebook')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1">
                      <g clipPath="url(#clip0_1156_19)">
                        <path d="M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 11.993 2.92547 15.3027 6.75 15.9028V10.3125H4.71875V8H6.75V6.2375C6.75 4.2325 7.94438 3.125 9.77172 3.125C10.6467 3.125 11.5625 3.28125 11.5625 3.28125V5.25H10.5538C9.56 5.25 9.25 5.86672 9.25 6.5V8H11.4688L11.1141 10.3125H9.25V15.9028C13.0745 15.3027 16 11.993 16 8Z" fill="#1877F2"/>
                        <path d="M11.1141 10.3125L11.4688 8H9.25V6.5C9.25 5.86733 9.56 5.25 10.5538 5.25H11.5625V3.28125C11.5625 3.28125 10.6467 3.125 9.77172 3.125C7.94438 3.125 6.75 4.2325 6.75 6.2375V8H4.71875V10.3125H6.75V15.9028C7.57744 16.0325 8.42256 16.0325 9.25 15.9028V10.3125H11.1141Z" fill="white"/>
                      </g>
                    </svg>
                    Facebook
                  </Button>
                </div>
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
                    onChange={(e) => setFullName(e.target.value)}
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
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleProviderSignIn('google')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1">
                      <g clipPath="url(#clip0_1156_8)">
                        <path d="M15.6301 6.16009H8.00006V9.33342H12.3767C12.0301 11.3334 10.3034 12.6667 8.00006 12.6667C5.24006 12.6667 3.00006 10.4267 3.00006 7.66675C3.00006 4.90675 5.24006 2.66675 8.00006 2.66675C9.26673 2.66675 10.4167 3.14008 11.2967 3.92675L13.7301 1.49342C12.1967 0.06009 10.2034 -0.666748 8.00006 -0.666748C3.58673 -0.666748 0.000061 2.92008 0.000061 7.33342C0.000061 11.7467 3.58673 15.3334 8.00006 15.3334C11.9767 15.3334 15.3334 12.4001 15.3334 7.33342C15.3334 6.95342 15.3034 6.56008 15.2434 6.18008L15.6301 6.16009Z" fill="#FFC107"/>
                        <path d="M15.6301 6.16009H8.00006V9.33342H12.3767C11.6834 11.8001 9.50006 13.2001 7.00006 12.7001L7.01673 12.7167C4.87673 12.2634 3.21673 10.6034 2.76339 8.46342C2.69673 8.12008 2.66339 7.77675 2.66673 7.43342V7.43075C2.71006 5.05075 4.32673 3.02675 6.60006 2.50675C7.08006 2.39342 7.55339 2.34675 8.03339 2.36342C9.30006 2.36342 10.4501 2.83342 11.3301 3.62008L13.7634 1.18675C12.23 -0.21325 10.18 -0.86325 8.00673 -0.733249C3.59339 -0.466583 0.13339 3.06675 0.00672958 7.46675C-0.0599371 9.51342 0.673729 11.4634 2.00006 13.0001C3.82006 15.0567 6.61339 16.0834 9.38006 15.6934C12.0367 15.3234 14.2901 13.6234 15.3234 11.1234C15.8701 9.96008 16.0501 8.64675 15.8034 7.34675C15.76 6.98675 15.7167 6.62675 15.6301 6.27342V6.16009Z" fill="#FF3D00"/>
                        <path d="M2.00006 13.0001C3.74673 14.9901 6.33339 16.0001 9.00006 15.6668C11.6667 15.3334 13.9201 13.6334 14.9534 11.1334C15.5001 9.97008 15.6801 8.65674 15.4334 7.35674L15.6301 6.15674H8.00006V9.33007H12.3767C11.6834 11.7967 9.50006 13.1967 7.00006 12.6967L7.01673 12.7134C4.87673 12.2601 3.21673 10.6001 2.76339 8.46008C2.36673 6.79341 2.90006 5.16008 3.96673 3.94675L2.00006 2.00008C0.666729 3.60008 -0.0599371 5.66674 0.00672958 7.83341C0.00672958 9.60008 0.733396 11.3334 2.00006 13.0001Z" fill="#4CAF50"/>
                        <path d="M8.00006 -0.666748C10.2001 -0.666748 12.1867 0.0732522 13.7201 1.49992L11.2867 3.93325C10.4067 3.14659 9.26673 2.67325 8.00006 2.67325C5.81339 2.67325 3.92673 4.16659 3.32006 6.20659L1.33339 4.33325C2.56673 1.33325 5.11673 -0.666748 8.00006 -0.666748Z" fill="#1976D2"/>
                      </g>
                    </svg>
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleProviderSignIn('facebook')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1">
                      <g clipPath="url(#clip0_1156_19)">
                        <path d="M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 11.993 2.92547 15.3027 6.75 15.9028V10.3125H4.71875V8H6.75V6.2375C6.75 4.2325 7.94438 3.125 9.77172 3.125C10.6467 3.125 11.5625 3.28125 11.5625 3.28125V5.25H10.5538C9.56 5.25 9.25 5.86672 9.25 6.5V8H11.4688L11.1141 10.3125H9.25V15.9028C13.0745 15.3027 16 11.993 16 8Z" fill="#1877F2"/>
                        <path d="M11.1141 10.3125L11.4688 8H9.25V6.5C9.25 5.86733 9.56 5.25 10.5538 5.25H11.5625V3.28125C11.5625 3.28125 10.6467 3.125 9.77172 3.125C7.94438 3.125 6.75 4.2325 6.75 6.2375V8H4.71875V10.3125H6.75V15.9028C7.57744 16.0325 8.42256 16.0325 9.25 15.9028V10.3125H11.1141Z" fill="white"/>
                      </g>
                    </svg>
                    Facebook
                  </Button>
                </div>
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
