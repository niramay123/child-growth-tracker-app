
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Building } from 'lucide-react';
import { differenceInMonths, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Child {
  id: string;
  name: string;
  dob: string;
  gender: string;
  village: string;
  awcCenter?: string;
  status?: string;
}

const getBadgeColor = (status?: string) => {
  switch (status) {
    case 'sam': return 'bg-red-500 hover:bg-red-600 text-white';
    case 'mam': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    case 'normal': return 'bg-green-500 hover:bg-green-600 text-white';
    default: return 'hidden';
  }
}

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'sam': return 'SAM';
    case 'mam': return 'MAM';
    case 'normal': return 'Normal';
    default: return '';
  }
}

const ChildCard = ({ child }: { child: Child }) => {
  const ageInMonths = differenceInMonths(new Date(), new Date(child.dob));
  const ageYears = Math.floor(ageInMonths / 12);
  const ageMonths = ageInMonths % 12;

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{child.name}</CardTitle>
          <Badge className={getBadgeColor(child.status)}>
            {getStatusLabel(child.status)}
          </Badge>
        </div>
        <CardDescription>
          {ageYears > 0 ? `${ageYears}y ` : ''}{ageMonths}m old {child.gender}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{child.village}</span>
        </div>
        {child.awcCenter && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building className="h-3 w-3" />
            <span>{child.awcCenter}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground">DOB: {format(new Date(child.dob), 'dd MMM yyyy')}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/child/${child.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChildCard;
