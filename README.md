# Rhizone LMS

This monorepo contains the applications and services that constitute the Rhizone
Learning Management System.

## Demo
YouTube: https://youtu.be/Qi0XeOApP6c

## Getting started

### 1. GitHub authentication

The app uses GitHub as an auth provider. Each dev must create their own GitHub
app to handle authentication.

1. Log into GitHub.
2. Go to [Settings / Developer settings](https://github.com/settings/apps).
3. Click "New OAuth App".
4. Enter the following data.
   - Application name: `Rhizone LMS (Development)`
   - Homepage URL: `http://rhi.zone-development/`
   - Application description: `Rhizone LMS (Development)`
   - Authorization callback URL:
     `http://api.rhi.zone-development/auth/github/callback`
5. Click "Register application".
6. Click "Generate a new client secret".
7. Make a copy of the `.env.example` file and name it `.env`.
   1. Paste the Client ID from GitHub as the value for `GITHUB_CLIENT_ID`.
   2. Paste the Client Secret from GitHub as the value for
      `GITHUB_CLIENT_SECRET`.

### 2. Development domain name

The development environment assumes that the domains `rhi.zone-development` and
`api.rhi.zone-development` resolve to your dev machine.

1. Open your `hosts` file for editing. You may need to do this with
   administrator privileges. On macOS and Linux, the file is at `/etc/hosts`.
   On Windows it is at `C:\Windows\System32\drivers\etc\hosts`.
2. Add the following lines to resolve the development domain names to the
   loopback address.

```
127.0.0.1 rhi.zone-development
127.0.0.1 api.rhi.zone-development
```

### 3. Docker Compose

The development environment uses Docker Compose to run all the required services
at once.

1. [Install Docker Compose](https://docs.docker.com/compose/install/). For macOS
   and Windows users, Docker Compose comes with
   [Docker Desktop](https://www.docker.com/products/docker-desktop).
2. Run `docker-compose up` to start the dev environment.
3. Once the containers have started, visit http://rhi.zone-development/ in your
   web browser to use the app.
4. When finished developing, press `CTRL + C` to stop Docker Compose.

### 4. Running the dev servers

When accessing http://rhi.zone-development/ or http://api.rhi.zone-development/, 
the Nginx configuration that Docker Compose uses first checks to see whether the
webapp or api are running on `localhost`, respectively. If they are, the
requests are forwarded to `localhost`, otherwise they're forwarded to their
Docker containers.

While working on the api, run `yarn develop` from the `./api/` directory while
`docker-compose up` is also running.

While working on the webapp, run `yarn develop` from the `./webapp/` directory
while `docker-compose up` is also running.

### 5. Rebuilding images

When working on tasks such as Nginx configuration or database migrations, or
after pulling changes to the webapp or api from GitHub, the images need to be
rebuilt before starting Docker Compose again. This can be done with either
`docker-compose build` or `docker-compose up --build`.

## Modules

### `/api`

The `/api` folder contains an [Express.js](https://expressjs.com/) server that
exposes an HTTP API that allows other applications to interact with the
database and third-party services like GitHub.

### `/db`

The `/db` folder contains scripts and migrations for the database.

### `/nginx`

The `/nginx` folder contains configuration files for Nginx for different
environments.

### `/webapp`

The `/webapp` folder contains a React app that enables user functionality and
communicates with the api.

## Hints and troubleshooting

### Use a version manager for Node

This project expects specific versions of Node and Yarn to be used. It is
recommended to install [Node Version Manager](https://github.com/nvm-sh/nvm) and
call `nvm use` from each project directory before running Node scripts.

`nvm` offers additional tips in its documentation about
[deeper shell integration](https://github.com/nvm-sh/nvm#deeper-shell-integration)
such as automatically calling `nvm use` when using the `cd` command.

### Create an alias for docker-compose

`docker-compose` takes longer to type than `dc`, so add an alias in your shell
to simplify running commands. For example, the following will add a line
aliasing `dc` to `docker-compose` in the `~/.profile` file.

```
echo 'alias dc="docker-compose"' >> ~/.profile
source ~/.profile
```

Then any `docker-compose` command would be able to be run with `dc`. For
example, `docker-compose up`, would be simply `dc up`.

### Create a global `.gitignore` file

Your operating system and IDE may create files and folders inside the project
directory. Since the project can't account for which operating systems and IDEs
its contributors use, these paths are not listed in the project's `.gitignore`
file.

To prevent these files from getting picked up by Git across your machine, create
a global `.gitignore` file. Check out
[this Gist](https://gist.github.com/subfuzion/db7f57fff2fb6998a16c) for more
info.

### Automatically fix files before committing

ESLint and Prettier can automatically fix many mistakes that will cause
automated checks to fail. It is recommended to use the preconfigured
`yarn delint` command before committing to a module that supports it.

For files that aren't reformatted by Prettier, configure your IDE to ensure
there is a newline at the end of the file on save.
