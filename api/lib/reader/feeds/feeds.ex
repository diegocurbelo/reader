defmodule Reader.Feeds do
  @moduledoc """
  The Feeds context.
  """

  import Ecto.Query, warn: false
  alias Reader.Repo

  alias Reader.Feeds.Feed
  alias Reader.Feeds.Entry
  alias Reader.Feeds.UserFeed

  @doc """
  Returns the list of feeds.

  ## Examples

      iex> list_feeds()
      [%Feed{}, ...]

  """
  def list_feeds do
    Repo.all(Feed)
  end

  def list_feeds(user_id) do
    query =
      from f in Feed,
      join: e in Entry, where: e.feed_id == f.id,
      left_join: uf in UserFeed, where: uf.feed_id == f.id and uf.user_id == ^user_id and e.id >= uf.last_read_entry_id,
      select: [f.id, f.title, f.feed_url, f.site_url, uf.title, uf.last_read_entry_id, count(e.id)],
      group_by: [f.id, f.title, f.feed_url, f.site_url, uf.title, uf.last_read_entry_id]

    Repo.all(query)
    |> Enum.map(fn [id, title, feed_url, site_url, user_title, last_read, unread_count] ->
      %{id: id,
        title: user_title || title,
        feed_url: feed_url,
        site_url: site_url,
        unread_count: (if last_read == 0, do: unread_count, else: unread_count - 1)}
    end)
  end

  @doc """
  Gets a single feed.

  Raises `Ecto.NoResultsError` if the Feed does not exist.

  ## Examples

      iex> get_feed!(123)
      %Feed{}

      iex> get_feed!(456)
      ** (Ecto.NoResultsError)

  """
  def get_feed!(id), do: Repo.get!(Feed, id)

  @doc """
  Creates a feed.

  ## Examples

      iex> create_feed(%{field: value})
      {:ok, %Feed{}}

      iex> create_feed(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_feed(attrs \\ %{}) do
    %Feed{}
    |> Feed.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a feed.

  ## Examples

      iex> update_feed(feed, %{field: new_value})
      {:ok, %Feed{}}

      iex> update_feed(feed, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_feed(%Feed{} = feed, attrs) do
    feed
    |> Feed.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Feed.

  ## Examples

      iex> delete_feed(feed)
      {:ok, %Feed{}}

      iex> delete_feed(feed)
      {:error, %Ecto.Changeset{}}

  """
  def delete_feed(%Feed{} = feed) do
    Repo.delete(feed)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking feed changes.

  ## Examples

      iex> change_feed(feed)
      %Ecto.Changeset{source: %Feed{}}

  """
  def change_feed(%Feed{} = feed) do
    Feed.changeset(feed, %{})
  end

  alias Reader.Feeds.Entry

  @doc """
  Returns the list of entries.

  ## Examples

      iex> list_entries()
      [%Entry{}, ...]

  """
  def list_entries do
    Repo.all(Entry)
  end

  def list_entries(user_id, feed_id) do
    query =
      from e in Entry,
      join: uf in UserFeed,
      where: uf.user_id == ^user_id and uf.feed_id == ^feed_id and uf.feed_id == e.feed_id and e.id > uf.last_read_entry_id,
      select: map(e, [:id, :title, :url, :content, :published_at, :feed_id]),
      order_by: e.id,
      limit: 10

    Repo.all(query)
  end

  @doc """
  Gets a single entry.

  Raises `Ecto.NoResultsError` if the Entry does not exist.

  ## Examples

      iex> get_entry!(123)
      %Entry{}

      iex> get_entry!(456)
      ** (Ecto.NoResultsError)

  """
  def get_entry!(id), do: Repo.get!(Entry, id)

  @doc """
  Creates a entry.

  ## Examples

      iex> create_entry(%{field: value})
      {:ok, %Entry{}}

      iex> create_entry(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_entry(attrs \\ %{}) do
    %Entry{}
    |> Entry.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a entry.

  ## Examples

      iex> update_entry(entry, %{field: new_value})
      {:ok, %Entry{}}

      iex> update_entry(entry, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_entry(%Entry{} = entry, attrs) do
    entry
    |> Entry.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Entry.

  ## Examples

      iex> delete_entry(entry)
      {:ok, %Entry{}}

      iex> delete_entry(entry)
      {:error, %Ecto.Changeset{}}

  """
  def delete_entry(%Entry{} = entry) do
    Repo.delete(entry)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking entry changes.

  ## Examples

      iex> change_entry(entry)
      %Ecto.Changeset{source: %Entry{}}

  """
  def change_entry(%Entry{} = entry) do
    Entry.changeset(entry, %{})
  end


  def read_entry(user_id, feed_id, entry_id) do
    query = 
      "UPDATE users_feeds SET last_read_entry_id = $3
       WHERE user_id = $1 AND feed_id = $2 AND last_read_entry_id < $3"
    Ecto.Adapters.SQL.query!(Repo, query, [user_id, feed_id, entry_id])
  end

  def catch_up(user_id, feed_id, keep) do
    query = 
      "UPDATE users_feeds SET last_read_entry_id = i.id
       FROM ( SELECT E.id
              FROM users U, entries E, users_feeds UF
              WHERE U.id = $1 AND U.id = UF.user_id AND UF.feed_id = E.feed_id AND UF.feed_id = $2
              ORDER BY E.id DESC LIMIT 1 OFFSET $3
       ) i
       WHERE user_id = $1 AND feed_id = $2 AND last_read_entry_id < i.id"
    Ecto.Adapters.SQL.query!(Repo, query, [user_id, feed_id, keep])
  end

  def count_unread_entries(user_id, feed_id) do
    query = 
      "SELECT count(1)
       FROM users U, users_feeds UF, entries E
       WHERE U.id = $1 AND U.id = UF.user_id AND UF.feed_id = E.feed_id AND E.id > UF.last_read_entry_id
         AND UF.feed_id = $2"
    %{rows: [[count]]} = Ecto.Adapters.SQL.query!(Repo, query, [user_id, feed_id])
    count
  end

  def get_user_feed(user_id, feed_id) do
    query =
      from uf in UserFeed,
      # where: uf.user_id == ^user_id and uf.feed_id == ^feed_id,
      select: map(uf, [:user_id, :feed_id, :title, :last_read_entry_id])
    
    Repo.get_by(query, [user_id: user_id, feed_id: feed_id])
  end

  def create_user_feed(attrs \\ %{}) do
    %UserFeed{}
    |> UserFeed.changeset(attrs)
    |> Repo.insert()
  end

  def get_feed_by_feed_url(nil), do: nil
  def get_feed_by_feed_url(url), do: Repo.get_by(Feed, feed_url: url)

  def delete_user_feed(user_id, feed_id) do
    Repo.get_by(UserFeed, [user_id: user_id, feed_id: feed_id])
    |> Repo.delete
  end

end
