
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  childId: string;
}

const AddGrowthRecordModal = ({ isOpen, onOpenChange, childId }: Props) => {
  const [formData, setFormData] = useState({ date: '', weight: '', height: '', hasEdema: false });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // API call to `addGrowthRecord` controller
    console.log({ childId, ...formData });
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast({ title: "Record Added", description: "The new growth record has been saved." });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Growth Record</DialogTitle>
          <DialogDescription>
            Enter the latest measurements for the child.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="growth-form" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date of Measurement</Label>
            <Input id="date" type="date" required onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" step="0.1" placeholder="e.g. 5.4" required onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" step="0.1" placeholder="e.g. 60.2" required onChange={handleChange} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="hasEdema" onCheckedChange={(checked) => setFormData(prev => ({...prev, hasEdema: !!checked}))} />
            <Label htmlFor="hasEdema">Edema present</Label>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="growth-form" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Record'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGrowthRecordModal;
