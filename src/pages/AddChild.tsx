
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

const awcCenters = [
  'AWC Center 1 - Rampur',
  'AWC Center 2 - Sitapur', 
  'AWC Center 3 - Gopalganj',
  'AWC Center 4 - Rampur East',
  'AWC Center 5 - Sitapur North'
];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleGenderChange = (value: string) => {
    setFormData({ ...formData, gender: value });
  }

  const handleAwcCenterChange = (value: string) => {
    setFormData({ ...formData, awcCenter: value });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // API call to `createChild` controller would go here
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Child Added", description: `${formData.name} has been added successfully to ${formData.awcCenter}.` });
      navigate('/');
    }, 1000);
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Child's full name" required onChange={handleChange} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
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
                <Label htmlFor="village">Village</Label>
                <Input id="village" placeholder="Child's village" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awcCenter">AWC Center</Label>
                <Select onValueChange={handleAwcCenterChange} required>
                  <SelectTrigger><SelectValue placeholder="Select AWC Center" /></SelectTrigger>
                  <SelectContent>
                    {awcCenters.map((center) => (
                      <SelectItem key={center} value={center}>{center}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
