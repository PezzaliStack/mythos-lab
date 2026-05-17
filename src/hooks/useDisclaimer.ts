import { useCallback, useState } from 'react';

const KEY = 'mythos_disclaimer_accepted';

export function useDisclaimer() {
  const [accepted, setAccepted] = useState<boolean>(
    () => localStorage.getItem(KEY) === 'true',
  );
  const [open, setOpen] = useState<boolean>(
    () => localStorage.getItem(KEY) !== 'true',
  );

  const accept = useCallback(() => {
    localStorage.setItem(KEY, 'true');
    setAccepted(true);
    setOpen(false);
  }, []);

  // Reopen via the "Informazioni legali" footer button.
  const reopen = useCallback(() => setOpen(true), []);

  // Closing only allowed when already accepted (footer re-view case).
  const close = useCallback(() => {
    if (localStorage.getItem(KEY) === 'true') setOpen(false);
  }, []);

  return { accepted, open, accept, reopen, close };
}
