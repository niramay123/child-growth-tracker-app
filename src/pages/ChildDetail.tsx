
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import AddGrowthRecordModal from '@/components/AddGrowthRecordModal';
import { format } from 'date-fns';

// Mock data, aligning with your backend schemas
const mockChild = { id: '1', name: 'Ravi Kumar', dob: '2023-01-15', gender: 'male', village: 'Rampur' };
const mockHistory = [
  { id: 'rec1', date: '2023-04-15', weight: 5.2, height: 58, classification: { whz: 'normal' } },
  { id: 'rec2', date: '2023-07-15', weight: 6.8, height: 65, classification: { whz: 'normal' } },
  { id: 'rec3', date: '2023-10-15', weight: 7.5, height: 70, classification: { whz: 'mam' } },
  { id: 'rec4', date: '2024-01-15', weight: 8.2, height: 74, classification: { whz: 'normal' } },
];

const getBadgeColor = (classification: string) => {
  switch (classification) {
    case 'sam': return 'bg-red-500';
    case 'mam': return 'bg-yellow-500';
    default: return 'bg-green-500';
  }
}

const ChildDetail = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // In a real app, you would fetch child data and history based on `id`
  const child = mockChild;
  const history = mockHistory;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{child.name}</CardTitle>
          <CardDescription>
            {child.gender}, born {format(new Date(child.dob), 'dd MMM yyyy')} in {child.village}.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Growth History</CardTitle>
            <CardDescription>Track the child's growth over time.</CardDescription>
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
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{record.weight}</TableCell>
                  <TableCell>{record.height}</TableCell>
                  <TableCell>
                    <Badge className={`${getBadgeColor(record.classification.whz)} text-white`}>
                      {record.classification.whz.toUpperCase()}
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
