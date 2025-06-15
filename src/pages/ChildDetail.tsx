
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import AddGrowthRecordModal from '@/components/AddGrowthRecordModal';
import { format, differenceInMonths } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateZScore, getClassificationLabel, getAlertMessage } from '@/utils/zScoreCalculator';

// Mock data with updated calculations
const mockChild = { 
  id: '1', 
  name: 'Ravi Kumar', 
  dob: '2023-01-15', 
  gender: 'male' as const, 
  village: 'Rampur',
  awcCenter: 'AWC Center 1 - Rampur'
};

const mockHistory = [
  { id: 'rec1', date: '2023-04-15', weight: 5.2, height: 58 },
  { id: 'rec2', date: '2023-07-15', weight: 6.8, height: 65 },
  { id: 'rec3', date: '2023-10-15', weight: 7.5, height: 70 },
  { id: 'rec4', date: '2024-01-15', weight: 7.2, height: 74 },
];

const getBadgeColor = (classification: string) => {
  switch (classification) {
    case 'sam': return 'bg-red-500 hover:bg-red-600 text-white';
    case 'mam': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    case 'normal': return 'bg-green-500 hover:bg-green-600 text-white';
    default: return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
}

const ChildDetail = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const child = mockChild;
  const history = mockHistory;

  // Calculate Z-scores and classifications for all records
  const processedHistory = history.map(record => {
    const recordDate = new Date(record.date);
    const ageInMonths = differenceInMonths(recordDate, new Date(child.dob));
    const zScoreResult = calculateZScore(record.weight, record.height, ageInMonths, child.gender);
    
    return {
      ...record,
      ageInMonths,
      zScore: zScoreResult.whz,
      classification: zScoreResult.classification,
      alert: zScoreResult.alert
    };
  });

  const sortedHistory = [...processedHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestRecord = sortedHistory.length > 0 ? sortedHistory[0] : null;
  const currentStatus = latestRecord?.classification;

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

  const childAge = differenceInMonths(new Date(), new Date(child.dob));
  const ageYears = Math.floor(childAge / 12);
  const ageMonths = childAge % 12;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            {child.name}
            {latestRecord && (
              <Badge className={getBadgeColor(latestRecord.classification)}>
                {getClassificationLabel(latestRecord.classification)}
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
              {child.awcCenter}
            </div>
            <p className="text-sm">Born: {format(new Date(child.dob), 'dd MMM yyyy')}</p>
          </CardDescription>
        </CardHeader>
      </Card>

      {getAlert()}

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Growth History & Z-Score Analysis</CardTitle>
            <CardDescription>Track the child's growth and nutritional status over time with WHO Z-score classifications.</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
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
              {sortedHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{record.ageInMonths}m</TableCell>
                  <TableCell>{record.weight}</TableCell>
                  <TableCell>{record.height}</TableCell>
                  <TableCell className="font-mono">
                    {record.zScore.toFixed(2)} SD
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(record.classification)}>
                      {getClassificationLabel(record.classification)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AddGrowthRecordModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} childId={child.id} />
    </div>
  );
};

export default ChildDetail;
