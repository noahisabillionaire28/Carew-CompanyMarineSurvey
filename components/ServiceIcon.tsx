import {
  ShieldCheck,
  ClipboardCheck,
  ArrowDownToLine,
  Repeat,
  ArrowUpFromLine,
  Gauge,
  SearchCheck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconName } from "@/data/services";

const icons: Record<ServiceIconName, LucideIcon> = {
  ShieldCheck,
  ClipboardCheck,
  ArrowDownToLine,
  Repeat,
  ArrowUpFromLine,
  Gauge,
  SearchCheck,
  Warehouse,
};

export default function ServiceIcon({
  name,
  size = 24,
}: {
  name: ServiceIconName;
  size?: number;
}) {
  const Icon = icons[name];
  return <Icon size={size} aria-hidden="true" />;
}
