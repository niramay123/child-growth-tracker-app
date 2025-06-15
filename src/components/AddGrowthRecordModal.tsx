import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.date || !formData.weight || !formData.height) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Save to Supabase
    const { error } = await supabase.from('growth_records').insert([
      {
        child_id: childId,
        date: formData.date,
        weight: Number(formData.weight),
        height: Number(formData.height),
        has_edema: !!formData.hasEdema,
      }
    ]);

    setIsLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Record Added", description: "The new growth record has been saved." });
    onOpenChange(false);
    // Optionally reset form
    setFormData({ date: '', weight: '', height: '', hasEdema: false });
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
            <Input id="date" type="date" required onChange={handleChange} value={formData.date} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" step="0.1" placeholder="e.g. 5.4" required onChange={handleChange} value={formData.weight} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" step="0.1" placeholder="e.g. 60.2" required onChange={handleChange} value={formData.height} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="hasEdema" checked={formData.hasEdema} onCheckedChange={(checked) => setFormData(prev => ({...prev, hasEdema: !!checked}))} />
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
