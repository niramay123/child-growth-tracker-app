
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";

const AddChild = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    village: '',
    awcCenter: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  // Get logged-in user id from Supabase
  // We'll fetch it from the supabase.auth.getUser() method.
  // (We use a local function to get the UUID from Supabase)
  // This version uses the actual https://supabase.com/docs/reference/javascript/auth-getuser
  const getSupabaseUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user?.id) {
      return null;
    }
    return data.user.id;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleGenderChange = (value: string) => {
    setFormData({ ...formData, gender: value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.dob || !formData.gender || !formData.village || !formData.awcCenter) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Get the user's id for the user_id field
    const user_id = await getSupabaseUserId();

    if (!user_id) {
      toast({
        title: "Authentication Error",
        description: "Could not find your user ID. Please log in again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Insert into Supabase
    const { error } = await supabase.from('children').insert([
      {
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        village: formData.village,
        awc_center: formData.awcCenter,
        user_id: user_id,
        status: null,
      }
    ]);

    setIsLoading(false);
    if (error) {
      toast({
        title: "Error Adding Child",
        description: error.message ?? "There was a problem saving this record.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Child Added",
      description: `${formData.name} has been added successfully to ${formData.awcCenter}.` 
    });
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add a New Child</CardTitle>
          <CardDescription>Enter the details of the new child for nutrition monitoring.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Child's full name" required onChange={handleChange} value={formData.name} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input id="dob" type="date" required onChange={handleChange} value={formData.dob} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={handleGenderChange} required>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="village">Village *</Label>
                <Input id="village" placeholder="Child's village" required onChange={handleChange} value={formData.village} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awcCenter">AWC Center *</Label>
                <Input
                  id="awcCenter"
                  placeholder="Enter AWC Center name"
                  required
                  onChange={handleChange}
                  value={formData.awcCenter}
                />
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Child'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddChild;
