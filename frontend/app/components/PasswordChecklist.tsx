import { theme } from "@/lib/theme"
import { CheckIcon, DotIcon } from "./AuthIcons"

interface ChecklistProps {
  criteria: {
    length: boolean
    upper: boolean
    lower: boolean
    number: boolean
  }
}

export default function PasswordChecklist({ criteria }: ChecklistProps) {
  const allMet = Object.values(criteria).every(Boolean)
  if (allMet) return null 

  return (
    <div className="mt-2 p-2 bg-light rounded border border-0">
      <RequirementItem valid={criteria.length} label="Tra 8 e 30 caratteri" />
      <RequirementItem valid={criteria.upper} label="Almeno una maiuscola" />
      <RequirementItem valid={criteria.lower} label="Almeno una minuscola" />
      <RequirementItem valid={criteria.number} label="Almeno un numero" />
    </div>
  )
}

function RequirementItem({ valid, label }: { valid: boolean; label: string }) {
  const textColor = valid ? theme.primary : "#dc3545"
  const fontWeight = valid ? "600" : "400"

  return (
    <div className="d-flex align-items-center mb-1" style={{ fontSize: '0.75rem', color: textColor, fontWeight }}>
      <div className="d-flex align-items-center justify-content-center flex-shrink-0 me-2" style={{ width: '16px', height: '16px' }}>
        {valid ? <CheckIcon /> : <DotIcon />}
      </div>
      <span>{label}</span>
    </div>
  )
}