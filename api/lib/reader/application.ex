defmodule Reader.Application do
  use Application

  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the Ecto repository
      supervisor(Reader.Repo, []),
      # Start the endpoint when the application starts
      supervisor(ReaderWeb.Endpoint, []),
      # Start your own worker by calling: Reader.Worker.start_link(arg1, arg2, arg3)
      # worker(Reader.Worker, [arg1, arg2, arg3]),
      worker(Updater, []),
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Reader.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ReaderWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
