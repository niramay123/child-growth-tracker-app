
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ChildCard from '@/components/ChildCard';

// Mock data based on your `getChildrens` controller
const mockChildren = [
  { id: '1', name: 'Ravi Kumar', dob: '2023-01-15', gender: 'male', village: 'Rampur' },
  { id: '2', name: 'Sunita Devi', dob: '2022-11-20', gender: 'female', village: 'Sitapur' },
  { id: '3', name: 'Amit Singh', dob: '2024-03-10', gender: 'male', village: 'Gopalganj' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Children</h1>
        <Button asChild>
          <Link to="/add-child">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Child
          </Link>
        </Button>
      </div>
      
      {mockChildren.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockChildren.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No children found</h2>
          <p className="text-muted-foreground mt-2">Get started by adding your first child.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
