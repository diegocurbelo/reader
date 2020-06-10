defmodule Reader.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Reader.Accounts.User


  schema "users" do
    field :email, :string
    field :name, :string
    field :google_id, :string
    field :facebook_id, :string

    many_to_many :feeds, Reader.Feeds.Feed, join_through: Reader.Feeds.UserFeed

    timestamps()
  end

  @doc false
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:email, :name, :google_id, :facebook_id])
    |> cast_assoc(:feeds)
    |> validate_required([:email, :name])
    |> unique_constraint(:email)
    |> unique_constraint(:google_id)
    |> unique_constraint(:facebook_id)
  end
end
