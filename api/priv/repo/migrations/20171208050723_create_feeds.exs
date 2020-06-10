defmodule Reader.Repo.Migrations.CreateFeeds do
  use Ecto.Migration

  def change do
    create table(:feeds) do
      add :title, :string
      add :feed_url, :string
      add :site_url, :string
      add :description, :text
      add :last_modified, :naive_datetime
      add :last_status, :string

      timestamps()
    end

    create unique_index(:feeds, [:feed_url])
  end
end
