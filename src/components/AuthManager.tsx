import { useState } from "react";
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";
import { Leaf, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import forestBackground from "figma:asset/42a17aaa9756cfa5927da1dde9bceacf5f901f32.png";

export function AuthManager() {
  const [currentView, setCurrentView] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<any>(null);

  const handleSignInSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleSignUpSuccess = () => {
    setCurrentView('signin');
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentView('signin');
  };

  if (user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url(${forestBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <Card className="w-full max-w-lg mx-auto border-[#8b7355]/20 shadow-xl backdrop-blur-sm bg-white/95 relative z-10">
          <CardHeader className="space-y-1 bg-gradient-to-br from-[#f0f4e8]/95 to-[#e8f5e8]/95 rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-[#2d5016] rounded-full flex items-center justify-center">
                <Leaf className="size-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-[#2d5016]">Welcome to EcoRoot!</CardTitle>
            <CardDescription className="text-center text-[#4a5d23]">
              You're successfully signed in as a {user.user_metadata?.userType || 'user'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-[#2d5016]">
                  <strong>Name:</strong> {user.user_metadata?.name || 'N/A'}
                </p>
                <p className="text-[#2d5016]">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-[#2d5016]">
                  <strong>Account Type:</strong> {user.user_metadata?.userType || 'N/A'}
                </p>
              </div>
              
              <div className="bg-[#e8f5e8] border border-[#228b22]/20 rounded-lg p-4">
                <p className="text-[#2d5016] text-center">
                  🌱 Ready to explore environmental education content!
                </p>
              </div>

              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="w-full border-[#8b7355] text-[#2d5016] hover:bg-[#f0f4e8]"
              >
                <LogOut className="size-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${forestBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10">
        {currentView === 'signin' ? (
          <SignInForm 
            onSignInSuccess={handleSignInSuccess}
            onSwitchToSignUp={() => setCurrentView('signup')}
          />
        ) : (
          <SignUpForm 
            onSignUpSuccess={handleSignUpSuccess}
            onSwitchToSignIn={() => setCurrentView('signin')}
          />
        )}
      </div>
    </div>
  );
}