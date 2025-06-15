import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Activity, Heart, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChildCard from '@/components/ChildCard';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculateZScore } from '@/utils/zScoreCalculator';

// Extend the child type for clarity
type Child = {
  id: string;
  name: string;
  dob: string;
  gender: 'male' | 'female';
  village: string;
  status?: string | undefined;
  awcCenter: string;
};

const fetchChildren = async (userId: string | undefined): Promise<Child[]> => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (
    (data || []).map((child: any) => ({
      id: child.id,
      name: child.name,
      dob: child.dob,
      gender: child.gender,
      village: child.village ?? '',
      status: child.status ?? undefined,
      awcCenter: child.awc_center ?? '',
    }))
  );
};

// Fetch all latest growth records by child id (for visible children)
const fetchLatestGrowthRecords = async (childIds: string[]) => {
  if (childIds.length === 0) return {};

  // Supabase does not have "select distinct on" so fetch all and post-process
  const { data, error } = await supabase
    .from('growth_records')
    .select('*')
    .in('child_id', childIds)
    .order('date', { ascending: false });
  if (error) throw error;
  // Post-process: get latest growth record for each child_id
  const latestByChild: Record<string, any> = {};
  for (const rec of data || []) {
    if (!latestByChild[rec.child_id]) {
      latestByChild[rec.child_id] = rec;
    }
  }
  return latestByChild;
};

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch children via React Query
  const { data: childData = [], isLoading, error } = useQuery({
    queryKey: ['children', user?.id],
    queryFn: () => fetchChildren(user?.id),
    enabled: !!user?.id,
  });

  const children: Child[] = useMemo(() => childData, [childData]);

  const [selectedAwcCenter, setSelectedAwcCenter] = useState<string>('all');
  const awcCenters = useMemo(() => (
    [...new Set(children.map(child => child.awcCenter).filter(Boolean))]
  ), [children]);
  const filteredChildren = useMemo(
    () =>
      selectedAwcCenter === 'all'
        ? children
        : children.filter(child => child.awcCenter === selectedAwcCenter),
    [children, selectedAwcCenter]
  );

  // State to store true current status per child after zscore calculation
  const [statusCounts, setStatusCounts] = useState<{ sam: number; mam: number; normal: number }>({
    sam: 0,
    mam: 0,
    normal: 0,
  });
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  useEffect(() => {
    // Recalculate counts whenever visible children change
    const updateStatusCounts = async () => {
      setLoadingStatus(true);
      const _children = filteredChildren;
      if (_children.length === 0) {
        setStatusCounts({ sam: 0, mam: 0, normal: 0 });
        setLoadingStatus(false);
        return;
      }
      // Fetch latest growth records ONLY for filtered children
      const latestRecords = await fetchLatestGrowthRecords(_children.map(c => c.id));

      let sam = 0,
        mam = 0,
        normal = 0;

      for (const child of _children) {
        const rec = latestRecords[child.id];
        let latestStatus: 'sam' | 'mam' | 'normal' | null = null;

        if (rec) {
          // Calculate age at measurement in months
          const ageInMonths = Math.floor(
            (new Date(rec.date).getTime() - new Date(child.dob).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
          );
          const gender = (child.gender === 'male' || child.gender === 'female')
            ? child.gender
            : 'male'; // fallback (shouldn't occur)
          const zScoreRes = calculateZScore(
            Number(rec.weight),
            Number(rec.height),
            ageInMonths,
            gender,
            Boolean(rec.has_edema)
          );
          latestStatus =
            typeof zScoreRes === 'object' && zScoreRes?.classification
              ? zScoreRes.classification
              : (child.status === 'sam' || child.status === 'mam' || child.status === 'normal'
                  ? child.status
                  : 'normal');
        } else {
          // Fallback to last known status from child record
          if (child.status === 'sam' || child.status === 'mam' || child.status === 'normal') {
            latestStatus = child.status;
          } else {
            latestStatus = 'normal';
          }
        }

        if (latestStatus === 'sam') sam++;
        else if (latestStatus === 'mam') mam++;
        else normal++;
      }
      setStatusCounts({ sam, mam, normal });
      setLoadingStatus(false);
    };

    updateStatusCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredChildren]);

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
          value={loadingStatus ? '...' : statusCounts.sam}
          icon={AlertTriangle}
          color="text-red-500"
          description="Severe Acute Malnutrition - Requires NRC admission"
        />
        <StatsCard
          title="MAM Cases"
          value={loadingStatus ? '...' : statusCounts.mam}
          icon={Activity}
          color="text-yellow-500"
          description="Moderate Acute Malnutrition - Requires VCDC support"
        />
        <StatsCard
          title="Normal Growth"
          value={loadingStatus ? '...' : statusCounts.normal}
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
