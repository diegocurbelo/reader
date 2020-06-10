defmodule Reader.Feeds.Feed do
  use Ecto.Schema
  import Ecto.Changeset
  alias Reader.Feeds.Feed


  schema "feeds" do
    field :title, :string
    field :feed_url, :string
    field :site_url, :string
    field :description, :string
    field :last_modified, :naive_datetime

    timestamps()
  end

  @doc false
  def changeset(%Feed{} = feed, attrs) do
    feed
    |> cast(attrs, [:title, :feed_url, :site_url, :description, :last_modified])
    |> validate_required([:feed_url])
    |> put_change(:last_modified, attrs.updated |> DateTime.to_naive())
  end

end
