use Mix.Config

config :reader, ReaderWeb.Endpoint,
  load_from_system_env: true,
  url: [host: "api.reader.uy", port: "${PORT}"],
  secret_key_base: "${SECRET_KEY_BASE}",
  server: true,
  check_origin: ["https://reader.uy", "https://beta.reader.uy"]

# Do not print debug messages in production
config :logger, level: :info

config :phoenix, :serve_endpoints, true

# Configure your database
config :reader, Reader.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "${DB_USERNAME}",
  password: "${DB_PASSWORD}",
  database: "${DB_DATABASE}",
  hostname: "${DB_HOSTNAME}",
  pool_size: 20

# Configures Google integration
config :reader, :google,
  client_id: "${GOOGLE_CLIENT_ID}",
  client_secret: "${GOOGLE_CLIENT_SECRET}"

# Configures Facebook integration
config :reader, :facebook,
  app_id: "${FACEBOOK_APP_ID}",
  app_secret: "${FACEBOOK_APP_SECRET}"

# Configures Sentry error reporting
config :sentry,
  dsn: "${SENTRY_DSN}"
