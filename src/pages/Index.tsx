
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Activity, Heart, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChildCard from '@/components/ChildCard';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchChildren = async (userId: string | undefined) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch children via React Query
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['children', user?.id],
    queryFn: () => fetchChildren(user?.id),
    enabled: !!user?.id,
  });

  // Safely map DB structure to UI, handling nulls or missing
  const children = useMemo(() => (data || []).map((child: any) => ({
    id: child.id,
    name: child.name,
    dob: child.dob,
    gender: child.gender,
    village: child.village ?? '',
    status: child.status ?? undefined,
    awcCenter: child.awc_center ?? '',
  })), [data]);

  const [selectedAwcCenter, setSelectedAwcCenter] = useState<string>('all');
  const awcCenters = useMemo(() => (
    [...new Set(children.map(child => child.awcCenter).filter(Boolean))]
  ), [children]);

  const filteredChildren = selectedAwcCenter === 'all'
    ? children
    : children.filter(child => child.awcCenter === selectedAwcCenter);

  const samCount = filteredChildren.filter((child) => child.status === 'sam').length;
  const mamCount = filteredChildren.filter((child) => child.status === 'mam').length;
  const normalCount = filteredChildren.filter((child) => child.status === 'normal').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Nutrition Monitoring Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedAwcCenter} onValueChange={setSelectedAwcCenter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by AWC Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All AWC Centers</SelectItem>
                {awcCenters.map((center) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link to="/add-child">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Child
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="SAM Cases"
          value={samCount}
          icon={AlertTriangle}
          color="text-red-500"
          description="Severe Acute Malnutrition - Requires NRC admission"
        />
        <StatsCard
          title="MAM Cases"
          value={mamCount}
          icon={Activity}
          color="text-yellow-500"
          description="Moderate Acute Malnutrition - Requires VCDC support"
        />
        <StatsCard
          title="Normal Growth"
          value={normalCount}
          icon={Heart}
          color="text-green-500"
          description="Healthy nutritional status"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Children Overview</h2>
            {selectedAwcCenter !== 'all' && (
              <p className="text-muted-foreground mt-1">Showing children from {selectedAwcCenter}</p>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-12">Loading children...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error loading children.
          </div>
        ) : filteredChildren.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChildren.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No children found</h2>
            <p className="text-muted-foreground mt-2">
              {selectedAwcCenter === 'all'
                ? 'Get started by adding your first child.'
                : 'No children found for the selected AWC Center.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
