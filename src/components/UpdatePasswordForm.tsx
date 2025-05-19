
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const passwordSchema = z.object({
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const UpdatePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();

  console.log("Current user in UpdatePasswordForm:", user?.email);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleUpdatePassword = async (data: PasswordFormValues) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Attempting to update password");
      
      await updatePassword(data.password);
      
      console.log("Password updated successfully");
      setSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      // Navigate to main page after successful password update with delay
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      console.error('Password update error:', error);
      setError(error.message || "An error occurred while updating your password");
      toast({
        title: "Error updating password",
        description: error.message || "An error occurred while updating your password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Update Password</CardTitle>
        <CardDescription className="text-center">
          Create a new password for your account
          {user?.email && <span className="block mt-1 font-medium">{user.email}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="mb-2 text-green-600 dark:text-green-400 font-medium">Password updated successfully!</p>
            <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
            <Loader2 className="w-6 h-6 mx-auto mt-4 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your new password" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your new password" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <div className="flex items-center gap-2 p-3 mt-2 text-sm text-destructive bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  <p>{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : "Update Password"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordForm;
