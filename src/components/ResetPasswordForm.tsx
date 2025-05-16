
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type ResetPasswordFormProps = {
  onBack: () => void;
};

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const ResetPasswordForm = ({ onBack }: ResetPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleResetPassword = async (data: EmailFormValues) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const { success, error } = await resetPassword(data.email);
      
      if (!success) {
        throw new Error(error);
      }
      
      setSubmitted(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      });
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred while sending the reset link");
      toast({
        title: "Error",
        description: error.message || "An error occurred while sending the reset link",
        variant: "destructive",
      });
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          {submitted 
            ? "Password reset link sent! Check your email" 
            : "Enter your email to receive a password reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {errorMsg && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="mb-4">A password reset link has been sent to your email address.</p>
            <p className="text-sm text-muted-foreground">
              If you don't see it, check your spam folder or try again.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
