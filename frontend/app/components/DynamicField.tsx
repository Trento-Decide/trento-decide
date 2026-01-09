"use client"

import dynamic from "next/dynamic"
import { FormField } from "../../../shared/models"
import { useRef } from "react"

const LeafletMap = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => <div className="bg-light rounded p-5 text-center text-muted">Caricamento mappa...</div> 
})

interface DynamicFieldProps {
  field: FormField
  value: unknown 
  onChange: (value: unknown) => void 
  disabled?: boolean
  color?: string
  error?: string | null
  warning?: string | null
}

const FeedbackMessage = ({ error, warning }: { error?: string | null, warning?: string | null }) => {
  if (error) return (
     <div className="small mt-1 text-danger fw-bold d-flex align-items-center">
        <svg className="icon icon-xs me-1 text-danger" style={{fill: 'currentColor'}}><use href="/svg/sprites.svg#it-error"></use></svg>
        {error}
     </div>
  )
  if (warning) return (
     <div className="small mt-1 fw-bold d-flex align-items-center" style={{ color: '#fd7e14' }}>
        <svg className="icon icon-xs me-1" style={{ fill: '#fd7e14' }}><use href="/svg/sprites.svg#it-warning-circle"></use></svg>
        {warning}
     </div>
  )
  return null
}

const FieldLabel = ({ text, required, htmlFor }: { text: string, required?: boolean, htmlFor: string }) => (
  <label className="form-label fw-bold small text-muted text-uppercase ls-1 mb-2 d-block" htmlFor={htmlFor}>
    {text} {required && <span className="text-danger">*</span>}
  </label>
)

const FieldHelp = ({ text, hasError }: { text: string, hasError: boolean }) => {
  if (!text || hasError) return null;
  return <div className="form-text small mt-1 text-muted">{text}</div>
}

export default function DynamicField({ 
  field, 
  value, 
  onChange, 
  disabled, 
  color = "#0d6efd",
  error,
  warning
}: DynamicFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getLabel = (local?: { [key: string]: string }) => {
    if (!local) return "";
    return local.it || local.en || Object.values(local)[0] || "";
  }

  const labelText = getLabel(field.label);
  const helpText = getLabel(field.helpText);
  const isRequired = field.required;

  const borderClass = error ? 'border-danger' : (warning ? 'border-warning' : 'custom-border');
  
  const inputClass = `form-control form-control-lg bg-off-white ${borderClass}`;
  const selectClass = `form-select form-select-lg bg-off-white ${borderClass}`;

  const activeStyle = { backgroundColor: color, borderColor: color, color: '#fff' }
  const outlineStyle = { backgroundColor: '#fff', borderColor: '#dee2e6', color: '#212529' }

  switch (field.kind) {
    case "text":
      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          <input
            id={field.key}
            type="text"
            className={inputClass}
            style={error || warning ? { borderColor: error ? 'var(--bs-danger)' : '#fd7e14' } : {}}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Inserisci testo..."
          />
          <FeedbackMessage error={error} warning={warning} />
          <FieldHelp text={helpText} hasError={!!error || !!warning} />
        </div>
      )

    case "number":
      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          <div className="input-group">
            <input
              id={field.key}
              type="number"
              className={inputClass}
              style={error || warning ? { borderColor: error ? 'var(--bs-danger)' : '#fd7e14' } : {}}
              value={(value as number) ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  onChange("");
                } else if (/^\d*(\.\d{0,2})?$/.test(val)) {
                  onChange(Number(val));
                }
              }}
              disabled={disabled}
              placeholder="0.00"
              step={field.step || "0.01"} 
            />
            {field.unit && <span className="input-group-text bg-off-white custom-border border-start-0 text-muted fw-bold">{field.unit}</span>}
          </div>
          <FeedbackMessage error={error} warning={warning} />
          <FieldHelp text={helpText} hasError={!!error || !!warning} />
        </div>
      )

    case "date":
      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          <input
            id={field.key}
            type="date"
            className={inputClass}
            style={error || warning ? { borderColor: error ? 'var(--bs-danger)' : '#fd7e14' } : {}}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
          <FeedbackMessage error={error} warning={warning} />
          <FieldHelp text={helpText} hasError={!!error || !!warning} />
        </div>
      )

    case "boolean":
      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          <div className={`d-flex gap-2 p-1 rounded ${error ? 'border border-danger' : ''}`}>
            <button
              type="button"
              className="btn flex-grow-1 fw-bold py-2"
              style={value === true ? activeStyle : outlineStyle}
              onClick={() => onChange(true)}
              disabled={disabled}
            >
              SÌ
            </button>
            <button
              type="button"
              className="btn flex-grow-1 fw-bold py-2"
              style={value === false ? { backgroundColor: '#6c757d', color: 'white', borderColor: '#6c757d' } : outlineStyle}
              onClick={() => onChange(false)}
              disabled={disabled}
            >
              NO
            </button>
          </div>
          <FeedbackMessage error={error} warning={warning} />
          <FieldHelp text={helpText} hasError={!!error || !!warning} />
        </div>
      )

    case "select":
      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          <select
            id={field.key}
            className={selectClass}
            style={error || warning ? { borderColor: error ? 'var(--bs-danger)' : '#fd7e14' } : {}}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">Seleziona un&apos;opzione...</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {getLabel(opt.label)}
              </option>
            ))}
          </select>
          <FeedbackMessage error={error} warning={warning} />
          <FieldHelp text={helpText} hasError={!!error || !!warning} />
        </div>
      )

    case "multiselect":
      const selectedValues = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          <div className={`d-flex flex-wrap gap-2 p-3 rounded-3 bg-off-white ${borderClass}`}
               style={error || warning ? { borderColor: error ? 'var(--bs-danger)' : '#fd7e14' } : {}}>
            {field.options.map((opt) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (isSelected) {
                      onChange(selectedValues.filter((v) => v !== opt.value));
                    } else {
                      onChange([...selectedValues, opt.value]);
                    }
                  }}
                  className="btn btn-sm rounded-3 px-3 py-2 fw-semibold transition-all"
                  style={isSelected ? activeStyle : { ...outlineStyle, borderStyle: 'solid' }}
                >
                  {isSelected && <span className="me-2">✓</span>}
                  {getLabel(opt.label)}
                </button>
              )
            })}
          </div>
          <FeedbackMessage error={error} warning={warning} />
          <FieldHelp text={helpText} hasError={!!error || !!warning} />
        </div>
      )

    case "map":
      const isPolygon = field.drawMode === 'polygon';
      const mapValue = value as string | null | undefined;
      
      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          <div className={`rounded overflow-hidden border ${error ? 'border-danger' : 'border-secondary-subtle'}`}>
              <LeafletMap 
                key={`${field.key}-${field.drawMode}`} 
                value={mapValue ?? ""} 
                onChange={onChange} 
                drawMode={field.drawMode || 'marker'}
              />
          </div>
          <div className="mt-2 text-muted small d-flex align-items-center gap-2">
             <svg className="icon icon-xs"><use href="/svg/sprites.svg#it-info-circle"></use></svg>
             {mapValue 
                ? (isPolygon ? "Area definita correttamente." : `Coordinate: ${mapValue}`) 
                : (isPolygon ? "Usa gli strumenti in alto a destra sulla mappa per disegnare l'area." : "Clicca sulla mappa per posizionare il marker.")
             }
          </div>
          <FeedbackMessage error={error} warning={warning} />
          <FieldHelp text={helpText} hasError={!!error || !!warning} />
        </div>
      )

    case "file":
      const fileName = value as string | null | undefined;

      return (
        <div className="mb-3">
          <FieldLabel text={labelText} required={isRequired} htmlFor={field.key} />
          
          <div 
            className={`p-4 bg-off-white rounded-3 text-center position-relative hover-shadow transition-all ${borderClass}`}
            style={{ 
                borderStyle: 'dashed !important', 
                borderWidth: '2px', 
                cursor: 'pointer',
                borderColor: error ? 'var(--bs-danger)' : (warning ? '#fd7e14' : '#ced4da') 
            }}
          >
             <div className="mb-2">
                <svg className="icon icon-lg" style={{ fill: color }}><use href="/svg/sprites.svg#it-upload"></use></svg>
             </div>
             <h6 className="fw-bold text-dark mb-1">Carica Documento</h6>
             <small className="text-muted d-block">
               {field.accept?.join(", ") || "Tutti i file"} (Max {field.maxSizeMB || 5}MB)
             </small>

             <input 
               ref={fileInputRef}
               type="file" 
               className="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
               style={{ cursor: 'pointer' }}
               accept={field.accept?.join(",")}
               multiple={field.multiple}
               disabled={disabled}
               onChange={(e) => {
                 const files = e.target.files;
                 if (files && files.length > 0) {
                   const names = Array.from(files).map(f => f.name).join(", ");
                   onChange(names);
                   if (fileInputRef.current) fileInputRef.current.value = "";
                 }
               }}
             />
          </div>
          
          <FeedbackMessage error={error} warning={warning} />

          {fileName && (
             <div className="mt-3 d-flex align-items-center justify-content-between p-3 rounded-3 border bg-white shadow-sm">
                 <div className="d-flex align-items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded bg-success bg-opacity-10 text-success">
                       <svg className="icon icon-sm"><use href="/svg/sprites.svg#it-check-circle"></use></svg>
                    </div>
                    <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                       <span className="fw-bold small text-truncate d-block">{fileName}</span>
                       <span className="x-small text-muted">Pronto per l&apos;invio</span>
                    </div>
                 </div>
                 
                 <button 
                    type="button"
                    onClick={() => onChange("")} 
                    className="btn p-0 rounded-circle d-flex align-items-center justify-content-center transition-all"
                    style={{
                        width: '32px',
                        height: '32px',
                        minWidth: '32px',
                        border: 'none',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        color: '#dc3545'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                        e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                        e.currentTarget.style.color = '#dc3545';
                    }}
                    title="Rimuovi file"
                    disabled={disabled}
                 >
                    <svg className="icon icon-sm" style={{ fill: 'currentColor' }}><use href="/svg/sprites.svg#it-close"></use></svg>
                 </button>
             </div>
          )}
        </div>
      )

    default:
      return null
  }
}