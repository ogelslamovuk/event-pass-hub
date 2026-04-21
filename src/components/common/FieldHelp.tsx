import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FieldHelpProps {
  text: string;
  className?: string;
}

export default function FieldHelp({ text, className }: FieldHelpProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Подсказка"
          className={className || "inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[11px] text-[#F2C94C] hover:bg-white/10"}
        >
          <HelpCircle size={12} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] border-white/20 bg-[#111A24] text-[#F5F7FA]">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
