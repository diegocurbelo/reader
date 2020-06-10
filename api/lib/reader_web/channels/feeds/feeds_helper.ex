defmodule ReaderWeb.FeedsHelper do
  require Feedex
  require Logger
  alias Reader.Feeds

  def add_feed(user_id, feed_url) do
  	with {:ok, feed} <- get_feed(feed_url),
         {:ok}       <- add_feed_to_user(user_id, feed) do
      Map.put(feed, :unread_count, Feeds.count_unread_entries(user_id, feed.id))
		else
      {:error, code, message} -> 
      	%{error: code, message: message}
    end
  end

	def remove_feed(user_id, feed_id) do
  	Feeds.delete_user_feed(user_id, feed_id)
  end


	# --

  defp get_feed(url) do
    case Feeds.get_feed_by_feed_url(url) do
      nil  -> add_feed(url)
      feed -> {:ok, feed}
    end
  end

	defp add_feed(url) do
    with {:ok, parsed_feed} <- Feedex.fetch_and_parse(url),
         parsed_feed       <- Map.put(parsed_feed, :feed_url, parsed_feed.url),
         {:ok, feed}        <- Feeds.create_feed(parsed_feed) do
      Logger.warn "Created feed: #{feed.id}"
      Enum.each(parsed_feed.entries, fn(parsed_entry) ->
        parsed_entry = Map.put(parsed_entry, :feed_id, feed.id)
      	Feeds.create_entry(parsed_entry)
      end)
      {:ok, feed}

    else
      {:error, reason} ->
        Logger.error "Error creating feed: #{inspect reason}"
        {:error, :invalid_url, reason}
      {:error, :unknown, reason} ->
        Logger.error "Error parsing feed: #{inspect reason}"
        {:error, :invalid_url, reason}
    end
  end

  defp add_feed_to_user(user_id, feed) do
    case Feeds.get_user_feed(user_id, feed.id) do
      nil ->
        Feeds.create_user_feed(%{user_id: user_id, feed_id: feed.id, title: feed.title})
        {:ok}
      _ ->
        {:error, :feed_already_added, "The user is already subscribed to this feed"}
    end
  end

end