import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label, value, delta, icon: Icon, accent,
}: { label: string; value: string; delta?: string; icon: LucideIcon; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden border-border/60 ${accent ? "bg-gradient-to-br from-card to-gold-soft/40" : ""}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
              <div className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</div>
              {delta && <div className="mt-1 text-xs text-gold">{delta}</div>}
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-gold text-gold-foreground" : "bg-secondary text-foreground"}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function LevelBadge({ level, locked }: { level: string; locked?: boolean }) {
  const styles = locked
    ? "bg-muted text-muted-foreground"
    : level === "Foundation"
    ? "bg-gold-soft text-gold-foreground border-gold/30"
    : level === "Intermediate"
    ? "bg-accent text-accent-foreground border-gold/40"
    : "gradient-gold text-gold-foreground border-gold";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-muted-foreground" : "bg-gold"}`} />
      {level}
    </span>
  );
}
