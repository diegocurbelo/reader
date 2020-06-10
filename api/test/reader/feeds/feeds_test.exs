defmodule Reader.FeedsTest do
  use Reader.DataCase

  alias Reader.Feeds

  describe "feeds" do
    alias Reader.Feeds.Feed

    @valid_attrs %{description: "some description", feed_url: "some feed_url", last_modified: "some last_modified", site_url: "some site_url", title: "some title"}
    @update_attrs %{description: "some updated description", feed_url: "some updated feed_url", last_modified: "some updated last_modified", site_url: "some updated site_url", title: "some updated title"}
    @invalid_attrs %{description: nil, feed_url: nil, last_modified: nil, site_url: nil, title: nil}

    def feed_fixture(attrs \\ %{}) do
      {:ok, feed} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Feeds.create_feed()

      feed
    end

    test "list_feeds/0 returns all feeds" do
      feed = feed_fixture()
      assert Feeds.list_feeds() == [feed]
    end

    test "get_feed!/1 returns the feed with given id" do
      feed = feed_fixture()
      assert Feeds.get_feed!(feed.id) == feed
    end

    test "create_feed/1 with valid data creates a feed" do
      assert {:ok, %Feed{} = feed} = Feeds.create_feed(@valid_attrs)
      assert feed.description == "some description"
      assert feed.feed_url == "some feed_url"
      assert feed.last_modified == "some last_modified"
      assert feed.site_url == "some site_url"
      assert feed.title == "some title"
    end

    test "create_feed/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Feeds.create_feed(@invalid_attrs)
    end

    test "update_feed/2 with valid data updates the feed" do
      feed = feed_fixture()
      assert {:ok, feed} = Feeds.update_feed(feed, @update_attrs)
      assert %Feed{} = feed
      assert feed.description == "some updated description"
      assert feed.feed_url == "some updated feed_url"
      assert feed.last_modified == "some updated last_modified"
      assert feed.site_url == "some updated site_url"
      assert feed.title == "some updated title"
    end

    test "update_feed/2 with invalid data returns error changeset" do
      feed = feed_fixture()
      assert {:error, %Ecto.Changeset{}} = Feeds.update_feed(feed, @invalid_attrs)
      assert feed == Feeds.get_feed!(feed.id)
    end

    test "delete_feed/1 deletes the feed" do
      feed = feed_fixture()
      assert {:ok, %Feed{}} = Feeds.delete_feed(feed)
      assert_raise Ecto.NoResultsError, fn -> Feeds.get_feed!(feed.id) end
    end

    test "change_feed/1 returns a feed changeset" do
      feed = feed_fixture()
      assert %Ecto.Changeset{} = Feeds.change_feed(feed)
    end
  end

  describe "entries" do
    alias Reader.Feeds.Entry

    @valid_attrs %{content: "some content", hash: "some hash", published_at: "some published_at", title: "some title", url: "some url"}
    @update_attrs %{content: "some updated content", hash: "some updated hash", published_at: "some updated published_at", title: "some updated title", url: "some updated url"}
    @invalid_attrs %{content: nil, hash: nil, published_at: nil, title: nil, url: nil}

    def entry_fixture(attrs \\ %{}) do
      {:ok, entry} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Feeds.create_entry()

      entry
    end

    test "list_entries/0 returns all entries" do
      entry = entry_fixture()
      assert Feeds.list_entries() == [entry]
    end

    test "get_entry!/1 returns the entry with given id" do
      entry = entry_fixture()
      assert Feeds.get_entry!(entry.id) == entry
    end

    test "create_entry/1 with valid data creates a entry" do
      assert {:ok, %Entry{} = entry} = Feeds.create_entry(@valid_attrs)
      assert entry.content == "some content"
      assert entry.hash == "some hash"
      assert entry.published_at == "some published_at"
      assert entry.title == "some title"
      assert entry.url == "some url"
    end

    test "create_entry/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Feeds.create_entry(@invalid_attrs)
    end

    test "update_entry/2 with valid data updates the entry" do
      entry = entry_fixture()
      assert {:ok, entry} = Feeds.update_entry(entry, @update_attrs)
      assert %Entry{} = entry
      assert entry.content == "some updated content"
      assert entry.hash == "some updated hash"
      assert entry.published_at == "some updated published_at"
      assert entry.title == "some updated title"
      assert entry.url == "some updated url"
    end

    test "update_entry/2 with invalid data returns error changeset" do
      entry = entry_fixture()
      assert {:error, %Ecto.Changeset{}} = Feeds.update_entry(entry, @invalid_attrs)
      assert entry == Feeds.get_entry!(entry.id)
    end

    test "delete_entry/1 deletes the entry" do
      entry = entry_fixture()
      assert {:ok, %Entry{}} = Feeds.delete_entry(entry)
      assert_raise Ecto.NoResultsError, fn -> Feeds.get_entry!(entry.id) end
    end

    test "change_entry/1 returns a entry changeset" do
      entry = entry_fixture()
      assert %Ecto.Changeset{} = Feeds.change_entry(entry)
    end
  end
end
