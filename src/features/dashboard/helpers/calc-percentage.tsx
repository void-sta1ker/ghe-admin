export default function calcPercentage(
  numerator: number,
  denominator: number,
): number {
  const percentage = (numerator / denominator) * 100;

  return Number(percentage.toFixed(1));
}
