import { Brain } from "lucide-react";
import { Switch } from "@/shared/ui/Switch";

interface ThinkingToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function ThinkingToggle({ enabled, onChange }: ThinkingToggleProps) {
  return <Switch checked={enabled} onChange={onChange} label="حالت تفکر" icon={<Brain aria-hidden className="size-3.5" />} />;
}
