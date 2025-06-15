
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import AddGrowthRecordModal from '@/components/AddGrowthRecordModal';
import { format, differenceInMonths } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateZScore, getClassificationLabel, getAlertMessage } from '@/utils/zScoreCalculator';
import NutritionRecommendations from '@/components/NutritionRecommendations';
import { supabase } from '@/integrations/supabase/client';

const getBadgeColor = (classification: string) => {
  switch (classification) {
    case 'sam': return 'bg-red-500 hover:bg-red-600 text-white';
    case 'mam': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    case 'normal': return 'bg-green-500 hover:bg-green-600 text-white';
    default: return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

const fetchChildById = async (id: string | undefined) => {
  if (!id) return null;
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

// Fetch all growth records for a specific child, order by date descending
const fetchGrowthRecords = async (childId: string) => {
  const { data, error } = await supabase
    .from('growth_records')
    .select('*')
    .eq('child_id', childId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
};

const ChildDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [showAddRecord, setShowAddRecord] = useState(false);

  const { data: child, isLoading, error } = useQuery({
    queryKey: ['child', id],
    queryFn: () => fetchChildById(id),
    enabled: !!id,
  });

  // Fetch growth records for this child
  const { data: growthRecords = [], isLoading: loadingGrowth } = useQuery({
    queryKey: ['growth_records', id],
    queryFn: () => fetchGrowthRecords(id!),
    enabled: !!id,
  });

  // After adding a record, refresh the list
  const handleAddRecordModalChange = (isOpen: boolean) => {
    setShowAddRecord(isOpen);
    if (!isOpen) {
      queryClient.invalidateQueries({ queryKey: ['growth_records', id] });
      queryClient.invalidateQueries({ queryKey: ['child', id] }); // In case status is updated elsewhere
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading child data...</div>;
  }
  if (error || !child) {
    return (
      <div className="text-center py-12 text-red-500">
        {error ? 'Error loading child data.' : 'Child not found.'}
      </div>
    );
  }

  const childAge = differenceInMonths(new Date(), new Date(child.dob));
  const ageYears = Math.floor(childAge / 12);
  const ageMonths = childAge % 12;

  // Use latest record if exists, else fallback to child.status
  const latestRecord = growthRecords.length > 0 ? growthRecords[0] : null;
  const currentStatus = latestRecord?.classification || child.status || null;

  const getAlert = () => {
    if (!currentStatus || currentStatus === 'normal') {
      return null;
    }
    const alertConfig = getAlertMessage(currentStatus);
    const isSam = currentStatus === 'sam';
    return (
      <Alert variant={isSam ? 'destructive' : 'default'} className={isSam ? '' : 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="font-semibold">{alertConfig.title}</AlertTitle>
        <AlertDescription className="mt-2">{alertConfig.description}</AlertDescription>
      </Alert>
    );
  };

  // For each record, calculate relevant values
  const rows = growthRecords.map((rec: any) => {
    // Calculate age in months at the record date
    const monthsAtMeasurement = differenceInMonths(new Date(rec.date), new Date(child.dob));
    // Calculate Z-Score, classification based on rec.weight, rec.height, rec.date, child.gender, etc
    let zScore = null;
    let classification = null;
    try {
      zScore = calculateZScore({
        gender: child.gender,
        dob: child.dob,
        date: rec.date,
        weight: rec.weight,
        height: rec.height,
        edema: rec.has_edema,
      });
      classification = getClassificationLabel(
        calculateZScore({
          gender: child.gender,
          dob: child.dob,
          date: rec.date,
          weight: rec.weight,
          height: rec.height,
          edema: rec.has_edema,
        })?.classification || (child.status ?? 'normal')
      );
    } catch (e) {
      // fallback
      zScore = null;
      classification = getClassificationLabel(child.status ?? 'normal');
    }

    return {
      ...rec,
      monthsAtMeasurement,
      formattedDate: format(new Date(rec.date), 'dd MMM yyyy'),
      zScore: typeof zScore === 'object' ? zScore?.whz ?? null : zScore,
      classification: typeof zScore === 'object' ? getClassificationLabel(zScore?.classification) : classification,
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            {child.name}
            {currentStatus && (
              <Badge className={getBadgeColor(currentStatus)}>
                {getClassificationLabel(currentStatus)}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {ageYears > 0 ? `${ageYears}y ` : ''}{ageMonths}m old {child.gender}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {child.village}
              </span>
            </div>
            <div className="text-xs bg-muted/50 px-2 py-1 rounded w-fit">
              {child.awc_center}
            </div>
            <p className="text-sm">Born: {format(new Date(child.dob), 'dd MMM yyyy')}</p>
          </CardDescription>
        </CardHeader>
      </Card>

      {getAlert()}

      {currentStatus && (currentStatus === 'sam' || currentStatus === 'mam') && (
        <NutritionRecommendations status={currentStatus} childName={child.name} />
      )}

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Growth History & Z-Score Analysis</CardTitle>
            <CardDescription>
              {growthRecords.length === 0 ? (
                <span>No growth records have been added yet. Add the first record below.</span>
              ) : (
                "Track the child's growth and nutritional status over time with WHO Z-score classifications."
              )}
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddRecord(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Age (months)</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Z-Score (WHZ)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No growth records available for this child yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.formattedDate}</TableCell>
                    <TableCell>{rec.monthsAtMeasurement}</TableCell>
                    <TableCell>{rec.weight}</TableCell>
                    <TableCell>{rec.height}</TableCell>
                    <TableCell>
                      {rec.zScore !== null
                        ? typeof rec.zScore === 'number'
                          ? rec.zScore.toFixed(2)
                          : rec.zScore
                        : '--'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(rec.classification)}>{rec.classification}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AddGrowthRecordModal
        isOpen={showAddRecord}
        onOpenChange={handleAddRecordModalChange}
        childId={id!}
      />
    </div>
  );
};

export default ChildDetail;
