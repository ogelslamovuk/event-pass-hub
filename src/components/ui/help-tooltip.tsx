import { CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type HelpTooltipProps = {
  text: string;
};

export default function HelpTooltip({ text }: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Подсказка"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[rgba(245,247,250,0.7)] hover:text-[rgba(245,247,250,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(242,201,76,0.6)]"
        >
          <CircleHelp size={14} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
