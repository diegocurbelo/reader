defmodule Reader.Feeds.Entry do
  use Ecto.Schema
  import Ecto.Changeset
  alias Reader.Feeds.Entry


  schema "entries" do
    field :hash, :string
    field :title, :string
    field :url, :string
    field :content, :string
    field :published_at, :naive_datetime

    belongs_to :feed, Reader.Feeds.Feed

    timestamps()
  end

  @doc false
  def changeset(%Entry{} = entry, attrs) do
    entry
    |> cast(attrs, [:hash, :title, :url, :content, :published_at, :feed_id])
    |> put_change(:hash, attrs.id)
    |> put_change(:published_at, attrs.updated |> DateTime.to_naive())
    |> validate_required([:hash, :title, :content, :published_at, :feed_id])
    |> unique_constraint(:hash)
    
  end
end
