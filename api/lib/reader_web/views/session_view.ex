defmodule ReaderWeb.SessionView do
  use ReaderWeb, :view
  alias ReaderWeb.SessionView

  def render("index.json", %{sessions: sessions}) do
    %{data: render_many(sessions, SessionView, "session.json")}
  end

  def render("show.json", %{session: session}) do
    %{data: render_one(session, SessionView, "session.json")}
  end

  def render("session.json", %{token: token, user: user}) do
    %{token: token,
      user: %{id: user.id,
              name: user.name,
              facebookId: user.facebook_id}}
  end

end
