
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { differenceInMonths, format } from 'date-fns';

interface Child {
  id: string;
  name: string;
  dob: string;
  gender: string;
  village: string;
}

const ChildCard = ({ child }: { child: Child }) => {
  const ageInMonths = differenceInMonths(new Date(), new Date(child.dob));
  const ageYears = Math.floor(ageInMonths / 12);
  const ageMonths = ageInMonths % 12;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{child.name}</CardTitle>
        <CardDescription>
          {ageYears > 0 ? `${ageYears}y ` : ''}{ageMonths}m old {child.gender} from {child.village}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">Date of Birth: {format(new Date(child.dob), 'dd MMM yyyy')}</p>
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
