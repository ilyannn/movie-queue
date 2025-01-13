#!/usr/bin/env python3

import os
import sys

import psycopg2
from dotenv import load_dotenv

load_dotenv()

SCHEMA_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS queues (
        queue_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        languages TEXT NOT NULL,
        region TEXT NOT NULL
    );
    """,
    # auth_user_uuid is Supabase user id
    """
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        auth_user_uuid UUID NOT NULL UNIQUE, 
        queue_id INTEGER DEFAULT NULL,
        locale TEXT NOT NULL,
        FOREIGN KEY (queue_id) REFERENCES queues(queue_id) ON DELETE SET NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS queue_members (
        queue_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        PRIMARY KEY (queue_id, user_id),
        FOREIGN KEY (queue_id) REFERENCES queues(queue_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS queue_movies (
        queue_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        sort_order TEXT NOT NULL,
        PRIMARY KEY (queue_id, sort_order),
        FOREIGN KEY (queue_id) REFERENCES queues(queue_id) ON DELETE CASCADE
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_users_by_auth_user_uuid ON users (auth_user_uuid);",
    "CREATE INDEX IF NOT EXISTS idx_queue_by_user ON queue_members (user_id);",
    "CREATE INDEX IF NOT EXISTS idx_queue_by_movie ON queue_movies (movie_id, queue_id);",
    # Enable row level security
    "ALTER TABLE queues ENABLE ROW LEVEL SECURITY;",
    "ALTER TABLE users ENABLE ROW LEVEL SECURITY;",
    "ALTER TABLE queue_members ENABLE ROW LEVEL SECURITY;",
    "ALTER TABLE queue_movies ENABLE ROW LEVEL SECURITY;",
    # Create policies
    """
    CREATE POLICY users_policy ON users TO authenticated
        USING (auth_user_uuid = auth.uid());
    """,
    """
    CREATE POLICY queues_policy ON queues TO authenticated
        USING (queue_id IN (
            SELECT queue_id FROM queue_members
            WHERE user_id IN (
                SELECT user_id FROM users WHERE auth_user_uuid = auth.uid()
            )
        ));
    """,
    """
    CREATE POLICY queue_members_policy ON queue_members TO authenticated
        USING (user_id IN (
            SELECT user_id FROM users WHERE auth_user_uuid = auth.uid()
        ));
    """,
    """
    CREATE POLICY queue_movies_policy ON queue_movies TO authenticated
        USING (queue_id IN (
            SELECT queue_id FROM queue_members
            WHERE user_id IN (
                SELECT user_id FROM users WHERE auth_user_uuid = auth.uid()
            )
        ));
    """,
]


def main():
    connection_string = os.getenv("DATABASE_URL")

    if not connection_string:
        connection_string = input("Connection string:").strip()

    if not connection_string:
        print(
            """Usage: script.py << echo [connection-string]
Or set the DATABASE_URL env variable."""
        )
        sys.exit(1)

    with psycopg2.connect(connection_string) as conn:
        with conn.cursor() as cur:
            for stmt in SCHEMA_STATEMENTS:
                cur.execute(stmt)
            conn.commit()

    print("Schema and indexes created successfully.")


if __name__ == "__main__":
    main()
