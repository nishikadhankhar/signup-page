import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Eye, EyeOff, Mail, User, Lock, CheckCircle, Leaf, GraduationCap, Building2 } from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SignUpFormProps {
  onSignUpSuccess: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUpForm({ onSignUpSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.userType) {
      newErrors.userType = "Please select your account type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");
    setErrors({});
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ea24b08c/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          userType: formData.userType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Signup error:', data);
        setErrors({ general: data.error || 'Failed to create account' });
        return;
      }

      console.log('Account created successfully:', data);
      setSuccessMessage('Account created successfully! You can now sign in.');
      
      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: ""
      });

      // Call success callback after a short delay
      setTimeout(() => {
        onSignUpSuccess();
      }, 2000);

    } catch (error) {
      console.error('Network error during signup:', error);
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
        <CardTitle className="text-center text-[#2d5016]">Join EcoRoot</CardTitle>
        <CardDescription className="text-center text-[#4a5d23]">
          Create your account to start your environmental journey
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {successMessage && (
          <Alert className="mb-4 border-[#228b22] bg-[#e8f5e8]">
            <CheckCircle className="size-4 text-[#228b22]" />
            <AlertDescription className="text-[#2d5016]">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errors.general && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label className="text-[#2d5016]">I am a:</Label>
            <RadioGroup 
              value={formData.userType} 
              onValueChange={(value) => handleInputChange("userType", value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="student" id="student" className="border-[#8b7355] text-[#2d5016]" />
                <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer text-[#2d5016] bg-[#f0f4e8] p-3 rounded-lg flex-1 border border-[#8b7355]/20">
                  <GraduationCap className="size-4" />
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="college" id="college" className="border-[#8b7355] text-[#2d5016]" />
                <Label htmlFor="college" className="flex items-center gap-2 cursor-pointer text-[#2d5016] bg-[#f0f4e8] p-3 rounded-lg flex-1 border border-[#8b7355]/20">
                  <Building2 className="size-4" />
                  College
                </Label>
              </div>
            </RadioGroup>
            {errors.userType && (
              <p className="text-sm text-destructive">{errors.userType}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[#2d5016]">First name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#8b7355]" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="pl-10 border-[#8b7355]/30 focus:border-[#2d5016] focus:ring-[#2d5016]"
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[#2d5016]">Last name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#8b7355]" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="pl-10 border-[#8b7355]/30 focus:border-[#2d5016] focus:ring-[#2d5016]"
                />
              </div>
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#2d5016]">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#8b7355]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="pl-10 pr-10 border-[#8b7355]/30 focus:border-[#2d5016] focus:ring-[#2d5016]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b7355] hover:text-[#2d5016]"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#2d5016] hover:bg-[#4a5d23] text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-[#8b7355]">
              Already have an account?{" "}
              <button 
                type="button"
                className="text-[#2d5016] hover:underline font-medium"
                onClick={onSwitchToSignIn}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}