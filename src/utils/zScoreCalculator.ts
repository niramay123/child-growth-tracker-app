import { differenceInMonths } from 'date-fns';

interface ZScoreResult {
  whz: number;
  classification: 'sam' | 'mam' | 'normal';
}

/**
 * Calculates the Weight-for-Height Z-score (WHZ) and classifies nutritional status based on WHO standards.
 *
 * @param {number} weight - Weight in kilograms.
 * @param {number} height - Height in centimeters.
 * @param {number} ageInMonths - Age in months.
 * @param {string} gender - Gender ('male' or 'female').
 * @param {boolean} hasEdema - Presence of edema.
 * @returns {ZScoreResult | string} - An object containing the WHZ score and classification, or an error message.
 */
const calculateZScore = (
  weight: number,
  height: number,
  ageInMonths: number,
  gender: string,
  hasEdema: boolean
): ZScoreResult | string => {
  if (typeof weight !== 'number' || typeof height !== 'number' || typeof ageInMonths !== 'number') {
    return "Weight, height, and age must be numbers.";
  }

  if (isNaN(weight) || isNaN(height) || isNaN(ageInMonths)) {
    return "Weight, height, and age must not be NaN.";
  }

  if (weight <= 0 || height <= 0) {
    return "Weight and height must be greater than zero.";
  }

  if (gender !== 'male' && gender !== 'female') {
    return "Gender must be 'male' or 'female'.";
  }

  // Reference data (median weight and standard deviation) - Example data
  const referenceData = {
    male: {
      0: { median: 4.2, sd: 0.6 },
      6: { median: 7.8, sd: 0.8 },
      12: { median: 10.2, sd: 1.0 },
      18: { median: 11.8, sd: 1.1 },
      24: { median: 13.2, sd: 1.2 },
      30: { median: 14.3, sd: 1.3 },
      36: { median: 15.3, sd: 1.3 },
      42: { median: 16.1, sd: 1.4 },
      48: { median: 16.8, sd: 1.4 },
      54: { median: 17.5, sd: 1.5 },
      60: { median: 18.2, sd: 1.5 },
    },
    female: {
      0: { median: 4.0, sd: 0.5 },
      6: { median: 7.3, sd: 0.7 },
      12: { median: 9.5, sd: 0.9 },
      18: { median: 11.0, sd: 1.0 },
      24: { median: 12.4, sd: 1.1 },
      30: { median: 13.5, sd: 1.2 },
      36: { median: 14.4, sd: 1.2 },
      42: { median: 15.2, sd: 1.3 },
      48: { median: 15.9, sd: 1.3 },
      54: { median: 16.6, sd: 1.4 },
      60: { median: 17.2, sd: 1.4 },
    },
  };

  // Find the closest age in the reference data
  const closestAge = Object.keys(referenceData[gender])
    .map(Number)
    .reduce((prev, curr) => (Math.abs(curr - ageInMonths) < Math.abs(prev - ageInMonths) ? curr : prev), 0);

  const medianWeight = referenceData[gender][closestAge].median;
  const sd = referenceData[gender][closestAge].sd;

  // Calculate Z-score
  let whz = (weight - medianWeight) / sd;

  // Adjust Z-score for edema
  if (hasEdema) {
    whz = Math.min(whz, -3); // Set to -3 if edema is present and Z-score is higher
  }

  // Classify nutritional status
  let classification: 'sam' | 'mam' | 'normal' = 'normal';
  if (whz < -3) {
    classification = 'sam';
  } else if (whz < -2) {
    classification = 'mam';
  }

  return { whz, classification };
};

const getClassificationLabel = (classification: string): string => {
  switch (classification) {
    case 'sam':
      return 'SAM';
    case 'mam':
      return 'MAM';
    case 'normal':
      return 'Normal';
    default:
      return 'Unknown';
  }
};

interface AlertConfig {
  title: string;
  description: string;
}

const getAlertMessage = (classification: string): AlertConfig => {
  switch (classification) {
    case 'sam':
      return {
        title: 'Severe Acute Malnutrition (SAM)',
        description:
          'The child is classified as having Severe Acute Malnutrition (SAM) and requires immediate medical attention. Please refer to the nearest Nutrition Rehabilitation Center (NRC) for specialized treatment.',
      };
    case 'mam':
      return {
        title: 'Moderate Acute Malnutrition (MAM)',
        description:
          'The child is classified as having Moderate Acute Malnutrition (MAM) and requires supplementary feeding and close monitoring. Please provide appropriate nutrition and care, and follow up regularly.',
      };
    default:
      return {
        title: 'Normal Nutritional Status',
        description: 'The child has a normal nutritional status.',
      };
  }
};

export {
  calculateZScore,
  getClassificationLabel,
  getAlertMessage,
};
