import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

interface Props {
  open: boolean;
  accepted: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const DISCLAIMER_TITLE = 'Mythos Lab — Disclaimer Legale ed Etico';

export function LegalDisclaimerModal({
  open,
  accepted,
  onAccept,
  onClose,
}: Props) {
  const [checked, setChecked] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Focus trap + block ESC. Outside click is intentionally ignored
  // (overlay has no onClick handler).
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const node = dialogRef.current;
    const focusables = () =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'button, input, [href], [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.hasAttribute('disabled'))
        : [];

    const first = focusables()[0];
    (first ?? node)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // ESC must NOT close the modal.
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === 'Tab') {
        const f = focusables();
        if (f.length === 0) return;
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = '';
      lastFocus.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="disclaimer-overlay"
      role="presentation"
      aria-hidden={false}
    >
      <div
        className="disclaimer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="disclaimer-head">
          <div className="disclaimer-icon">
            <ShieldAlert size={22} />
          </div>
          <h2 id="disclaimer-title">{DISCLAIMER_TITLE}</h2>
        </div>

        <div className="disclaimer-body">
          <p>
            Mythos Lab è una piattaforma educativa e difensiva dedicata alla
            cybersecurity, progettata esclusivamente per:
          </p>
          <ul>
            <li>formazione professionale;</li>
            <li>awareness e sicurezza informatica;</li>
            <li>analisi difensive;</li>
            <li>threat modeling;</li>
            <li>detection engineering;</li>
            <li>hardening;</li>
            <li>simulazioni controllate;</li>
            <li>penetration testing autorizzato;</li>
            <li>
              attività svolte in ambienti di laboratorio o su sistemi di
              proprietà/autorizzati.
            </li>
          </ul>
          <p>La piattaforma NON è progettata per:</p>
          <ul>
            <li>accessi non autorizzati;</li>
            <li>attività illegali;</li>
            <li>distribuzione di malware;</li>
            <li>bypass di protezioni;</li>
            <li>furto di dati o credenziali;</li>
            <li>attacchi offensivi contro sistemi reali;</li>
            <li>automazione di attività dannose.</li>
          </ul>
          <p>
            Tutti gli esempi, scenari, dimostrazioni tecniche, workflow e
            materiali presenti in Mythos Lab hanno esclusivamente finalità:
          </p>
          <ul>
            <li>educative;</li>
            <li>formative;</li>
            <li>difensive;</li>
            <li>di ricerca autorizzata;</li>
            <li>di miglioramento delle capacità di detection e mitigazione.</li>
          </ul>
          <p>
            L’utente è l’unico responsabile dell’utilizzo della piattaforma e
            delle conoscenze derivate dal suo utilizzo.
          </p>
          <p>
            L’autore Alessandro Pezzali, il progetto Mythos Lab e gli eventuali
            collaboratori:
          </p>
          <ul>
            <li>non autorizzano utilizzi illeciti;</li>
            <li>non incoraggiano attività offensive illegali;</li>
            <li>
              declinano ogni responsabilità per usi impropri, non autorizzati o
              contrari alle normative vigenti.
            </li>
          </ul>
          <p>Utilizzando Mythos Lab, l’utente dichiara di:</p>
          <ul>
            <li>
              operare esclusivamente su sistemi di proprietà o per i quali
              possiede autorizzazione esplicita;
            </li>
            <li>rispettare le normative locali e internazionali;</li>
            <li>utilizzare la piattaforma in modo etico e professionale;</li>
            <li>
              comprendere che attività di cybersecurity senza autorizzazione
              possono costituire reato.
            </li>
          </ul>
          <p className="disclaimer-philosophy">
            Mythos Lab segue una filosofia:
            <br />
            <em>
              “Comprendere le tecniche offensive per costruire difese migliori.”
            </em>
          </p>
          <p>
            Tutti i contenuti sono forniti “COSÌ COME SONO”, senza alcuna
            garanzia esplicita o implicita.
          </p>
          <p className="disclaimer-copy">
            © Alessandro Pezzali — Mythos Lab
            <br />
            Tutti i diritti riservati.
          </p>
        </div>

        <div className="disclaimer-foot">
          {accepted ? (
            <button className="btn-primary" onClick={onClose} ref={acceptRef}>
              Chiudi
            </button>
          ) : (
            <>
              <label className="disclaimer-check">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <span>
                  Dichiaro di aver letto e accettato il disclaimer.
                </span>
              </label>
              <button
                className="btn-primary"
                disabled={!checked}
                onClick={onAccept}
                ref={acceptRef}
              >
                <Lock size={16} />
                Accetto e proseguo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
