import { content } from "@/content";

/** Small label that opens every section: an index and a name. */
export function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <p className="section-label mono" data-reveal>
      <span className="section-label__index">{index}</span>
      <span>{children}</span>
    </p>
  );
}

export function Header() {
  const { person, nav } = content;
  return (
    <header className="site-header">
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <a
        className="logo"
        href="#hero"
        aria-label={`${person.firstName} ${person.lastName}, back to top`}
        data-magnetic
      >
        {person.monogram}
      </a>
      <nav aria-label="Primary">
        <ul className="nav mono">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} data-nav>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** Scroll progress and the current section, fixed at the screen edges. */
export function Hud() {
  return (
    <div className="hud" aria-hidden="true">
      <div className="hud__bar">
        <i data-progress />
      </div>
      <p className="hud__section mono">
        <span data-section-index>01</span>
        <span className="hud__total">/ 06</span>
        <span data-section-name>Intro</span>
      </p>
    </div>
  );
}
