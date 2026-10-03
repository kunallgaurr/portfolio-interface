import { content } from "@/content";
import { SectionLabel } from "./Chrome";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  const { contact, person } = content;
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__main">
        <SectionLabel index="05">{contact.label}</SectionLabel>
        <h2 id="contact-title" className="contact__heading" data-fit>
          {contact.heading.map((line) => (
            <span key={line} data-split="lines">
              {line}
            </span>
          ))}
        </h2>
        <p className="contact__body" data-reveal>
          {contact.body}
        </p>
        <div className="contact__actions" data-reveal>
          <a className="email" href={`mailto:${person.email}`} data-magnetic>
            <span>{person.email}</span>
            <span className="email__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <CopyEmail email={person.email} />
        </div>
      </div>

      <footer className="footer mono">
        <ul className="footer__socials">
          {contact.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="footer__note">{contact.footnote}</p>
        <p className="footer__copy">
          © {new Date().getFullYear()} {person.firstName} {person.lastName}
        </p>
        <a className="footer__top" href="#hero">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
