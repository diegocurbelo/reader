defmodule ReaderWeb.Router do
  use ReaderWeb, :router
  
  use Plug.ErrorHandler
  use Sentry.Plug

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", ReaderWeb do
    pipe_through :api

    post "/sessions", SessionController, :create
  end
end
