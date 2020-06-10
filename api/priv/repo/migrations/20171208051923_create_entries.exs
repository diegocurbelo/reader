defmodule Reader.Repo.Migrations.CreateEntries do
  use Ecto.Migration

  def change do
    create table(:entries) do
      add :feed_id, references(:feeds, on_delete: :delete_all), null: false
      add :hash, :string
      add :title, :string
      add :url, :string
      add :content, :text
      add :published_at, :naive_datetime

      timestamps()
    end

    # create index(:entries, [:feed_id])
    create unique_index(:entries, [:hash])
  end
end
