
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Baby } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // This is where you would call your backend API
    // For demonstration, we'll simulate a successful login.
    setTimeout(() => {
      // Mock response from your API: loginUser controller
      const mockToken = 'fake-jwt-token';
      const mockRole = 'parent';
      const mockParentId = 'mock-parent-id';
      login(mockToken, mockRole, mockParentId);
      setIsLoading(false);
      toast({ title: "Login Successful", description: "Welcome back!" });
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Baby className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-bold mt-4">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Your phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
