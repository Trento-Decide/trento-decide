import Link from "next/link";

export default function Header() {
  return (
    <header className="it-header-wrapper">
      <div className="it-header-slim-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-header-slim-wrapper-content">
                <a
                  className="d-none d-lg-block navbar-brand"
                  target="_blank"
                  rel="noopener"
                  href="https://www.comune.trento.it/"
                >
                  Comune di Trento
                </a>

                <div className="it-header-slim-right-zone" role="navigation">
                  <div className="it-access-top-wrapper">
                    <a
                      className="btn btn-primary btn-icon btn-full"
                      href="/accedi"
                      aria-label="Accedi all'area personale"
                    >
                      <span className="rounded-icon">
                        <svg
                          className="icon icon-primary"
                          role="presentation"
                          focusable="false"
                        >
                          <use href="/svg/sprites.svg#it-user"></use>
                        </svg>
                      </span>
                      <span className="d-none d-lg-block">Accedi</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="it-header-center-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-header-center-content-wrapper">
                <div className="it-brand-wrapper">
                  <Link href="/">
                    <svg className="icon">
                      <use href="/svg/sprites.svg#it-pa"></use>
                    </svg>
                    <div className="it-brand-text">
                      <div className="it-brand-title">Trento Decide</div>
                    </div>
                  </Link>
                </div>
                <div className="it-right-zone">
                  <div className="it-search-wrapper">
                    <span className="d-none d-md-block">Cerca</span>
                    <a
                      className="search-link rounded-icon"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#search-modal"
                    >
                      <svg
                        className="icon"
                        role="presentation"
                        focusable="false"
                      >
                        <use href="/svg/sprites.svg#it-search"></use>
                      </svg>
                      <span className="visually-hidden">Cerca</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="it-header-navbar-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav
                className="navbar navbar-expand-lg has-megamenu"
                aria-label="Navigazione principale"
              >
                <button
                  className="custom-navbar-toggler"
                  type="button"
                  aria-controls="nav1"
                  aria-expanded="false"
                  aria-label="Mostra/Nascondi la navigazione"
                  data-bs-toggle="navbarcollapsible"
                  data-bs-target="#nav1"
                >
                  <svg className="icon">
                    <use href="/svg/sprites.svg#it-burger"></use>
                  </svg>
                </button>
                <div className="navbar-collapsable" id="nav1">
                  <div className="overlay"></div>
                  <div className="close-div">
                    <button className="btn close-menu" type="button">
                      <span className="visually-hidden">
                        Nascondi la navigazione
                      </span>
                      <svg className="icon">
                        <use href="/svg/sprites.svg#it-close-big"></use>
                      </svg>
                    </button>
                  </div>
                  <div className="menu-wrapper">
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link className="nav-link" href="/proposte">
                          <span>Proposte</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
