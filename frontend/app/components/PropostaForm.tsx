'use client'

interface PropostaFormProps {
    initialData?: {
        titolo: string
        descrizione: string
        categoria: string
    }
}

export default function PropostaForm({ initialData }: PropostaFormProps) {
    const categories = [
        { value: "mobilita", label: "Mobilità" },
        { value: "verde", label: "Verde Urbano" },
        { value: "sicurezza", label: "Sicurezza" },
        { value: "altro", label: "Altro" },
    ]

    return (
        <form>
            <div className="mb-4">
                <label htmlFor="titolo" className="form-label fw-bold">Titolo</label>
                <input
                    type="text"
                    className="form-control bg-light"
                    id="titolo"
                    placeholder=""
                    defaultValue={initialData?.titolo || ''}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="descrizione" className="form-label fw-bold">Descrizione</label>
                <textarea
                    className="form-control bg-light"
                    id="descrizione"
                    rows={8}
                    defaultValue={initialData?.descrizione || ''}
                ></textarea>
            </div>

            <div className="mb-4">
                <label htmlFor="categoria" className="form-label fw-bold">Categoria</label>
                <select
                    className="form-select bg-light"
                    id="categoria"
                    defaultValue={initialData?.categoria || ''}
                >
                    <option value="" disabled>Seleziona Categoria</option>
                    {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    )
}
