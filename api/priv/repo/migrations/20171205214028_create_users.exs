defmodule Reader.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :name, :string
      add :facebook_id, :string

      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:facebook_id])
  end
end
