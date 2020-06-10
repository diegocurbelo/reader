defmodule Reader.Feeds.UserFeed do
  use Ecto.Schema
  import Ecto.Changeset
  alias Reader.Feeds.UserFeed


  schema "users_feeds" do
    belongs_to :user, Reader.Accounts.User
    belongs_to :feed, Reader.Feeds.Feed
    field :title, :string
    field :last_read_entry_id, :integer

    timestamps()
  end

  @doc false
  def changeset(%UserFeed{} = user_feed, attrs) do
    user_feed
    |> cast(attrs, [:user_id, :feed_id, :title, :last_read_entry_id])
    |> validate_required([:user_id, :feed_id, :title])
    |> unique_constraint(:user_id, name: :users_feeds_user_id_feed_id_index)
  end
end
