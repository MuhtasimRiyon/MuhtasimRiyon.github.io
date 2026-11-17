# Muhtasim portfolio — XAMPP and Docker

The existing website stays in its original location. Both runtimes serve the
same `index.html`, `portfolio-details.html`, `assets/`, and `forms/` files.
No database, Composer installation, Node build, or file migration is required.

```text
index.html
portfolio-details.html
assets/
forms/
Dockerfile                 # PHP + Apache image
compose.yaml               # Local Docker service
docker/apache.conf         # Apache configuration inside Docker
scripts/docker.sh          # Compose helper, similar to SynCode
.env.docker.example        # Optional Docker port setting
```

## XAMPP

1. Keep this folder in XAMPP's `htdocs` directory.
2. Start Apache from XAMPP. MySQL is not required.
3. Open <http://localhost/MuhtasimRiyon.github.io/>.

If XAMPP uses a different Apache port, include that port in the URL.
Docker is not required for this mode. No XAMPP configuration changes are needed.

## Docker

Install and start Docker Desktop (or Docker Engine with Compose 2.32 or newer).
From this project directory, run:

```sh
sh scripts/docker.sh dev
```

Open <http://localhost:8081/>. Port 8081 keeps this project separate from
SynCode's default Docker port 8080 and XAMPP's default Apache port 80,
so both projects and XAMPP can run at the same time.

Keep this terminal running while editing. Compose Watch automatically syncs
HTML pages in the project root and files inside `assets/` and `forms/`, including
new files and deletions. Save, then refresh your browser; no manual rebuild is
needed. Browser refresh is manual, not automatic live reload. Dockerfile or
Apache configuration changes trigger an automatic rebuild.

Start `sh scripts/docker.sh dev` once per development session. Press Ctrl+C to
stop. Starting only the container from Docker Desktop does not start the watcher.
If adding a new root directory or a root file other than HTML, include it in
`.dockerignore` and `Dockerfile` so both image builds and Watch include it.

For another port, copy the example and edit `DOCKER_APP_PORT`, then run the
start command again:

```sh
cp .env.docker.example .env.docker
```

`.env.docker` is optional and ignored by Git. The helper reads it automatically.
Without it, `DOCKER_APP_PORT` may also be set in the shell. When using Compose
directly with this file, pass `--env-file .env.docker`.

```sh
sh scripts/docker.sh ps
sh scripts/docker.sh logs -f app
sh scripts/docker.sh down
```

The helper accepts normal Compose commands. Without custom settings, the
equivalent development command is `docker compose up --watch`.
Docker copies the website into its image, so Docker Desktop file sharing is
not required for the XAMPP folder. Watch syncs edits into the running container.
For a background snapshot without auto sync, use
`sh scripts/docker.sh up -d --build`; rerun that command to refresh the snapshot.
XAMPP serves the files directly, so host edits appear there immediately.
The image can also run without Compose:

```sh
docker build -t muhtasim-portfolio .
docker run --rm -p 127.0.0.1:8082:80 muhtasim-portfolio
```

## Existing hosting and contact form

GitHub Pages can still serve the static website. The existing `.cpanel.yml`
deployment continues to copy only the website files; no deployment changes
are required.

`forms/contact.php` runs through PHP on XAMPP and Docker. Sending email still
requires the existing PHP Email Form library
(`assets/vendor/php-email-form/php-email-form.php`, currently absent), a real
recipient instead of `contact@example.com`, and working mail/SMTP settings.
The contact section is currently commented out in `index.html`. This setup
does not enable or change the contact form. GitHub Pages cannot execute PHP.
