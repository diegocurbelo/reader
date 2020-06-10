defmodule ReaderWeb.FeedControllerTest do
  use ReaderWeb.ConnCase

  alias Reader.Feeds
  alias Reader.Feeds.Feed

  @create_attrs %{description: "some description", feed_url: "some feed_url", last_modified: "some last_modified", site_url: "some site_url", title: "some title"}
  @update_attrs %{description: "some updated description", feed_url: "some updated feed_url", last_modified: "some updated last_modified", site_url: "some updated site_url", title: "some updated title"}
  @invalid_attrs %{description: nil, feed_url: nil, last_modified: nil, site_url: nil, title: nil}

  def fixture(:feed) do
    {:ok, feed} = Feeds.create_feed(@create_attrs)
    feed
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all feeds", %{conn: conn} do
      conn = get conn, feed_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create feed" do
    test "renders feed when data is valid", %{conn: conn} do
      conn = post conn, feed_path(conn, :create), feed: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, feed_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "description" => "some description",
        "feed_url" => "some feed_url",
        "last_modified" => "some last_modified",
        "site_url" => "some site_url",
        "title" => "some title"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, feed_path(conn, :create), feed: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update feed" do
    setup [:create_feed]

    test "renders feed when data is valid", %{conn: conn, feed: %Feed{id: id} = feed} do
      conn = put conn, feed_path(conn, :update, feed), feed: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, feed_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "description" => "some updated description",
        "feed_url" => "some updated feed_url",
        "last_modified" => "some updated last_modified",
        "site_url" => "some updated site_url",
        "title" => "some updated title"}
    end

    test "renders errors when data is invalid", %{conn: conn, feed: feed} do
      conn = put conn, feed_path(conn, :update, feed), feed: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete feed" do
    setup [:create_feed]

    test "deletes chosen feed", %{conn: conn, feed: feed} do
      conn = delete conn, feed_path(conn, :delete, feed)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, feed_path(conn, :show, feed)
      end
    end
  end

  defp create_feed(_) do
    feed = fixture(:feed)
    {:ok, feed: feed}
  end
end
