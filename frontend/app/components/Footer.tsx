import Link from "next/link";

export default function Footer() {
  return (
    <footer className="it-footer">
      <div className="it-footer-main">
        <div className="container">
          <section>
            <div className="row clearfix">
              <div className="col-sm-12">
                <div className="it-brand-wrapper">
                  <Link href="/">
                    <div className="it-brand-text">
                      <h2 className="no_toc">Trento Decide</h2>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
