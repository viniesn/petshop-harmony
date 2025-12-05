import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  borderColor?: string;
}

export function StatsCard({ title, value, icon, trend, borderColor = 'border-l-primary' }: StatsCardProps) {
  return (
    <Card className={cn('animate-slide-up border-l-4', borderColor)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p
                className={cn(
                  'mt-2 text-xs font-medium',
                  trend.isPositive ? 'text-primary' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% este mês
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
