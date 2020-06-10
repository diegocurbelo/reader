defmodule ReaderWeb.UserChannel do
  use ReaderWeb, :channel

  alias Reader.Feeds
  alias ReaderWeb.FeedsHelper

  def join("user:" <> user_id, _payload, socket) do
    if authorized?(user_id, socket) do
      feeds = Feeds.list_feeds(user_id)
      payload = %{event: "feeds", feeds: feeds}
      {:ok, payload, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # -- 

  # List user feeds, with unread entries count
  def handle_in("feeds", _, socket) do
    feeds = Feeds.list_feeds(socket.assigns[:user_id])
    payload = %{event: "feeds", feeds: feeds}
    {:reply, {:ok, payload}, socket}
  end

  # 
  def handle_in("add_feed", payload = %{"feedUrl" => feed_url}, socket) do
    feed = FeedsHelper.add_feed(socket.assigns[:user_id], feed_url)
    feed = Map.drop(feed, [:__meta__, :__struct__, :inserted_at, :updated_at])
    {:reply, {:ok, %{event: "add_feed", params: payload, data: feed}}, socket}
  end

  #
  def handle_in("import_feed", payload = %{"feed_url" => feed_url}, socket) do
    feed = FeedsHelper.add_feed(socket.assigns[:user_id], feed_url)
    feed = Map.drop(feed, [:__meta__, :__struct__, :inserted_at, :updated_at])
    {:reply, {:ok, %{event: "import_feed", params: payload, data: feed}}, socket}
  end

  # 
  def handle_in("remove_feed", payload = %{"feedId" => feed_id}, socket) do
    FeedsHelper.remove_feed(socket.assigns[:user_id], feed_id)
    {:reply, {:ok, %{event: "remove_feed", params: payload, data: nil}}, socket}
  end

  # List feeds first 10 unread entries
  def handle_in("entries", %{"feedId" => feed_id}, socket) do
    entries = Feeds.list_entries(socket.assigns[:user_id], feed_id)
    payload = %{event: "entries", entries: entries}
    {:reply, {:ok, payload}, socket}
  end

  # Mark an enrey as read
  def handle_in("read_entry", %{"feedId" => feed_id, "entryId" => entry_id}, socket) do
    user_id = socket.assigns[:user_id]
    Feeds.read_entry(user_id, feed_id, entry_id)
    entries = Feeds.list_entries(user_id, feed_id)
    payload = %{event: "read_entry", entries: entries}
    {:reply, {:ok, payload}, socket}
  end

  # Mark all entries as read except the last "keep" items
  def handle_in("catch_up", %{"feedId" => feed_id, "keep" => keep}, socket) do
    user_id = socket.assigns[:user_id]
    Feeds.catch_up(user_id, feed_id, keep)
    entries = Feeds.list_entries(user_id, feed_id)
    payload = %{event: "catch_up", entries: entries}
    {:reply, {:ok, payload}, socket}
  end

  def handle_in(_event, _payload, socket) do
    {:reply, {:error, %{reason: "invalid event"}}, socket}
  end

  # --

  # Add authorization logic here as required.
  defp authorized?(user_id, socket) do
    String.to_integer(user_id) == socket.assigns[:user_id]
  end

end
