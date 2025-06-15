
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import AddGrowthRecordModal from '@/components/AddGrowthRecordModal';
import { format, differenceInMonths } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateZScore, getClassificationLabel, getAlertMessage } from '@/utils/zScoreCalculator';
import NutritionRecommendations from '@/components/NutritionRecommendations';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

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

const fetchGrowthRecords = async (childId: string) => {
  const { data, error } = await supabase
    .from('growth_records')
    .select('*')
    .eq('child_id', childId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
};

const deleteGrowthRecord = async (recordId: string) => {
  const { error } = await supabase.from('growth_records').delete().eq('id', recordId);
  if (error) throw error;
};

const deleteChild = async (childId: string) => {
  const { error } = await supabase.from('children').delete().eq('id', childId);
  if (error) throw error;
};

const ChildDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showAddRecord, setShowAddRecord] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [showDeleteChild, setShowDeleteChild] = useState(false);
  const [deletingChild, setDeletingChild] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(false);

  const { data: child, isLoading, error } = useQuery({
    queryKey: ['child', id],
    queryFn: () => fetchChildById(id),
    enabled: !!id,
  });

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
      queryClient.invalidateQueries({ queryKey: ['child', id] });
    }
  };

  const handleDeleteRecord = async () => {
    if (!deleteRecordId) return;
    setDeletingRecord(true);
    try {
      await deleteGrowthRecord(deleteRecordId);
      queryClient.invalidateQueries({ queryKey: ['growth_records', id] });
      setDeleteRecordId(null);
    } finally {
      setDeletingRecord(false);
    }
  };

  const handleDeleteChild = async () => {
    if (!id) return;
    setDeletingChild(true);
    try {
      await deleteChild(id);
      setShowDeleteChild(false);
      navigate('/');
      queryClient.invalidateQueries({ queryKey: ['children'] });
    } finally {
      setDeletingChild(false);
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
  let currentStatus: string | null = null;
  if (growthRecords.length > 0) {
    // Calculate most recent classification using actual fields (record does not have classification)
    const rec = growthRecords[0];
    const zScoreRes = calculateZScore({
      gender: child.gender,
      dob: child.dob,
      date: rec.date,
      weight: rec.weight,
      height: rec.height,
      edema: rec.has_edema,
    });
    currentStatus =
      typeof zScoreRes === 'object' && zScoreRes?.classification
        ? zScoreRes.classification
        : child.status ?? null;
  } else {
    currentStatus = child.status ?? null;
  }

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

  // For each record, calculate relevant values for display
  const rows = growthRecords.map((rec: any) => {
    const monthsAtMeasurement = differenceInMonths(new Date(rec.date), new Date(child.dob));
    let zScoreObj = null;
    let whz = null;
    let classificationLabel = null;
    try {
      zScoreObj = calculateZScore({
        gender: child.gender,
        dob: child.dob,
        date: rec.date,
        weight: rec.weight,
        height: rec.height,
        edema: rec.has_edema,
      });
      whz = typeof zScoreObj === 'object' ? zScoreObj?.whz ?? null : null;
      classificationLabel =
        typeof zScoreObj === 'object'
          ? getClassificationLabel(zScoreObj?.classification)
          : getClassificationLabel(child.status ?? 'normal');
    } catch (e) {
      whz = null;
      classificationLabel = getClassificationLabel(child.status ?? 'normal');
    }

    return {
      ...rec,
      monthsAtMeasurement,
      formattedDate: format(new Date(rec.date), 'dd MMM yyyy'),
      zScore: whz,
      classification: classificationLabel,
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
            <AlertDialog open={showDeleteChild} onOpenChange={setShowDeleteChild}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-4"
                  onClick={() => setShowDeleteChild(true)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete Child
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete child "{child.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this child and all growth records. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deletingChild}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deletingChild}
                    onClick={handleDeleteChild}
                  >
                    {deletingChild ? 'Deleting...' : 'Yes, Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
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
                      {rec.zScore !== null && rec.zScore !== undefined
                        ? typeof rec.zScore === 'number'
                          ? rec.zScore.toFixed(2)
                          : rec.zScore
                        : '--'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(rec.classification)}>{rec.classification}</Badge>
                    </TableCell>
                    <TableCell>
                      <AlertDialog open={deleteRecordId === rec.id} onOpenChange={open => setDeleteRecordId(open ? rec.id : null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50 px-2"
                            size="icon"
                            aria-label="Delete Growth Record"
                            onClick={() => setDeleteRecordId(rec.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this growth record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={deletingRecord}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deletingRecord}
                              onClick={handleDeleteRecord}
                            >
                              {deletingRecord ? 'Deleting...' : 'Yes, Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
