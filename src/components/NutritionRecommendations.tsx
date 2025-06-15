
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NutritionRecommendationsProps {
  status: 'sam' | 'mam';
  childName: string;
}

const samRecommendations = [
  "Immediate referral to Nutritional Rehabilitation Centre (NRC)",
  "Ready-to-Use Therapeutic Food (RUTF) - 175 kcal/kg/day",
  "Amoxicillin antibiotic treatment for 7 days",
  "Vitamin A supplementation every 6 months",
  "Iron and folic acid supplements",
  "Monitor weight gain weekly (target: 8g/kg/day)",
  "Ensure exclusive breastfeeding if under 6 months",
  "Introduce energy-dense complementary foods after 6 months"
];

const mamRecommendations = [
  "Village Child Development Centre (VCDC) support",
  "Supplementary nutrition program enrollment",
  "Ready-to-Use Supplementary Food (RUSF) - 500 kcal/day",
  "Monthly growth monitoring and counseling",
  "Vitamin and mineral supplementation",
  "Nutritional counseling for caregivers",
  "Promote continued breastfeeding",
  "Energy-dense local food preparation training"
];

const NutritionRecommendations = ({ status, childName }: NutritionRecommendationsProps) => {
  const { toast } = useToast();
  const recommendations = status === 'sam' ? samRecommendations : mamRecommendations;
  const title = status === 'sam' ? 'SAM Treatment Protocol' : 'MAM Management Plan';

  const downloadPDF = () => {
    // Create PDF content
    const pdfContent = `
NUTRITION RECOMMENDATIONS FOR ${childName.toUpperCase()}
Classification: ${status.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}

${title}
${'-'.repeat(50)}

${recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

FOLLOW-UP SCHEDULE:
- Weekly weight monitoring
- Monthly height/length measurement
- Regular health checkups
- Nutritional counseling sessions

This document should be shared with healthcare providers and caregivers.
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${childName}_nutrition_recommendations_${status.toUpperCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: `Nutrition recommendations for ${childName} have been downloaded.`,
    });
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-orange-500" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>Specific nutrition guidelines for {status.toUpperCase()} management</CardDescription>
          </div>
        </div>
        <Button onClick={downloadPDF} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm font-medium text-orange-800">Important:</p>
          <p className="text-sm text-orange-700 mt-1">
            These recommendations should be implemented under medical supervision. 
            Regular monitoring and follow-up visits are essential for recovery.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionRecommendations;
