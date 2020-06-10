defmodule ReaderWeb.SessionController do
  use ReaderWeb, :controller
  alias Reader.Accounts

  action_fallback ReaderWeb.FallbackController

  def create(conn, %{"google_code" => code}) do
    login(conn, :google, code)
  end
  def create(conn, %{"facebook_code" => code}) do
    login(conn, :facebook, code)
  end
  def create(conn, _) do
    conn
    |> put_status(401)
    |> render(ReaderWeb.ErrorView, "401.json")
  end

  # --

  defp login(conn, provider, code) do
    [origin_url] = conn |> get_req_header("origin")
    with {:ok, user}  <- get_user(provider, code, origin_url),
         {:ok, token} <- generate_token(conn, user) do
      conn
      |> put_status(:created)
      |> render("session.json", %{token: token, user: user})

    else
      a ->
        IO.inspect a
        conn
        |> put_status(401)
        |> render(ReaderWeb.ErrorView, "401.json")
    end
  end

  #--

  defp get_user(:google, code, uri) do
    google_api_url = "https://www.googleapis.com/oauth2/v4/token"
    client_id = Application.get_env(:reader, :google)[:client_id]
    client_secret = Application.get_env(:reader, :google)[:client_secret]

    body = "client_id=#{client_id}&client_secret=#{client_secret}&redirect_uri=#{uri}/login/google&code=#{code}&grant_type=authorization_code"

    with {:ok, %HTTPoison.Response{status_code: 200, body: body}} <- HTTPoison.post(google_api_url, body, [{"Content-type", "application/x-www-form-urlencoded"}]),
         %{"access_token" => access_token} = Poison.decode!(body),
         url = "https://people.googleapis.com/v1/people/me?personFields=metadata,names,emailAddresses,coverPhotos",
         {:ok, %HTTPoison.Response{status_code: 200, body: body}} <- HTTPoison.get(url, [{"Authorization", "Bearer #{access_token}"}]) do
      response = Poison.decode!(body)

      google_id = response["resourceName"] |> String.replace("people/", "")

      name =
        response["names"]
        |> Enum.filter(fn name -> Map.has_key?(name["metadata"], "primary") end)
        |> Enum.at(0)
        |> Access.get("displayName")

      user = Accounts.get_user_by_google_id(google_id)
      if user == nil do
        email =
          response["emailAddresses"]
          |> Enum.filter(fn email -> Map.has_key?(email["metadata"], "primary") end)
          |> Enum.at(0)
          |> Access.get("value")

        user = Accounts.get_user_by_email(email)
        if user == nil do
          Accounts.create_user(%{name: name, email: email, google_id: google_id})
        else
          Accounts.update_user(user, %{name: name, google_id: google_id})
        end
      else
        Accounts.update_user(user, %{name: name})
        {:ok, %{user | name: name}}
      end
    else
      _ ->
        {:error, "Google auth error"}
    end
  end

  defp get_user(:facebook, code, uri) do
    graph_url = Application.get_env(:reader, :facebook)[:graph_url]
    app_id = Application.get_env(:reader, :facebook)[:app_id]
    app_secret = Application.get_env(:reader, :facebook)[:app_secret]

    # Validamos el CODE enviado por el Login Dialog
    # Obtenemos los datos del usuario logueado (facebook_id, nombre y email)
    url = "#{graph_url}/oauth/access_token?client_id=#{app_id}&client_secret=#{app_secret}&redirect_uri=#{uri}/login/facebook&code=#{code}"

    with {:ok, %HTTPoison.Response{status_code: 200, body: body}} <- HTTPoison.get(url),
         %{"access_token" => access_token} = Poison.decode!(body),
         url = "#{graph_url}/me?fields=email,name,picture&access_token=#{access_token}",
         {:ok, %HTTPoison.Response{status_code: 200, body: body}} <- HTTPoison.get(url) do
      response = Poison.decode!(body)

      user = Accounts.get_user_by_facebook_id(response["id"])
      if user == nil do
        user = Accounts.get_user_by_email(response["email"])
        if user == nil do
          Accounts.create_user(%{name: response["name"], email: response["email"], facebook_id: response["id"]})
        else
          Accounts.update_user(user, %{name: response["name"], facebook_id: response["id"]})
          {:ok, user}
        end
      else
        Accounts.update_user(user, %{name: response["name"]})
        {:ok, %{user | name: response["name"]}}
      end
    else
      _ -> {:error, "Facebook auth error"}
    end
  end

  defp generate_token(conn, user) do
    {:ok, Phoenix.Token.sign(conn, "user", user.id)}
  end

end
