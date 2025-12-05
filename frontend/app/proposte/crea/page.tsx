'use client';

import Breadcrumb from '../../components/Breadcrumb';
import PropostaForm from '../../components/PropostaForm';

export default function CreaProposta() {
  return (
    <div className="container my-4">
      <Breadcrumb customLabels={{ crea: 'Crea Proposta' }} />
      
      <h1 className="mb-4 fw-bold">Crea Proposta</h1>

      <div className="card shadow-sm p-4 border-0">
        <PropostaForm />
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
