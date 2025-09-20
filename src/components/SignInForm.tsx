import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Eye, EyeOff, Mail, Lock, CheckCircle, Leaf } from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SignInFormProps {
  onSignInSuccess: (user: any) => void;
  onSwitchToSignUp: () => void;
}

export function SignInForm({ onSignInSuccess, onSwitchToSignUp }: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ea24b08c/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Signin error:', data);
        setErrors({ general: data.error || 'Failed to sign in' });
        return;
      }

      console.log('Signed in successfully:', data);
      onSignInSuccess(data.user);

    } catch (error) {
      console.error('Network error during signin:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-[#8b7355]/20 shadow-xl backdrop-blur-sm bg-white/95">
      <CardHeader className="space-y-1 bg-gradient-to-br from-[#f0f4e8]/95 to-[#e8f5e8]/95 rounded-t-lg">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-[#2d5016] rounded-full flex items-center justify-center">
            <Leaf className="size-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-center text-[#2d5016]">Welcome back</CardTitle>
        <CardDescription className="text-center text-[#4a5d23]">
          Sign in to your EcoRoot account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {errors.general && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#2d5016]">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#8b7355]" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 border-[#8b7355]/30 focus:border-[#2d5016] focus:ring-[#2d5016]"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#2d5016]">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#8b7355]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 border-[#8b7355]/30 focus:border-[#2d5016] focus:ring-[#2d5016]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b7355] hover:text-[#2d5016]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#2d5016] hover:bg-[#4a5d23] text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-[#8b7355]">
              Don't have an account?{" "}
              <button 
                type="button"
                className="text-[#2d5016] hover:underline font-medium"
                onClick={onSwitchToSignUp}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}