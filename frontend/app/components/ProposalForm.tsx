"use client"

import { useEffect, useRef, useState } from "react"

import { getCategories, getCategoryFormSchema } from "@/lib/api"
import type { ProposalInput, CategoryFormSchema } from "../../../shared/models"

interface ProposalFormProps {
  proposal: ProposalInput
  onProposalChange: (proposal: ProposalInput) => void
}

export default function ProposalForm({ proposal, onProposalChange }: ProposalFormProps) {
  const [categories, setCategories] = useState<Array<{ value: number; label: string }>>([])
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [formSchema, setFormSchema] = useState<CategoryFormSchema | null>(null)

  const prevCategoryIdRef = useRef<number | undefined>(proposal.categoryId)
  const proposalRef = useRef<ProposalInput>(proposal)

  useEffect(() => {
    let mounted = true

    getCategories()
      .then((res) => {
        if (!mounted) return
        setCategories(res.data.map((c) => ({ value: c.id, label: c.labels?.it ?? c.code })))
      })
      .catch((err) => {
        console.error(err)
        if (mounted) setCategoriesError("Impossibile caricare le categorie")
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    proposalRef.current = proposal
  }, [proposal])

  useEffect(() => {
    let mounted = true

    const prevCategoryId = prevCategoryIdRef.current
    const categoryChanged = prevCategoryId !== proposal.categoryId

    if (!proposal.categoryId) {
      setTimeout(() => {
        if (!mounted) return
        setFormSchema(null)
        if (categoryChanged && proposalRef.current.additionalData && Object.keys(proposalRef.current.additionalData).length > 0) {
          onProposalChange({ ...proposalRef.current, additionalData: {} })
        }
      }, 0)
      prevCategoryIdRef.current = proposal.categoryId
      return
    }

    // Only clear additionalData if the category is changed by the user,
    // not on the initial load.
    if (categoryChanged &&  prevCategoryId !== undefined && proposalRef.current.additionalData && Object.keys(proposalRef.current.additionalData).length > 0) {
      setTimeout(() => onProposalChange({ ...proposalRef.current, additionalData: {} }), 0)
    }

    getCategoryFormSchema(proposal.categoryId)
      .then((res) => {
        if (!mounted) return
        setFormSchema(res.data)
      })
      .catch((err) => {
        console.error(err)
        if (mounted) setFormSchema(null)
      })

    prevCategoryIdRef.current = proposal.categoryId

    return () => {
      mounted = false
    }
  }, [proposal.categoryId, onProposalChange])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target
    onProposalChange({
      ...proposal,
      [id]: id === "categoryId" ? Number(value) : value,
    })
  }

  const handleAdditionalDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    let value: unknown

    if (type === "checkbox") {
      value = (e.target as HTMLInputElement).checked
    } else if ((e.target as HTMLSelectElement).multiple) {
      const options = Array.from((e.target as HTMLSelectElement).options)
      const selected = options.filter((o) => o.selected).map((o) => o.value)
      value = selected.length === 0 ? undefined : selected
    } else {
      value = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value
    }

    // coerce value based on form schema (numbers, dates, selects, multiselects)
    const fieldDef = formSchema?.find((f) => f.key === id)
    if (fieldDef?.kind === "number") {
      if (value === "" || value === undefined) value = undefined
      else {
        const num = Number(value as unknown)
        value = Number.isNaN(num) ? undefined : num
      }
    } else if (fieldDef?.kind === "date") {
      if (value === "") value = undefined
    } else if (fieldDef?.kind === "select") {
      if (value === "") value = undefined
    } else if (fieldDef?.kind === "multiselect") {
      if (!Array.isArray(value)) {
        value = value ? [String(value)] : undefined
      }
    }

    onProposalChange({
      ...proposal,
      additionalData: {
        ...(proposal.additionalData ?? {}),
        [id]: value,
      },
    })
  }

  if (categoriesError)
    return <div className="alert alert-danger my-3">{categoriesError}</div>

  return (
    <form>
      <div className="mb-4">
        <label htmlFor="title" className="form-label fw-bold">
          Titolo
        </label>
        <input
          type="text"
          className="form-control bg-light"
          id="title"
          placeholder="Titolo della proposta..."
          value={proposal.title || ""}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="form-label fw-bold">
          Descrizione
        </label>
        <textarea
          className="form-control bg-light"
          id="description"
          rows={8}
          placeholder="Descrivi la tua proposta in dettaglio..."
          value={proposal.description || ""}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="categoryId" className="form-label fw-bold">
          Categoria
        </label>
        <select
          className="form-select bg-light"
          id="categoryId"
          value={proposal.categoryId ?? ""}
          onChange={handleChange}
        >
          {proposal.categoryId == null && (
            <option value="">Seleziona...</option>
          )}
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {formSchema && formSchema.length > 0 && (
          <div className="my-4 p-3 border rounded">
            <p className="fw-bold">Dettagli aggiuntivi richiesti per la categoria</p>
            {formSchema.map((field) => {
              let fieldElement: React.ReactNode
              switch (field.kind) {
                case "text":
                  fieldElement = (
                    <textarea
                      id={field.key}
                      className="form-control bg-light"
                      value={String(proposal.additionalData?.[field.key] ?? "")}
                      onChange={handleAdditionalDataChange}
                      required={field.required}
                      rows={5}
                    />
                  )
                  break
                case "number":
                  fieldElement = (
                    <input
                      id={field.key}
                      type="number"
                      className="form-control bg-light"
                      value={proposal.additionalData?.[field.key] === undefined ? "" : String(proposal.additionalData?.[field.key])}
                      onChange={handleAdditionalDataChange}
                      required={field.required}
                    />
                  )
                  break
                case "date":
                  fieldElement = (
                    <input
                      id={field.key}
                      type="date"
                      className="form-control bg-light"
                      value={String(proposal.additionalData?.[field.key] ?? "")}
                      onChange={handleAdditionalDataChange}
                      required={field.required}
                    />
                  )
                  break
                case "boolean":
                  fieldElement = (
                    <div className="form-check">
                      <input
                        id={field.key}
                        type="checkbox"
                        className="form-check-input"
                        checked={!!proposal.additionalData?.[field.key]}
                        onChange={handleAdditionalDataChange}
                      />
                    </div>
                  )
                  break
                case "select":
                  fieldElement = (
                    <select
                      id={field.key}
                      className="form-select bg-light"
                      value={String(proposal.additionalData?.[field.key] ?? "")}
                      onChange={handleAdditionalDataChange}
                      required={field.required}
                    >
                      <option value="" disabled>
                        Seleziona...
                      </option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label.it}
                        </option>
                      ))}
                    </select>
                  )
                  break
                case "multiselect":
                  fieldElement = (
                    <select
                      id={field.key}
                      multiple
                      className="form-select bg-light"
                      value={Array.isArray(proposal.additionalData?.[field.key]) ? (proposal.additionalData?.[field.key] as string[]) : []}
                      onChange={handleAdditionalDataChange}
                      required={field.required}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label.it}
                        </option>
                      ))}
                    </select>
                  )
                  break
                default:
                  fieldElement = (
                    <p className="form-text text-muted">
                      Campo di tipo &quot;{field.kind}&quot; non ancora supportato.
                    </p>
                  )
              }
              return (
                <div className="mb-3" key={field.key}>
                  <label htmlFor={field.key} className="form-label">
                    {field.label.it ?? field.key}
                    {field.required && <span className="text-danger">*</span>}
                  </label>
                  {fieldElement}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </form>
  )
}
