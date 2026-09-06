import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="soft-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 text-3xl font-serif text-ink">{value}</p>
        </div>
        <div className="rounded-full bg-parchment p-3 border border-hairline">
          <Icon className="h-6 w-6 text-amber-light" />
        </div>
      </div>
      {description && (
        <p className="mt-4 text-sm text-muted">{description}</p>
      )}
    </div>
  );
}
