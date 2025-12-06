"use client";

export default function Accedi() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card card-teaser rounded shadow">
            <div className="card-body">
              <h1 className="title-xxxlarge mb-5">Accedi</h1>
              <form>
                <div className="form-group mb-5">
                  <label htmlFor="email" className="active">
                    Indirizzo email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <div className="d-flex justify-content-between align-items-baseline flex-nowrap mb-1">
                    <label htmlFor="password" className="active mb-0">
                      Password
                    </label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      required
                    />
                  </div>
                </div>
                <div className="d-grid gap-2 mt-5">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Login
                  </button>
                </div>
                <div className="text-center mt-3">
                  <a
                    href="/registrati"
                    className="text-decoration-none text-primary"
                  >
                    Non hai un account? Registrati qui!
                  </a>
                </div>
                <div className="d-flex align-items-center my-4">
                  <hr className="flex-grow-1" />
                  <span className="px-3 text-muted">Oppure</span>
                  <hr className="flex-grow-1" />
                </div>
                <div className="d-flex flex-column align-items-center gap-3">
                  <button type="button" className="btn btn-primary btn-re">
                    <svg className="icon icon-white" aria-hidden="true">
                      <use href="/svg/sprites.svg#it-user"></use>
                    </svg>
                    <span>Login with SPID</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
