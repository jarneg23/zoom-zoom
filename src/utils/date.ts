export const getDateDiff = (d1: Date, d2: Date): number => {
  const diffDate = d1.getTime() - d2.getTime();
  return Math.abs(diffDate / (1000 * 60 * 60 * 24));
}

export const getAllDayFromTargetMonth = (month: number): number[] => {
  const lastDay = getLastDayFromTargetMonth(month);
  return Array.from({ length: lastDay }, (_, index) => index + 1);
}

export const getLastDayFromTargetMonth = (month: number): number => {
  const currentDate = new Date();
  currentDate.setMonth(month - 1);
  return new Date(currentDate.getFullYear(), month, 0).getDate();
}