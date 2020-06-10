defmodule Updater do
  use GenServer
  require Logger
  require Feedex
  alias Reader.Feeds

  def start_link do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    Logger.info "[Updater] Init"
    reschedule()
    {:ok, state}
  end

  def handle_info(:work, state) do
    update_feeds()
    reschedule()
    {:noreply, state}
  end

  # --

  defp reschedule() do
    Process.send_after(self(), :work, 30 * 60 * 1000) # cada 30 minutos
  end

  def update_feeds() do
    start = :os.system_time(:millisecond)
    feeds = Feeds.list_feeds
    Logger.info "[Updater] Processing #{length feeds} feeds ..."
    
    Enum.each(feeds, fn(feed) ->
      Logger.info "[Updater] Processing #{feed.id}"
      case Feedex.fetch_and_parse(feed.feed_url) do
        {:ok, parsed_feed} ->
          Feeds.update_feed(feed, parsed_feed)
          process_feed_entries(feed, parsed_feed)

        {:error, reason} ->
          Logger.warn "Unable to process feed #{feed.id} (#{feed.feed_url}): #{reason}"
      #     a = Feeds.update_feed(feed, %{last_modified: "#{reason}"})

        true ->
          Logger.error "Unable to process feed #{feed.id} (#{feed.feed_url}): reason unknown"
      #     a = Feeds.update_feed(feed, %{last_modified: "reason unknown"})
      end
    end)

    Logger.info "[Updater] Finished updating #{length feeds} feeds in #{(:os.system_time(:millisecond) - start) / 1000} seconds."
    # ReaderWeb.UserChannel.send()
    # ReaderWeb.Endpoint.broadcast("user:1", "update")
  end

  defp process_feed_entries(feed, parsed_feed) do
    Enum.each(parsed_feed.entries, fn(parsed_entry) ->
      parsed_entry = Map.put(parsed_entry, :feed_id, feed.id)
      case Feeds.create_entry(parsed_entry) do
        {:ok, entry} ->
          Logger.info "[Updater] Inserted entry=#{entry.id} / feed=#{feed.id}"
        {:error, changeset} ->
          Logger.warn "[Updater] Error inserting: #{inspect changeset.errors}"
      end
    end)
    Logger.info "[Updater] Processed feed #{feed.id}"
  end

end
