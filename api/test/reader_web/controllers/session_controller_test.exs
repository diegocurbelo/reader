defmodule ReaderWeb.SessionControllerTest do
  use ReaderWeb.ConnCase

  alias Reader.Accounts
  alias Reader.Accounts.Session

  @create_attrs %{access_token: "some access_token"}
  @update_attrs %{access_token: "some updated access_token"}
  @invalid_attrs %{access_token: nil}

  def fixture(:session) do
    {:ok, session} = Accounts.create_session(@create_attrs)
    session
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all sessions", %{conn: conn} do
      conn = get conn, session_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create session" do
    test "renders session when data is valid", %{conn: conn} do
      conn = post conn, session_path(conn, :create), session: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, session_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "access_token" => "some access_token"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, session_path(conn, :create), session: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update session" do
    setup [:create_session]

    test "renders session when data is valid", %{conn: conn, session: %Session{id: id} = session} do
      conn = put conn, session_path(conn, :update, session), session: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, session_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "access_token" => "some updated access_token"}
    end

    test "renders errors when data is invalid", %{conn: conn, session: session} do
      conn = put conn, session_path(conn, :update, session), session: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete session" do
    setup [:create_session]

    test "deletes chosen session", %{conn: conn, session: session} do
      conn = delete conn, session_path(conn, :delete, session)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, session_path(conn, :show, session)
      end
    end
  end

  defp create_session(_) do
    session = fixture(:session)
    {:ok, session: session}
  end
end
