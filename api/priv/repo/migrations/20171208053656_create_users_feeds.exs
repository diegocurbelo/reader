defmodule Reader.Repo.Migrations.CreateUserFeeds do
  use Ecto.Migration

  def change do
  	create table(:users_feeds) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :feed_id, references(:feeds, on_delete: :delete_all), null: false
      add :title, :string
      add :last_read_entry_id, :integer, default: 0

      timestamps()
    end

    create unique_index(:users_feeds, [:user_id, :feed_id])
  end
end
