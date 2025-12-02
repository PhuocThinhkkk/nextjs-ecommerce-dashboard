export interface MetricResponse {
  title: string;
  value: string | number;
  change: string | number;
  changeType: 'up' | 'down';
  peakDay?: string;
  sparklineData: number[];
}
