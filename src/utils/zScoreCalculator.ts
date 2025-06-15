
// WHO Growth Standards Z-score calculation
// This is a simplified version - in production, you'd use WHO reference tables

interface ZScoreResult {
  whz: number; // Weight-for-height Z-score
  classification: 'normal' | 'mam' | 'sam';
  alert: 'none' | 'yellow' | 'red';
}

export const calculateZScore = (weight: number, height: number, ageInMonths: number, gender: 'male' | 'female'): ZScoreResult => {
  // Simplified calculation - in reality, you'd use WHO reference tables
  // This is a mock calculation for demonstration
  
  // Expected weight for height based on simplified formula
  const expectedWeight = gender === 'male' 
    ? (height - 100) * 0.9 + (ageInMonths * 0.1)
    : (height - 105) * 0.85 + (ageInMonths * 0.1);
  
  // Standard deviation (simplified)
  const sd = expectedWeight * 0.15;
  
  // Calculate Z-score
  const whz = (weight - expectedWeight) / sd;
  
  // Classification based on WHO standards
  let classification: 'normal' | 'mam' | 'sam';
  let alert: 'none' | 'yellow' | 'red';
  
  if (whz >= -2) {
    classification = 'normal';
    alert = 'none';
  } else if (whz >= -3 && whz < -2) {
    classification = 'mam';
    alert = 'yellow';
  } else {
    classification = 'sam';
    alert = 'red';
  }
  
  return { whz, classification, alert };
};

export const getClassificationLabel = (classification: string): string => {
  switch (classification) {
    case 'sam': return 'SAM';
    case 'mam': return 'MAM';
    case 'normal': return 'Normal';
    default: return 'Unknown';
  }
};

export const getAlertMessage = (classification: string): { title: string; description: string } => {
  switch (classification) {
    case 'sam':
      return {
        title: 'URGENT: Severe Acute Malnutrition (SAM)',
        description: 'This child requires immediate referral to a Nutrition Rehabilitation Centre (NRC) at the Taluka level for admission and treatment.'
      };
    case 'mam':
      return {
        title: 'Warning: Moderate Acute Malnutrition (MAM)',
        description: 'This child should be admitted to the Village Child Development Centre (VCDC) at the Anganwadi level for supplementary nutrition support.'
      };
    default:
      return { title: '', description: '' };
  }
};
