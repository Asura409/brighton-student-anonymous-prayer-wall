# Brighton Student Society — Anonymous Prayer Wall

A calm, anonymous space for Brighton students to share prayer requests and support one another.

## Run locally

Open `dist/index.html` in a browser, or serve the repository with any static file server:

```bash
python3 -m http.server 8000 --directory dist
```

The current prototype stores new posts and reactions in the browser's local storage. A production version should connect the form to a moderated database and add server-side abuse protection.
