defmodule ReaderWeb.EntryControllerTest do
  use ReaderWeb.ConnCase

  alias Reader.Feeds
  alias Reader.Feeds.Entry

  @create_attrs %{content: "some content", hash: "some hash", published_at: "some published_at", title: "some title", url: "some url"}
  @update_attrs %{content: "some updated content", hash: "some updated hash", published_at: "some updated published_at", title: "some updated title", url: "some updated url"}
  @invalid_attrs %{content: nil, hash: nil, published_at: nil, title: nil, url: nil}

  def fixture(:entry) do
    {:ok, entry} = Feeds.create_entry(@create_attrs)
    entry
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all entries", %{conn: conn} do
      conn = get conn, entry_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create entry" do
    test "renders entry when data is valid", %{conn: conn} do
      conn = post conn, entry_path(conn, :create), entry: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, entry_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "content" => "some content",
        "hash" => "some hash",
        "published_at" => "some published_at",
        "title" => "some title",
        "url" => "some url"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, entry_path(conn, :create), entry: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update entry" do
    setup [:create_entry]

    test "renders entry when data is valid", %{conn: conn, entry: %Entry{id: id} = entry} do
      conn = put conn, entry_path(conn, :update, entry), entry: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, entry_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "content" => "some updated content",
        "hash" => "some updated hash",
        "published_at" => "some updated published_at",
        "title" => "some updated title",
        "url" => "some updated url"}
    end

    test "renders errors when data is invalid", %{conn: conn, entry: entry} do
      conn = put conn, entry_path(conn, :update, entry), entry: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete entry" do
    setup [:create_entry]

    test "deletes chosen entry", %{conn: conn, entry: entry} do
      conn = delete conn, entry_path(conn, :delete, entry)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, entry_path(conn, :show, entry)
      end
    end
  end

  defp create_entry(_) do
    entry = fixture(:entry)
    {:ok, entry: entry}
  end
end
