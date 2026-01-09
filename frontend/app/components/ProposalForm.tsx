"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  createDraft, 
  saveDraft, 
  publishProposal, 
  updateProposal, 
  deleteProposal,
  getCategoryFormSchema 
} from "@/lib/api"
import { Proposal, CategoryRef, FormField } from "../../../shared/models"
import { buildAdditionalDataSchema } from "../../../shared/validation/forms"
import DynamicField from "./DynamicField"
import { theme } from "@/lib/theme"

interface ProposalFormProps {
  initialData?: Proposal
  categories: CategoryRef[]
}

export default function ProposalForm({ initialData, categories }: ProposalFormProps) {
  const router = useRouter()
  const isEditing = !!initialData
  const isDraft = initialData ? (initialData.status?.code === 'bozza' || !initialData.status) : true

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    categoryId: initialData?.category?.id || "", 
  })
  
  const [dynamicData, setDynamicData] = useState<Record<string, unknown>>(initialData?.additionalData || {})
  
  const [dynamicSchema, setDynamicSchema] = useState<FormField[]>([])
  const [loadingSchema, setLoadingSchema] = useState(false)
  
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const [errors, setErrors] = useState<Record<string, string>>({})   
  const [warnings, setWarnings] = useState<Record<string, string>>({}) 

  const selectedCategory = categories.find(c => String(c.id) === String(formData.categoryId));
  const activeColor = selectedCategory?.colour || theme.primary;

  useEffect(() => {
    const catId = Number(formData.categoryId)
    if (!catId) {
      setDynamicSchema([])
      return
    }
    if (initialData?.category?.id === catId && dynamicSchema.length > 0) return;

    const loadSchema = async () => {
      setLoadingSchema(true)
      try {
        const res = await getCategoryFormSchema(catId)
        const schema = Array.isArray(res) ? res : (res as { data: FormField[] }).data || []
        setDynamicSchema(schema)
        
        if (!initialData || Number(initialData.category?.id) !== catId) {
            setDynamicData({})
        } else {
            setDynamicData(initialData.additionalData || {})
        }
      } catch (err) {
        console.error("Errore schema", err)
        setDynamicSchema([])
      } finally {
        setLoadingSchema(false)
      }
    }
    loadSchema()

  }, [formData.categoryId, initialData, dynamicSchema.length])

  const handleDynamicChange = (key: string, value: unknown) => {
    setDynamicData(prev => ({ ...prev, [key]: value }))
  }

  const formatFallbackLabel = (code: string) => {
    if (!code) return "";
    return code.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const validateUI = () => {
    const newErrors: Record<string, string> = {}
    const newWarnings: Record<string, string> = {}
    let isValidDraft = true
    let isValidPublish = true

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = "Il titolo è obbligatorio (min 5 caratteri)."
      isValidDraft = false
    }
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "La descrizione è obbligatoria (min 10 caratteri)."
      isValidDraft = false
    }
    if (!formData.categoryId) {
       newErrors.categoryId = "La categoria è obbligatoria."
       isValidDraft = false
    }

    if (formData.categoryId && dynamicSchema.length > 0) {
      const looseSchema = buildAdditionalDataSchema(dynamicSchema, true)
      const looseResult = looseSchema.safeParse(dynamicData)
      
      if (!looseResult.success) {
        looseResult.error.issues.forEach(issue => {
           newErrors[String(issue.path[0])] = issue.message 
        })
        isValidDraft = false
      }

      const strictSchema = buildAdditionalDataSchema(dynamicSchema, false)
      const strictResult = strictSchema.safeParse(dynamicData)

      if (!strictResult.success) {
        strictResult.error.issues.forEach(issue => {
          const key = String(issue.path[0])
          if (!newErrors[key]) {
             newWarnings[key] = "Campo obbligatorio per la pubblicazione."
             isValidPublish = false
          }
        })
      }

      dynamicSchema.filter(f => f.kind === 'file' && f.required).forEach(f => {
         if (!dynamicData[f.key]) {
            newWarnings[f.key] = "Allegato richiesto per la pubblicazione."
            isValidPublish = false
         }
      })
    }
    
    if (!isValidDraft) isValidPublish = false

    setErrors(newErrors)
    setWarnings(newWarnings)
    return { isValidDraft, isValidPublish }
  }

  const handleAction = async (action: 'SAVE_DRAFT' | 'PUBLISH' | 'UPDATE') => {
    setErrors({})
    setWarnings({})
    
    const { isValidDraft, isValidPublish } = validateUI()

    if (!isValidDraft) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if ((action === 'PUBLISH' || action === 'UPDATE') && !isValidPublish) {
      alert("Per pubblicare devi compilare tutti i campi obbligatori (evidenziati in arancione).")
      return
    }

    try {
      setSaving(true)
      const payload = {
        title: formData.title,
        description: formData.description,
        categoryId: Number(formData.categoryId),
        additionalData: dynamicData
      }

      let targetId = initialData?.id

      if (!isEditing) {
        const draft = await createDraft(payload)
        targetId = draft.id
      } else if (targetId && isDraft) {
         await saveDraft(targetId, payload)
      }

      if (action === 'SAVE_DRAFT') {
        router.push('/profilo#mie-proposte')
        return
      }

      if (action === 'PUBLISH' && targetId) {
        await publishProposal(targetId)
        router.push('/proposte')
        return
      }

      if (action === 'UPDATE' && targetId && !isDraft) {
        await updateProposal(targetId, payload)
        router.push(`/proposte/${targetId}`)
        return
      }

    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Errore sconosciuto";
      alert("Errore salvataggio: " + message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm("Sei sicuro di voler eliminare definitivamente questa bozza?")) return

    try {
        setDeleting(true)
        await deleteProposal(initialData.id)
        router.push('/profilo')
    } catch (err) {
        const message = err instanceof Error ? err.message : "Errore sconosciuto";
        alert("Errore eliminazione: " + message)
    } finally {
        setDeleting(false)
    }
  }

  const inputClass = `form-control form-control-lg bg-off-white custom-border`;
  const selectClass = `form-select form-select-lg bg-off-white custom-border`;

  return (
    <div className="card border border-secondary-subtle shadow-sm rounded-3 p-4 p-md-5 bg-white">
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 pb-3 border-bottom">
         <div>
            <h2 className="h3 fw-bold mb-1 text-dark">
                {isEditing ? (isDraft ? "Modifica Bozza" : "Modifica Proposta") : "Crea Nuova Proposta"}
            </h2>
            <p className="text-muted small mb-0">Compila i campi sottostanti per descrivere la tua idea.</p>
         </div>
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold small text-muted text-uppercase ls-1">Titolo Proposta <span className="text-danger">*</span></label>
        <input
          type="text"
          className={`${inputClass} ${errors.title ? 'border-danger' : ''}`}
          style={errors.title ? { borderColor: 'var(--bs-danger)' } : {}}
          placeholder="Es. Riqualificazione Parco Centrale..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={saving}
        />
        {errors.title && <div className="text-danger small mt-1 fw-bold">{errors.title}</div>}
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold small text-muted text-uppercase ls-1">Categoria <span className="text-danger">*</span></label>
        <select
          className={`${selectClass} ${errors.categoryId ? 'border-danger' : ''}`}
          style={errors.categoryId ? { borderColor: 'var(--bs-danger)' } : {}}
          value={formData.categoryId}
          onChange={(e) => {
              setFormData({ ...formData, categoryId: e.target.value });
              if (String(e.target.value) !== String(initialData?.category?.id)) {
                 setDynamicData({}); 
              }
          }}
          disabled={saving}
        >
          <option value="">Seleziona una categoria...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.labels?.it || formatFallbackLabel(cat.code || "")}
            </option>
          ))}
        </select>
        {errors.categoryId && <div className="text-danger small mt-1 fw-bold">{errors.categoryId}</div>}
        <div className="form-text small mt-2">La selezione caricherà i campi specifici.</div>
      </div>

      <div className="mb-5">
        <label className="form-label fw-bold small text-muted text-uppercase ls-1">Descrizione Generale <span className="text-danger">*</span></label>
        <textarea
          className={`${inputClass} p-3 ${errors.description ? 'border-danger' : ''}`}
          style={errors.description ? { borderColor: 'var(--bs-danger)' } : {}}
          rows={5}
          placeholder="Descrivi la tua idea in modo chiaro..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={saving}
        />
        {errors.description && <div className="text-danger small mt-1 fw-bold">{errors.description}</div>}
      </div>

      {formData.categoryId && (
        <div 
          className="bg-white rounded-3 p-4 p-md-5 mb-5 shadow-sm position-relative overflow-hidden" 
          style={{ 
            border: `1px solid ${activeColor}40`,
            borderLeft: `5px solid ${activeColor}`
          }}
        >
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: activeColor }}>
             <div className="p-2 rounded-circle d-flex" style={{ backgroundColor: `${activeColor}20` }}>
                <svg className="icon icon-sm" style={{ fill: activeColor }}><use href="/svg/sprites.svg#it-list"></use></svg>
             </div>
             Dettagli {selectedCategory?.labels?.it || "Specifici"}
          </h5>
          
          {loadingSchema ? (
             <div className="text-center py-4 text-muted">Caricamento campi...</div>
          ) : dynamicSchema.length > 0 ? (
             <div className="row g-4">
               {dynamicSchema.map((field) => {
                 const isWide = ['map', 'text', 'file', 'multiselect'].includes(field.kind);
                 return (
                   <div key={field.key} className={isWide ? 'col-12' : 'col-md-6'}>
                      <DynamicField
                        field={field}
                        value={dynamicData[field.key]} 
                        onChange={(val) => handleDynamicChange(field.key, val)}
                        disabled={saving}
                        color={activeColor}
                        error={errors[field.key]} 
                        warning={warnings[field.key]}
                      />
                   </div>
                 )
               })}
             </div>
          ) : (
             <div className="alert alert-light border-0 mb-0 text-center text-muted">Nessun campo extra per questa categoria.</div>
          )}
        </div>
      )}

      <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center pt-2 border-top mt-4 pt-4">

         <div>
            {isEditing && isDraft && (
                <button 
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    className="btn btn-link text-danger text-decoration-none px-0 fw-semibold"
                >
                    {deleting ? "Eliminazione..." : "Elimina Bozza"}
                </button>
            )}
         </div>

         <div className="d-flex gap-3 align-items-center w-100 w-md-auto justify-content-end">
            <Link href={isEditing ? `/proposte/${initialData.id}` : "/proposte"} className="text-muted text-decoration-none fw-semibold px-2">
                Annulla
            </Link>
            
            {(isDraft) && (
                <button
                className="btn btn-light border fw-bold px-4 py-2 rounded-3"
                onClick={() => handleAction('SAVE_DRAFT')}
                disabled={saving}
                >
                {saving ? "..." : "Salva Bozza"}
                </button>
            )}
            
            <button
                className="btn btn-mustard fw-bold px-4 py-2 rounded-3 shadow-sm text-dark"
                onClick={() => handleAction(isDraft ? 'PUBLISH' : 'UPDATE')}
                disabled={saving}
            >
                {saving ? "..." : (isDraft ? "Pubblica Proposta" : "Salva Modifiche")}
            </button>
        </div>
      </div>

      <style jsx global>{`
        .ls-1 { letter-spacing: 0.5px; font-size: 0.75rem; }
        .btn-mustard { background-color: #E3B448; border: 1px solid #dca027; transition: all 0.2s; }
        .btn-mustard:hover { filter: brightness(0.95); transform: translateY(-1px); }

        .bg-off-white { background-color: #fafafa !important; }
        .custom-border { border: 1px solid #ced4da !important; }

        .form-control:focus, .form-select:focus {
           background-color: #ffffff !important;
           border-color: ${theme.primary} !important;
           box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }
      `}</style>
    </div>
  )
}