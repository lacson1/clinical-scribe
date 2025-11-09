# Clinical Scribe Frontend

This repository contains a lightweight, dependency-free prototype UI for the Clinical Scribe experience. The page is implemented with vanilla HTML, CSS, and JavaScript so it can run in constrained environments without access to external package registries.

## Getting started

1. Ensure you have Python 3.9+ available in your shell.
2. From the repository root, start a local static server:

   ```bash
   python -m http.server 4173 --directory frontend
   ```

3. Open the application in your browser at <http://localhost:4173>.

The interface simulates a structured note-taking flow with a visit timeline, SOAP summary, live transcription stream, and controls for adding clinician notes. Use the **New session** button to trigger a demo capture and **Clear transcript** to reset the live feed.

## Development notes

- The UI is intentionally self-contained. Feel free to replace it with a framework-based build (React, Vue, etc.) if your environment allows installing npm dependencies.
- Styles are authored in `frontend/styles.css`, and behaviour lives in `frontend/app.js`.
- All timestamps use the browser locale via `Intl.DateTimeFormat`.

## Project structure

```
frontend/
├── app.js        # Client-side interactivity (session simulation, timeline updates, tabs)
├── index.html    # Base markup and layout scaffolding
└── styles.css    # Tailored styling for the Clinical Scribe experience
```

