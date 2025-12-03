'use client';

import Breadcrumb from '../../components/Breadcrumb';

export default function CreaProposta() {
  const categories = [
    { value: "mobilita", label: "Mobilità" },
    { value: "verde", label: "Verde Urbano" },
    { value: "sicurezza", label: "Sicurezza" },
    { value: "altro", label: "Altro" },
  ];

  return (
    <div className="container my-4">
      <Breadcrumb customLabels={{ crea: 'Crea Proposta' }} />
      
      <h1 className="mb-4 fw-bold">Crea Proposta</h1>

      <div className="card shadow-sm p-4 border-0">
        <form>
          <div className="mb-4">
            <label htmlFor="titolo" className="form-label fw-bold">Titolo</label>
            <input type="text" className="form-control bg-light" id="titolo" placeholder="" />
          </div>

          <div className="mb-4">
            <label htmlFor="descrizione" className="form-label fw-bold">Descrizione</label>
            <textarea className="form-control bg-light" id="descrizione" rows={8}></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="categoria" className="form-label fw-bold">Categoria</label>
            <select className="form-select bg-light" id="categoria" defaultValue="">
              <option value="" disabled>Seleziona Categoria</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Allegati (opzionali)</label>
            <div>
              <button type="button" className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2">
                <svg className="icon icon-white icon-sm" aria-hidden="true">
                  <use href="/svg/sprites.svg#it-clip"></use>
                </svg>
                Carica file
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <div className="d-flex gap-3">
            <button type="button" className="btn btn-success text-white">Salva bozza</button>
            <button type="button" className="btn btn-secondary">Elimina bozza</button>
        </div>
        <button type="button" className="btn btn-primary">Pubblica proposta</button>
      </div>
    </div>
  );
}
