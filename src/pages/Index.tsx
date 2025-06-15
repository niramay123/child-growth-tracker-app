
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Activity, Heart } from 'lucide-react';
import ChildCard from '@/components/ChildCard';
import StatsCard from '@/components/StatsCard';

// Mock data now includes child status. In a real app, this would come from an API.
const mockChildren = [
  { id: '1', name: 'Ravi Kumar', dob: '2023-01-15', gender: 'male', village: 'Rampur', status: 'normal' },
  { id: '2', name: 'Sunita Devi', dob: '2022-11-20', gender: 'female', village: 'Sitapur', status: 'mam' },
  { id: '3', name: 'Amit Singh', dob: '2024-03-10', gender: 'male', village: 'Gopalganj', status: 'sam' },
  { id: '4', name: 'Priya Sharma', dob: '2023-05-22', gender: 'female', village: 'Rampur', status: 'normal' },
  { id: '5', name: 'Karan Verma', dob: '2022-08-01', gender: 'male', village: 'Sitapur', status: 'sam' },
];

const Dashboard = () => {
  const samCount = mockChildren.filter((child) => child.status === 'sam').length;
  const mamCount = mockChildren.filter((child) => child.status === 'mam').length;
  const normalCount = mockChildren.filter((child) => child.status === 'normal').length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="SAM"
          value={samCount}
          icon={AlertTriangle}
          color="text-red-500"
          description="Severe Acute Malnutrition"
        />
        <StatsCard
          title="MAM"
          value={mamCount}
          icon={Activity}
          color="text-yellow-500"
          description="Moderate Acute Malnutrition"
        />
        <StatsCard
          title="Normal"
          value={normalCount}
          icon={Heart}
          color="text-green-500"
          description="Healthy growth status"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Children Overview</h2>
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
    </div>
  );
};

export default Dashboard;
