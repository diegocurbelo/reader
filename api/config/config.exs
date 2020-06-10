# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :reader,
  ecto_repos: [Reader.Repo]

# Configures the endpoint
config :reader, ReaderWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "qJRroEfGMFk81ihSRdwrhdiIoVFP+oaegf8t+htPtG2uLvk7qpukmwNpNuUesodq",
  render_errors: [view: ReaderWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: Reader.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :cors_plug,
  origin: ["https://reader.uy", "https://beta.reader.uy"],
  methods: ["POST"]

# Configures Facebook integration
config :reader, :facebook,
  graph_url: "https://graph.facebook.com/v2.11",
  redirect_uri: "https://reader.uy/login"

  config :sentry,
    dsn: "https://public:secret@sentry.io/1",
    environment_name: Mix.env,
    enable_source_code_context: true,
    root_source_code_path: File.cwd!,
    tags: %{env: "production"},
    included_environments: [:prod]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
