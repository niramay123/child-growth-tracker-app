
// WHO Growth Standards Z-score calculation using LMS method
// Based on WHO Weight-for-Height standards

interface LMSData {
  Length: number;
  L: number;
  M: number;
  S: number;
  SD3neg: number;
  SD2neg: number;
  SD1neg: number;
  SD0: number;
  SD1: number;
  SD2: number;
  SD3: number;
}

interface ZScoreResult {
  whz: number; // Weight-for-height Z-score
  classification: 'normal' | 'mam' | 'sam';
  alert: 'none' | 'yellow' | 'red';
}

// WHO Growth Standards - Weight for Height (Length) - Girls
const GROWTH_STANDARDS_GIRLS: LMSData[] = [
  { Length: 45, L: -0.3833, M: 2.4607, S: 0.09029, SD3neg: 1.9, SD2neg: 2.1, SD1neg: 2.3, SD0: 2.5, SD1: 2.7, SD2: 3, SD3: 3.3 },
  { Length: 45.5, L: -0.3833, M: 2.5457, S: 0.09033, SD3neg: 2, SD2neg: 2.1, SD1neg: 2.3, SD0: 2.5, SD1: 2.8, SD2: 3.1, SD3: 3.4 },
  { Length: 46, L: -0.3833, M: 2.6306, S: 0.09037, SD3neg: 2, SD2neg: 2.2, SD1neg: 2.4, SD0: 2.6, SD1: 2.9, SD2: 3.2, SD3: 3.5 },
  { Length: 46.5, L: -0.3833, M: 2.7155, S: 0.0904, SD3neg: 2.1, SD2neg: 2.3, SD1neg: 2.5, SD0: 2.7, SD1: 3, SD2: 3.3, SD3: 3.6 },
  { Length: 47, L: -0.3833, M: 2.8007, S: 0.09044, SD3neg: 2.2, SD2neg: 2.4, SD1neg: 2.6, SD0: 2.8, SD1: 3.1, SD2: 3.4, SD3: 3.7 },
  { Length: 47.5, L: -0.3833, M: 2.8867, S: 0.09048, SD3neg: 2.2, SD2neg: 2.4, SD1neg: 2.6, SD0: 2.9, SD1: 3.2, SD2: 3.5, SD3: 3.8 },
  { Length: 48, L: -0.3833, M: 2.9741, S: 0.09052, SD3neg: 2.3, SD2neg: 2.5, SD1neg: 2.7, SD0: 3, SD1: 3.3, SD2: 3.6, SD3: 4 },
  { Length: 48.5, L: -0.3833, M: 3.0636, S: 0.09056, SD3neg: 2.4, SD2neg: 2.6, SD1neg: 2.8, SD0: 3.1, SD1: 3.4, SD2: 3.7, SD3: 4.1 },
  { Length: 49, L: -0.3833, M: 3.156, S: 0.0906, SD3neg: 2.4, SD2neg: 2.6, SD1neg: 2.9, SD0: 3.2, SD1: 3.5, SD2: 3.8, SD3: 4.2 },
  { Length: 49.5, L: -0.3833, M: 3.252, S: 0.09064, SD3neg: 2.5, SD2neg: 2.7, SD1neg: 3, SD0: 3.3, SD1: 3.6, SD2: 3.9, SD3: 4.3 },
  { Length: 50, L: -0.3833, M: 3.3518, S: 0.09068, SD3neg: 2.6, SD2neg: 2.8, SD1neg: 3.1, SD0: 3.4, SD1: 3.7, SD2: 4, SD3: 4.5 },
  { Length: 50.5, L: -0.3833, M: 3.4557, S: 0.09072, SD3neg: 2.7, SD2neg: 2.9, SD1neg: 3.2, SD0: 3.5, SD1: 3.8, SD2: 4.2, SD3: 4.6 },
  { Length: 51, L: -0.3833, M: 3.5636, S: 0.09076, SD3neg: 2.8, SD2neg: 3, SD1neg: 3.3, SD0: 3.6, SD1: 3.9, SD2: 4.3, SD3: 4.8 },
  { Length: 51.5, L: -0.3833, M: 3.6754, S: 0.0908, SD3neg: 2.8, SD2neg: 3.1, SD1neg: 3.4, SD0: 3.7, SD1: 4, SD2: 4.4, SD3: 4.9 },
  { Length: 52, L: -0.3833, M: 3.7911, S: 0.09085, SD3neg: 2.9, SD2neg: 3.2, SD1neg: 3.5, SD0: 3.8, SD1: 4.2, SD2: 4.6, SD3: 5.1 },
  { Length: 52.5, L: -0.3833, M: 3.9105, S: 0.09089, SD3neg: 3, SD2neg: 3.3, SD1neg: 3.6, SD0: 3.9, SD1: 4.3, SD2: 4.7, SD3: 5.2 },
  { Length: 53, L: -0.3833, M: 4.0332, S: 0.09093, SD3neg: 3.1, SD2neg: 3.4, SD1neg: 3.7, SD0: 4, SD1: 4.4, SD2: 4.9, SD3: 5.4 },
  { Length: 53.5, L: -0.3833, M: 4.1591, S: 0.09098, SD3neg: 3.2, SD2neg: 3.5, SD1neg: 3.8, SD0: 4.2, SD1: 4.6, SD2: 5, SD3: 5.5 },
  { Length: 54, L: -0.3833, M: 4.2875, S: 0.09102, SD3neg: 3.3, SD2neg: 3.6, SD1neg: 3.9, SD0: 4.3, SD1: 4.7, SD2: 5.2, SD3: 5.7 },
  { Length: 54.5, L: -0.3833, M: 4.4179, S: 0.09106, SD3neg: 3.4, SD2neg: 3.7, SD1neg: 4, SD0: 4.4, SD1: 4.8, SD2: 5.3, SD3: 5.9 },
  { Length: 55, L: -0.3833, M: 4.5498, S: 0.0911, SD3neg: 3.5, SD2neg: 3.8, SD1neg: 4.2, SD0: 4.5, SD1: 5, SD2: 5.5, SD3: 6.1 },
  { Length: 55.5, L: -0.3833, M: 4.6827, S: 0.09114, SD3neg: 3.6, SD2neg: 3.9, SD1neg: 4.3, SD0: 4.7, SD1: 5.1, SD2: 5.7, SD3: 6.3 },
  { Length: 56, L: -0.3833, M: 4.8162, S: 0.09118, SD3neg: 3.7, SD2neg: 4, SD1neg: 4.4, SD0: 4.8, SD1: 5.3, SD2: 5.8, SD3: 6.4 },
  { Length: 56.5, L: -0.3833, M: 4.95, S: 0.09121, SD3neg: 3.8, SD2neg: 4.1, SD1neg: 4.5, SD0: 5, SD1: 5.4, SD2: 6, SD3: 6.6 },
  { Length: 57, L: -0.3833, M: 5.0837, S: 0.09125, SD3neg: 3.9, SD2neg: 4.3, SD1neg: 4.6, SD0: 5.1, SD1: 5.6, SD2: 6.1, SD3: 6.8 },
  { Length: 57.5, L: -0.3833, M: 5.2173, S: 0.09128, SD3neg: 4, SD2neg: 4.4, SD1neg: 4.8, SD0: 5.2, SD1: 5.7, SD2: 6.3, SD3: 7 },
  { Length: 58, L: -0.3833, M: 5.3507, S: 0.0913, SD3neg: 4.1, SD2neg: 4.5, SD1neg: 4.9, SD0: 5.4, SD1: 5.9, SD2: 6.5, SD3: 7.1 },
  { Length: 58.5, L: -0.3833, M: 5.4834, S: 0.09132, SD3neg: 4.2, SD2neg: 4.6, SD1neg: 5, SD0: 5.5, SD1: 6, SD2: 6.6, SD3: 7.3 },
  { Length: 59, L: -0.3833, M: 5.6151, S: 0.09134, SD3neg: 4.3, SD2neg: 4.7, SD1neg: 5.1, SD0: 5.6, SD1: 6.2, SD2: 6.8, SD3: 7.5 },
  { Length: 59.5, L: -0.3833, M: 5.7454, S: 0.09135, SD3neg: 4.4, SD2neg: 4.8, SD1neg: 5.3, SD0: 5.7, SD1: 6.3, SD2: 6.9, SD3: 7.7 },
  { Length: 60, L: -0.3833, M: 5.8742, S: 0.09136, SD3neg: 4.5, SD2neg: 4.9, SD1neg: 5.4, SD0: 5.9, SD1: 6.4, SD2: 7.1, SD3: 7.8 },
  { Length: 60.5, L: -0.3833, M: 6.0014, S: 0.09137, SD3neg: 4.6, SD2neg: 5, SD1neg: 5.5, SD0: 6, SD1: 6.6, SD2: 7.3, SD3: 8 },
  { Length: 61, L: -0.3833, M: 6.127, S: 0.09137, SD3neg: 4.7, SD2neg: 5.1, SD1neg: 5.6, SD0: 6.1, SD1: 6.7, SD2: 7.4, SD3: 8.2 },
  { Length: 61.5, L: -0.3833, M: 6.2511, S: 0.09136, SD3neg: 4.8, SD2neg: 5.2, SD1neg: 5.7, SD0: 6.3, SD1: 6.9, SD2: 7.6, SD3: 8.4 },
  { Length: 62, L: -0.3833, M: 6.3738, S: 0.09135, SD3neg: 4.9, SD2neg: 5.3, SD1neg: 5.8, SD0: 6.4, SD1: 7, SD2: 7.7, SD3: 8.5 },
  { Length: 62.5, L: -0.3833, M: 6.4948, S: 0.09133, SD3neg: 5, SD2neg: 5.4, SD1neg: 5.9, SD0: 6.5, SD1: 7.1, SD2: 7.8, SD3: 8.7 },
  { Length: 63, L: -0.3833, M: 6.6144, S: 0.09131, SD3neg: 5.1, SD2neg: 5.5, SD1neg: 6, SD0: 6.6, SD1: 7.3, SD2: 8, SD3: 8.8 },
  { Length: 63.5, L: -0.3833, M: 6.7328, S: 0.09129, SD3neg: 5.2, SD2neg: 5.6, SD1neg: 6.2, SD0: 6.7, SD1: 7.4, SD2: 8.1, SD3: 9 },
  { Length: 64, L: -0.3833, M: 6.8501, S: 0.09126, SD3neg: 5.3, SD2neg: 5.7, SD1neg: 6.3, SD0: 6.9, SD1: 7.5, SD2: 8.3, SD3: 9.1 },
  { Length: 64.5, L: -0.3833, M: 6.9662, S: 0.09123, SD3neg: 5.4, SD2neg: 5.8, SD1neg: 6.4, SD0: 7, SD1: 7.6, SD2: 8.4, SD3: 9.3 },
  { Length: 65, L: -0.3833, M: 7.0812, S: 0.09119, SD3neg: 5.5, SD2neg: 5.9, SD1neg: 6.5, SD0: 7.1, SD1: 7.8, SD2: 8.6, SD3: 9.5 },
  { Length: 65.5, L: -0.3833, M: 7.195, S: 0.09115, SD3neg: 5.5, SD2neg: 6, SD1neg: 6.6, SD0: 7.2, SD1: 7.9, SD2: 8.7, SD3: 9.6 },
  { Length: 66, L: -0.3833, M: 7.3076, S: 0.0911, SD3neg: 5.6, SD2neg: 6.1, SD1neg: 6.7, SD0: 7.3, SD1: 8, SD2: 8.8, SD3: 9.8 },
  { Length: 66.5, L: -0.3833, M: 7.4189, S: 0.09106, SD3neg: 5.7, SD2neg: 6.2, SD1neg: 6.8, SD0: 7.4, SD1: 8.1, SD2: 9, SD3: 9.9 },
  { Length: 67, L: -0.3833, M: 7.5288, S: 0.09101, SD3neg: 5.8, SD2neg: 6.3, SD1neg: 6.9, SD0: 7.5, SD1: 8.3, SD2: 9.1, SD3: 10 },
  { Length: 67.5, L: -0.3833, M: 7.6375, S: 0.09096, SD3neg: 5.9, SD2neg: 6.4, SD1neg: 7, SD0: 7.6, SD1: 8.4, SD2: 9.2, SD3: 10.2 },
  { Length: 68, L: -0.3833, M: 7.7448, S: 0.0909, SD3neg: 6, SD2neg: 6.5, SD1neg: 7.1, SD0: 7.7, SD1: 8.5, SD2: 9.4, SD3: 10.3 },
  { Length: 68.5, L: -0.3833, M: 7.8509, S: 0.09085, SD3neg: 6.1, SD2neg: 6.6, SD1neg: 7.2, SD0: 7.9, SD1: 8.6, SD2: 9.5, SD3: 10.5 },
  { Length: 69, L: -0.3833, M: 7.9559, S: 0.09079, SD3neg: 6.1, SD2neg: 6.7, SD1neg: 7.3, SD0: 8, SD1: 8.7, SD2: 9.6, SD3: 10.6 },
  { Length: 69.5, L: -0.3833, M: 8.0599, S: 0.09074, SD3neg: 6.2, SD2neg: 6.8, SD1neg: 7.4, SD0: 8.1, SD1: 8.8, SD2: 9.7, SD3: 10.7 },
  { Length: 70, L: -0.3833, M: 8.163, S: 0.09068, SD3neg: 6.3, SD2neg: 6.9, SD1neg: 7.5, SD0: 8.2, SD1: 9, SD2: 9.9, SD3: 10.9 },
  { Length: 70.5, L: -0.3833, M: 8.2651, S: 0.09062, SD3neg: 6.4, SD2neg: 6.9, SD1neg: 7.6, SD0: 8.3, SD1: 9.1, SD2: 10, SD3: 11 },
  { Length: 71, L: -0.3833, M: 8.3666, S: 0.09056, SD3neg: 6.5, SD2neg: 7, SD1neg: 7.7, SD0: 8.4, SD1: 9.2, SD2: 10.1, SD3: 11.1 },
  { Length: 71.5, L: -0.3833, M: 8.4676, S: 0.0905, SD3neg: 6.5, SD2neg: 7.1, SD1neg: 7.7, SD0: 8.5, SD1: 9.3, SD2: 10.2, SD3: 11.3 },
  { Length: 72, L: -0.3833, M: 8.5679, S: 0.09043, SD3neg: 6.6, SD2neg: 7.2, SD1neg: 7.8, SD0: 8.6, SD1: 9.4, SD2: 10.3, SD3: 11.4 },
  { Length: 72.5, L: -0.3833, M: 8.6674, S: 0.09037, SD3neg: 6.7, SD2neg: 7.3, SD1neg: 7.9, SD0: 8.7, SD1: 9.5, SD2: 10.5, SD3: 11.5 },
  { Length: 73, L: -0.3833, M: 8.7661, S: 0.09031, SD3neg: 6.8, SD2neg: 7.4, SD1neg: 8, SD0: 8.8, SD1: 9.6, SD2: 10.6, SD3: 11.7 },
  { Length: 73.5, L: -0.3833, M: 8.8638, S: 0.09025, SD3neg: 6.9, SD2neg: 7.4, SD1neg: 8.1, SD0: 8.9, SD1: 9.7, SD2: 10.7, SD3: 11.8 },
  { Length: 74, L: -0.3833, M: 8.9601, S: 0.09018, SD3neg: 6.9, SD2neg: 7.5, SD1neg: 8.2, SD0: 9, SD1: 9.8, SD2: 10.8, SD3: 11.9 },
  { Length: 74.5, L: -0.3833, M: 9.0552, S: 0.09012, SD3neg: 7, SD2neg: 7.6, SD1neg: 8.3, SD0: 9.1, SD1: 9.9, SD2: 10.9, SD3: 12 },
  { Length: 75, L: -0.3833, M: 9.149, S: 0.09005, SD3neg: 7.1, SD2neg: 7.7, SD1neg: 8.4, SD0: 9.1, SD1: 10, SD2: 11, SD3: 12.2 },
  { Length: 75.5, L: -0.3833, M: 9.2418, S: 0.08999, SD3neg: 7.1, SD2neg: 7.8, SD1neg: 8.5, SD0: 9.2, SD1: 10.1, SD2: 11.1, SD3: 12.3 },
  { Length: 76, L: -0.3833, M: 9.3337, S: 0.08992, SD3neg: 7.2, SD2neg: 7.8, SD1neg: 8.5, SD0: 9.3, SD1: 10.2, SD2: 11.2, SD3: 12.4 },
  { Length: 76.5, L: -0.3833, M: 9.4252, S: 0.08985, SD3neg: 7.3, SD2neg: 7.9, SD1neg: 8.6, SD0: 9.4, SD1: 10.3, SD2: 11.4, SD3: 12.5 },
  { Length: 77, L: -0.3833, M: 9.5166, S: 0.08979, SD3neg: 7.4, SD2neg: 8, SD1neg: 8.7, SD0: 9.5, SD1: 10.4, SD2: 11.5, SD3: 12.6 },
  { Length: 77.5, L: -0.3833, M: 9.6086, S: 0.08972, SD3neg: 7.4, SD2neg: 8.1, SD1neg: 8.8, SD0: 9.6, SD1: 10.5, SD2: 11.6, SD3: 12.8 },
  { Length: 78, L: -0.3833, M: 9.7015, S: 0.08965, SD3neg: 7.5, SD2neg: 8.2, SD1neg: 8.9, SD0: 9.7, SD1: 10.6, SD2: 11.7, SD3: 12.9 },
  { Length: 78.5, L: -0.3833, M: 9.7957, S: 0.08959, SD3neg: 7.6, SD2neg: 8.2, SD1neg: 9, SD0: 9.8, SD1: 10.7, SD2: 11.8, SD3: 13 },
  { Length: 79, L: -0.3833, M: 9.8915, S: 0.08952, SD3neg: 7.7, SD2neg: 8.3, SD1neg: 9.1, SD0: 9.9, SD1: 10.8, SD2: 11.9, SD3: 13.1 },
  { Length: 79.5, L: -0.3833, M: 9.9892, S: 0.08946, SD3neg: 7.7, SD2neg: 8.4, SD1neg: 9.1, SD0: 10, SD1: 10.9, SD2: 12, SD3: 13.3 },
  { Length: 80, L: -0.3833, M: 10.0891, S: 0.0894, SD3neg: 7.8, SD2neg: 8.5, SD1neg: 9.2, SD0: 10.1, SD1: 11, SD2: 12.1, SD3: 13.4 },
  { Length: 80.5, L: -0.3833, M: 10.1916, S: 0.08934, SD3neg: 7.9, SD2neg: 8.6, SD1neg: 9.3, SD0: 10.2, SD1: 11.2, SD2: 12.3, SD3: 13.5 },
  { Length: 81, L: -0.3833, M: 10.2965, S: 0.08928, SD3neg: 8, SD2neg: 8.7, SD1neg: 9.4, SD0: 10.3, SD1: 11.3, SD2: 12.4, SD3: 13.7 },
  { Length: 81.5, L: -0.3833, M: 10.4041, S: 0.08923, SD3neg: 8.1, SD2neg: 8.8, SD1neg: 9.5, SD0: 10.4, SD1: 11.4, SD2: 12.5, SD3: 13.8 },
  { Length: 82, L: -0.3833, M: 10.514, S: 0.08918, SD3neg: 8.1, SD2neg: 8.8, SD1neg: 9.6, SD0: 10.5, SD1: 11.5, SD2: 12.6, SD3: 13.9 },
  { Length: 82.5, L: -0.3833, M: 10.6263, S: 0.08914, SD3neg: 8.2, SD2neg: 8.9, SD1neg: 9.7, SD0: 10.6, SD1: 11.6, SD2: 12.8, SD3: 14.1 },
  { Length: 83, L: -0.3833, M: 10.741, S: 0.0891, SD3neg: 8.3, SD2neg: 9, SD1neg: 9.8, SD0: 10.7, SD1: 11.8, SD2: 12.9, SD3: 14.2 }
];

// WHO Growth Standards - Weight for Height (Length) - Boys
const GROWTH_STANDARDS_BOYS: LMSData[] = [
  { Length: 45, L: -0.3521, M: 2.441, S: 0.09182, SD3neg: 1.9, SD2neg: 2, SD1neg: 2.2, SD0: 2.4, SD1: 2.7, SD2: 3, SD3: 3.3 },
  { Length: 45.5, L: -0.3521, M: 2.5244, S: 0.09153, SD3neg: 1.9, SD2neg: 2.1, SD1neg: 2.3, SD0: 2.5, SD1: 2.8, SD2: 3.1, SD3: 3.4 },
  { Length: 46, L: -0.3521, M: 2.6077, S: 0.09124, SD3neg: 2, SD2neg: 2.2, SD1neg: 2.4, SD0: 2.6, SD1: 2.9, SD2: 3.1, SD3: 3.5 },
  { Length: 46.5, L: -0.3521, M: 2.6913, S: 0.09094, SD3neg: 2.1, SD2neg: 2.3, SD1neg: 2.5, SD0: 2.7, SD1: 3, SD2: 3.2, SD3: 3.6 },
  { Length: 47, L: -0.3521, M: 2.7755, S: 0.09065, SD3neg: 2.1, SD2neg: 2.3, SD1neg: 2.5, SD0: 2.8, SD1: 3, SD2: 3.3, SD3: 3.7 },
  { Length: 47.5, L: -0.3521, M: 2.8609, S: 0.09036, SD3neg: 2.2, SD2neg: 2.4, SD1neg: 2.6, SD0: 2.9, SD1: 3.1, SD2: 3.4, SD3: 3.8 },
  { Length: 48, L: -0.3521, M: 2.948, S: 0.09007, SD3neg: 2.3, SD2neg: 2.5, SD1neg: 2.7, SD0: 2.9, SD1: 3.2, SD2: 3.6, SD3: 3.9 },
  { Length: 48.5, L: -0.3521, M: 3.0377, S: 0.08977, SD3neg: 2.3, SD2neg: 2.6, SD1neg: 2.8, SD0: 3, SD1: 3.3, SD2: 3.7, SD3: 4 },
  { Length: 49, L: -0.3521, M: 3.1308, S: 0.08948, SD3neg: 2.4, SD2neg: 2.6, SD1neg: 2.9, SD0: 3.1, SD1: 3.4, SD2: 3.8, SD3: 4.2 },
  { Length: 49.5, L: -0.3521, M: 3.2276, S: 0.08919, SD3neg: 2.5, SD2neg: 2.7, SD1neg: 3, SD0: 3.2, SD1: 3.5, SD2: 3.9, SD3: 4.3 },
  { Length: 50, L: -0.3521, M: 3.3278, S: 0.0889, SD3neg: 2.6, SD2neg: 2.8, SD1neg: 3, SD0: 3.3, SD1: 3.6, SD2: 4, SD3: 4.4 },
  { Length: 50.5, L: -0.3521, M: 3.4311, S: 0.08861, SD3neg: 2.7, SD2neg: 2.9, SD1neg: 3.1, SD0: 3.4, SD1: 3.8, SD2: 4.1, SD3: 4.5 },
  { Length: 51, L: -0.3521, M: 3.5376, S: 0.08831, SD3neg: 2.7, SD2neg: 3, SD1neg: 3.2, SD0: 3.5, SD1: 3.9, SD2: 4.2, SD3: 4.7 },
  { Length: 51.5, L: -0.3521, M: 3.6477, S: 0.08801, SD3neg: 2.8, SD2neg: 3.1, SD1neg: 3.3, SD0: 3.6, SD1: 4, SD2: 4.4, SD3: 4.8 },
  { Length: 52, L: -0.3521, M: 3.762, S: 0.08771, SD3neg: 2.9, SD2neg: 3.2, SD1neg: 3.5, SD0: 3.8, SD1: 4.1, SD2: 4.5, SD3: 5 },
  { Length: 52.5, L: -0.3521, M: 3.8814, S: 0.08741, SD3neg: 3, SD2neg: 3.3, SD1neg: 3.6, SD0: 3.9, SD1: 4.2, SD2: 4.6, SD3: 5.1 },
  { Length: 53, L: -0.3521, M: 4.006, S: 0.08711, SD3neg: 3.1, SD2neg: 3.4, SD1neg: 3.7, SD0: 4, SD1: 4.4, SD2: 4.8, SD3: 5.3 },
  { Length: 53.5, L: -0.3521, M: 4.1354, S: 0.08681, SD3neg: 3.2, SD2neg: 3.5, SD1neg: 3.8, SD0: 4.1, SD1: 4.5, SD2: 4.9, SD3: 5.4 },
  { Length: 54, L: -0.3521, M: 4.2693, S: 0.08651, SD3neg: 3.3, SD2neg: 3.6, SD1neg: 3.9, SD0: 4.3, SD1: 4.7, SD2: 5.1, SD3: 5.6 },
  { Length: 54.5, L: -0.3521, M: 4.4066, S: 0.08621, SD3neg: 3.4, SD2neg: 3.7, SD1neg: 4, SD0: 4.4, SD1: 4.8, SD2: 5.3, SD3: 5.8 },
  { Length: 55, L: -0.3521, M: 4.5467, S: 0.08592, SD3neg: 3.6, SD2neg: 3.8, SD1neg: 4.2, SD0: 4.5, SD1: 5, SD2: 5.4, SD3: 6 },
  { Length: 55.5, L: -0.3521, M: 4.6892, S: 0.08563, SD3neg: 3.7, SD2neg: 4, SD1neg: 4.3, SD0: 4.7, SD1: 5.1, SD2: 5.6, SD3: 6.1 },
  { Length: 56, L: -0.3521, M: 4.8338, S: 0.08535, SD3neg: 3.8, SD2neg: 4.1, SD1neg: 4.4, SD0: 4.8, SD1: 5.3, SD2: 5.8, SD3: 6.3 },
  { Length: 56.5, L: -0.3521, M: 4.9796, S: 0.08507, SD3neg: 3.9, SD2neg: 4.2, SD1neg: 4.6, SD0: 5, SD1: 5.4, SD2: 5.9, SD3: 6.5 },
  { Length: 57, L: -0.3521, M: 5.1259, S: 0.08481, SD3neg: 4, SD2neg: 4.3, SD1neg: 4.7, SD0: 5.1, SD1: 5.6, SD2: 6.1, SD3: 6.7 },
  { Length: 57.5, L: -0.3521, M: 5.2721, S: 0.08455, SD3neg: 4.1, SD2neg: 4.5, SD1neg: 4.9, SD0: 5.3, SD1: 5.7, SD2: 6.3, SD3: 6.9 },
  { Length: 58, L: -0.3521, M: 5.418, S: 0.0843, SD3neg: 4.3, SD2neg: 4.6, SD1neg: 5, SD0: 5.4, SD1: 5.9, SD2: 6.4, SD3: 7.1 },
  { Length: 58.5, L: -0.3521, M: 5.5632, S: 0.08406, SD3neg: 4.4, SD2neg: 4.7, SD1neg: 5.1, SD0: 5.6, SD1: 6.1, SD2: 6.6, SD3: 7.2 },
  { Length: 59, L: -0.3521, M: 5.7074, S: 0.08383, SD3neg: 4.5, SD2neg: 4.8, SD1neg: 5.3, SD0: 5.7, SD1: 6.2, SD2: 6.8, SD3: 7.4 },
  { Length: 59.5, L: -0.3521, M: 5.8501, S: 0.08362, SD3neg: 4.6, SD2neg: 5, SD1neg: 5.4, SD0: 5.9, SD1: 6.4, SD2: 7, SD3: 7.6 },
  { Length: 60, L: -0.3521, M: 5.9907, S: 0.08342, SD3neg: 4.7, SD2neg: 5.1, SD1neg: 5.5, SD0: 6, SD1: 6.5, SD2: 7.1, SD3: 7.8 },
  { Length: 60.5, L: -0.3521, M: 6.1284, S: 0.08324, SD3neg: 4.8, SD2neg: 5.2, SD1neg: 5.6, SD0: 6.1, SD1: 6.7, SD2: 7.3, SD3: 8 },
  { Length: 61, L: -0.3521, M: 6.2632, S: 0.08308, SD3neg: 4.9, SD2neg: 5.3, SD1neg: 5.8, SD0: 6.3, SD1: 6.8, SD2: 7.4, SD3: 8.1 },
  { Length: 61.5, L: -0.3521, M: 6.3954, S: 0.08292, SD3neg: 5, SD2neg: 5.4, SD1neg: 5.9, SD0: 6.4, SD1: 7, SD2: 7.6, SD3: 8.3 },
  { Length: 62, L: -0.3521, M: 6.5251, S: 0.08279, SD3neg: 5.1, SD2neg: 5.6, SD1neg: 6, SD0: 6.5, SD1: 7.1, SD2: 7.7, SD3: 8.5 },
  { Length: 62.5, L: -0.3521, M: 6.6527, S: 0.08266, SD3neg: 5.2, SD2neg: 5.7, SD1neg: 6.1, SD0: 6.7, SD1: 7.2, SD2: 7.9, SD3: 8.6 },
  { Length: 63, L: -0.3521, M: 6.7786, S: 0.08255, SD3neg: 5.3, SD2neg: 5.8, SD1neg: 6.2, SD0: 6.8, SD1: 7.4, SD2: 8, SD3: 8.8 },
  { Length: 63.5, L: -0.3521, M: 6.9028, S: 0.08245, SD3neg: 5.4, SD2neg: 5.9, SD1neg: 6.4, SD0: 6.9, SD1: 7.5, SD2: 8.2, SD3: 8.9 },
  { Length: 64, L: -0.3521, M: 7.0255, S: 0.08236, SD3neg: 5.5, SD2neg: 6, SD1neg: 6.5, SD0: 7, SD1: 7.6, SD2: 8.3, SD3: 9.1 },
  { Length: 64.5, L: -0.3521, M: 7.1467, S: 0.08229, SD3neg: 5.6, SD2neg: 6.1, SD1neg: 6.6, SD0: 7.1, SD1: 7.8, SD2: 8.5, SD3: 9.3 },
  { Length: 65, L: -0.3521, M: 7.2666, S: 0.08223, SD3neg: 5.7, SD2neg: 6.2, SD1neg: 6.7, SD0: 7.3, SD1: 7.9, SD2: 8.6, SD3: 9.4 },
  { Length: 65.5, L: -0.3521, M: 7.3854, S: 0.08218, SD3neg: 5.8, SD2neg: 6.3, SD1neg: 6.8, SD0: 7.4, SD1: 8, SD2: 8.7, SD3: 9.6 },
  { Length: 66, L: -0.3521, M: 7.5034, S: 0.08215, SD3neg: 5.9, SD2neg: 6.4, SD1neg: 6.9, SD0: 7.5, SD1: 8.2, SD2: 8.9, SD3: 9.7 },
  { Length: 66.5, L: -0.3521, M: 7.6206, S: 0.08213, SD3neg: 6, SD2neg: 6.5, SD1neg: 7, SD0: 7.6, SD1: 8.3, SD2: 9, SD3: 9.9 },
  { Length: 67, L: -0.3521, M: 7.737, S: 0.08212, SD3neg: 6.1, SD2neg: 6.6, SD1neg: 7.1, SD0: 7.7, SD1: 8.4, SD2: 9.2, SD3: 10 },
  { Length: 67.5, L: -0.3521, M: 7.8526, S: 0.08212, SD3neg: 6.2, SD2neg: 6.7, SD1neg: 7.2, SD0: 7.9, SD1: 8.5, SD2: 9.3, SD3: 10.2 },
  { Length: 68, L: -0.3521, M: 7.9674, S: 0.08214, SD3neg: 6.3, SD2neg: 6.8, SD1neg: 7.3, SD0: 8, SD1: 8.7, SD2: 9.4, SD3: 10.3 },
  { Length: 68.5, L: -0.3521, M: 8.0816, S: 0.08216, SD3neg: 6.4, SD2neg: 6.9, SD1neg: 7.5, SD0: 8.1, SD1: 8.8, SD2: 9.6, SD3: 10.5 },
  { Length: 69, L: -0.3521, M: 8.1955, S: 0.08219, SD3neg: 6.5, SD2neg: 7, SD1neg: 7.6, SD0: 8.2, SD1: 8.9, SD2: 9.7, SD3: 10.6 },
  { Length: 69.5, L: -0.3521, M: 8.3092, S: 0.08224, SD3neg: 6.6, SD2neg: 7.1, SD1neg: 7.7, SD0: 8.3, SD1: 9, SD2: 9.8, SD3: 10.8 },
  { Length: 70, L: -0.3521, M: 8.4227, S: 0.08229, SD3neg: 6.6, SD2neg: 7.2, SD1neg: 7.8, SD0: 8.4, SD1: 9.2, SD2: 10, SD3: 10.9 },
  { Length: 70.5, L: -0.3521, M: 8.5358, S: 0.08235, SD3neg: 6.7, SD2neg: 7.3, SD1neg: 7.9, SD0: 8.5, SD1: 9.3, SD2: 10.1, SD3: 11.1 },
  { Length: 71, L: -0.3521, M: 8.648, S: 0.08241, SD3neg: 6.8, SD2neg: 7.4, SD1neg: 8, SD0: 8.6, SD1: 9.4, SD2: 10.2, SD3: 11.2 },
  { Length: 71.5, L: -0.3521, M: 8.7594, S: 0.08248, SD3neg: 6.9, SD2neg: 7.5, SD1neg: 8.1, SD0: 8.8, SD1: 9.5, SD2: 10.4, SD3: 11.3 },
  { Length: 72, L: -0.3521, M: 8.8697, S: 0.08254, SD3neg: 7, SD2neg: 7.6, SD1neg: 8.2, SD0: 8.9, SD1: 9.6, SD2: 10.5, SD3: 11.5 },
  { Length: 72.5, L: -0.3521, M: 8.9788, S: 0.08262, SD3neg: 7.1, SD2neg: 7.6, SD1neg: 8.3, SD0: 9, SD1: 9.8, SD2: 10.6, SD3: 11.6 },
  { Length: 73, L: -0.3521, M: 9.0865, S: 0.08269, SD3neg: 7.2, SD2neg: 7.7, SD1neg: 8.4, SD0: 9.1, SD1: 9.9, SD2: 10.8, SD3: 11.8 },
  { Length: 73.5, L: -0.3521, M: 9.1927, S: 0.08276, SD3neg: 7.2, SD2neg: 7.8, SD1neg: 8.5, SD0: 9.2, SD1: 10, SD2: 10.9, SD3: 11.9 },
  { Length: 74, L: -0.3521, M: 9.2974, S: 0.08283, SD3neg: 7.3, SD2neg: 7.9, SD1neg: 8.6, SD0: 9.3, SD1: 10.1, SD2: 11, SD3: 12.1 },
  { Length: 74.5, L: -0.3521, M: 9.401, S: 0.08289, SD3neg: 7.4, SD2neg: 8, SD1neg: 8.7, SD0: 9.4, SD1: 10.2, SD2: 11.2, SD3: 12.2 },
  { Length: 75, L: -0.3521, M: 9.5032, S: 0.08295, SD3neg: 7.5, SD2neg: 8.1, SD1neg: 8.8, SD0: 9.5, SD1: 10.3, SD2: 11.3, SD3: 12.3 },
  { Length: 75.5, L: -0.3521, M: 9.6041, S: 0.08301, SD3neg: 7.6, SD2neg: 8.2, SD1neg: 8.8, SD0: 9.6, SD1: 10.4, SD2: 11.4, SD3: 12.5 },
  { Length: 76, L: -0.3521, M: 9.7033, S: 0.08307, SD3neg: 7.6, SD2neg: 8.3, SD1neg: 8.9, SD0: 9.7, SD1: 10.6, SD2: 11.5, SD3: 12.6 },
  { Length: 76.5, L: -0.3521, M: 9.8007, S: 0.08311, SD3neg: 7.7, SD2neg: 8.3, SD1neg: 9, SD0: 9.8, SD1: 10.7, SD2: 11.6, SD3: 12.7 },
  { Length: 77, L: -0.3521, M: 9.8963, S: 0.08314, SD3neg: 7.8, SD2neg: 8.4, SD1neg: 9.1, SD0: 9.9, SD1: 10.8, SD2: 11.7, SD3: 12.8 },
  { Length: 77.5, L: -0.3521, M: 9.9902, S: 0.08317, SD3neg: 7.9, SD2neg: 8.5, SD1neg: 9.2, SD0: 10, SD1: 10.9, SD2: 11.9, SD3: 13 },
  { Length: 78, L: -0.3521, M: 10.0827, S: 0.08318, SD3neg: 7.9, SD2neg: 8.6, SD1neg: 9.3, SD0: 10.1, SD1: 11, SD2: 12, SD3: 13.1 },
  { Length: 78.5, L: -0.3521, M: 10.1741, S: 0.08318, SD3neg: 8, SD2neg: 8.7, SD1neg: 9.4, SD0: 10.2, SD1: 11.1, SD2: 12.1, SD3: 13.2 },
  { Length: 79, L: -0.3521, M: 10.2649, S: 0.08316, SD3neg: 8.1, SD2neg: 8.7, SD1neg: 9.5, SD0: 10.3, SD1: 11.2, SD2: 12.2, SD3: 13.3 },
  { Length: 79.5, L: -0.3521, M: 10.3558, S: 0.08313, SD3neg: 8.2, SD2neg: 8.8, SD1neg: 9.5, SD0: 10.4, SD1: 11.3, SD2: 12.3, SD3: 13.4 },
  { Length: 80, L: -0.3521, M: 10.4475, S: 0.08308, SD3neg: 8.2, SD2neg: 8.9, SD1neg: 9.6, SD0: 10.4, SD1: 11.4, SD2: 12.4, SD3: 13.6 },
  { Length: 80.5, L: -0.3521, M: 10.5405, S: 0.08301, SD3neg: 8.3, SD2neg: 9, SD1neg: 9.7, SD0: 10.5, SD1: 11.5, SD2: 12.5, SD3: 13.7 },
  { Length: 81, L: -0.3521, M: 10.6352, S: 0.08293, SD3neg: 8.4, SD2neg: 9.1, SD1neg: 9.8, SD0: 10.6, SD1: 11.6, SD2: 12.6, SD3: 13.8 },
  { Length: 81.5, L: -0.3521, M: 10.7322, S: 0.08284, SD3neg: 8.5, SD2neg: 9.1, SD1neg: 9.9, SD0: 10.7, SD1: 11.7, SD2: 12.7, SD3: 13.9 },
  { Length: 82, L: -0.3521, M: 10.8321, S: 0.08273, SD3neg: 8.5, SD2neg: 9.2, SD1neg: 10, SD0: 10.8, SD1: 11.8, SD2: 12.8, SD3: 14 },
  { Length: 82.5, L: -0.3521, M: 10.935, S: 0.0826, SD3neg: 8.6, SD2neg: 9.3, SD1neg: 10.1, SD0: 10.9, SD1: 11.9, SD2: 13, SD3: 14.2 },
  { Length: 83, L: -0.3521, M: 11.0415, S: 0.08246, SD3neg: 8.7, SD2neg: 9.4, SD1neg: 10.2, SD0: 11, SD1: 12, SD2: 13.1, SD3: 14.3 },
  { Length: 83.5, L: -0.3521, M: 11.1516, S: 0.08231, SD3neg: 8.8, SD2neg: 9.5, SD1neg: 10.3, SD0: 11.2, SD1: 12.1, SD2: 13.2, SD3: 14.4 },
  { Length: 84, L: -0.3521, M: 11.2651, S: 0.08215, SD3neg: 8.9, SD2neg: 9.6, SD1neg: 10.4, SD0: 11.3, SD1: 12.2, SD2: 13.3, SD3: 14.6 },
  { Length: 84.5, L: -0.3521, M: 11.3817, S: 0.08198, SD3neg: 9, SD2neg: 9.7, SD1neg: 10.5, SD0: 11.4, SD1: 12.4, SD2: 13.5, SD3: 14.7 },
  { Length: 85, L: -0.3521, M: 11.5007, S: 0.08181, SD3neg: 9.1, SD2neg: 9.8, SD1neg: 10.6, SD0: 11.5, SD1: 12.5, SD2: 13.6, SD3: 14.9 },
  { Length: 85.5, L: -0.3521, M: 11.6218, S: 0.08163, SD3neg: 9.2, SD2neg: 9.9, SD1neg: 10.7, SD0: 11.6, SD1: 12.6, SD2: 13.7, SD3: 15 }
];

// Find LMS data for given height and gender
const findLMSData = (height: number, gender: 'male' | 'female'): LMSData | null => {
  const standards = gender === 'female' ? GROWTH_STANDARDS_GIRLS : GROWTH_STANDARDS_BOYS;
  
  // Find exact match first
  let exactMatch = standards.find(data => data.Length === height);
  if (exactMatch) return exactMatch;
  
  // If no exact match, find closest height
  let closest = standards.reduce((prev, curr) => {
    return Math.abs(curr.Length - height) < Math.abs(prev.Length - height) ? curr : prev;
  });
  
  return closest;
};

// Calculate Z-score using LMS method
const calculateLMSZScore = (weight: number, L: number, M: number, S: number): number => {
  let zScore: number;
  
  if (L !== 0) {
    // Standard LMS formula when L ≠ 0
    zScore = (Math.pow(weight / M, L) - 1) / (L * S);
  } else {
    // When L = 0, use logarithmic formula
    zScore = Math.log(weight / M) / S;
  }
  
  return Math.round(zScore * 100) / 100; // Round to 2 decimal places
};

export const calculateZScore = (
  weight: number, 
  height: number, 
  ageInMonths: number, 
  gender: 'male' | 'female',
  hasEdema: boolean = false
): ZScoreResult => {
  console.log(`Calculating Z-score for: weight=${weight}kg, height=${height}cm, age=${ageInMonths}m, gender=${gender}, edema=${hasEdema}`);
  
  // If edema is present, automatically classify as SAM
  if (hasEdema) {
    console.log('Edema present - classified as SAM');
    return {
      whz: -999, // Special value to indicate edema-based classification
      classification: 'sam',
      alert: 'red'
    };
  }
  
  // Find LMS data for the child's height
  const lmsData = findLMSData(height, gender);
  
  if (!lmsData) {
    console.log('No LMS data found for height:', height);
    // Fallback - return a default safe classification
    return {
      whz: 0,
      classification: 'normal',
      alert: 'none'
    };
  }
  
  console.log('Using LMS data:', lmsData);
  
  // Calculate Z-score using LMS method
  const whz = calculateLMSZScore(weight, lmsData.L, lmsData.M, lmsData.S);
  
  console.log('Calculated WHZ Z-score:', whz);
  
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
  
  console.log(`Final classification: ${classification} (Z-score: ${whz})`);
  
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
        description: 'This child requires immediate referral to a Nutrition Rehabilitation Centre (NRC) for admission and treatment. Contact the nearest facility immediately.'
      };
    case 'mam':
      return {
        title: 'Warning: Moderate Acute Malnutrition (MAM)',
        description: 'This child should be admitted to the Village Child Development Centre (VCDC) at the Anganwadi level for supplementary nutrition support and regular monitoring.'
      };
    default:
      return { title: '', description: '' };
  }
};
