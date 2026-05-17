# Detection Mapping

## Observable Indicators
- processo o comportamento inatteso
- accesso a dati locali o workflow sensibili
- interazione anomala tra browser, storage, automazioni o AI
- eventi ripetuti fuori dal normale flusso utente

## Detection Ideas
- correlare origine evento, processo chiamante e destinazione
- monitorare anomalie su storage locale, clipboard, URL, cache e webhook
- creare baseline del comportamento normale
- generare alert solo su catene coerenti, non su singoli eventi isolati

## Telemetria utile
- browser console / network
- endpoint security logs
- DNS/proxy logs
- cronologia automazioni
- accessi a storage locale
