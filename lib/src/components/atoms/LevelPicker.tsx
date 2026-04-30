import { cn } from "../../lib/utils";

/**
 * Audience-level segmented toggle. Used by the per-page explainer to switch
 * between PI / postdoc / undergrad / public renderings of the same content.
 */
export type ExplainerLevel = "pi" | "postdoc" | "undergrad" | "public";

const LABELS: Record<ExplainerLevel, string> = {
  pi:       "PI",
  postdoc:  "Postdoc",
  undergrad:"Undergrad",
  public:   "Public",
};

export interface LevelPickerProps {
  value: ExplainerLevel;
  onChange: (level: ExplainerLevel) => void;
  className?: string;
}

export const LevelPicker = ({ value, onChange, className }: LevelPickerProps) => (
  <div className={cn("level-picker tabs tabs--segmented", className)}
       role="tablist" aria-label="Explanation level">
    {(Object.keys(LABELS) as ExplainerLevel[]).map((lvl) => (
      <button key={lvl} role="tab"
              aria-selected={lvl === value}
              onClick={() => onChange(lvl)}>
        {LABELS[lvl]}
      </button>
    ))}
  </div>
);
