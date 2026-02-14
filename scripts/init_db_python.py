import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from urllib.parse import urlparse
import os
import sys

# Add backend to path to import settings if needed, but we'll parse .env manually or use hardcoded string based on previous knowledge
# connect string: postgresql://postgres:Panacu48*@localhost:5432/Agents_workflow

DB_NAME = "Agents_workflow"
USER = "postgres"
PASSWORD = "Panacu48*"
HOST = "localhost"
PORT = "5432"

def create_database():
    try:
        # Connect to default 'postgres' database
        con = psycopg2.connect(dbname='postgres', user=USER, host=HOST, password=PASSWORD, port=PORT)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (DB_NAME,))
        exists = cur.fetchone()
        
        if not exists:
            print(f"Database {DB_NAME} does not exist. Creating...")
            cur.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"Database {DB_NAME} created successfully.")
        else:
            print(f"Database {DB_NAME} already exists.")
            
        cur.close()
        con.close()
        return True
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

def run_sql_file(filename):
    try:
        con = psycopg2.connect(dbname=DB_NAME, user=USER, host=HOST, password=PASSWORD, port=PORT)
        cur = con.cursor()
        
        with open(filename, 'r', encoding='utf-8') as f:
            sql = f.read()
            
        cur.execute(sql)
        con.commit()
        print(f"Executed {filename} successfully.")
        
        cur.close()
        con.close()
    except Exception as e:
        print(f"Error executing SQL file: {e}")

if __name__ == "__main__":
    if create_database():
        # Path to init_db.sql
        sql_file = os.path.join(os.path.dirname(__file__), 'init_db.sql')
        if os.path.exists(sql_file):
            run_sql_file(sql_file)
        else:
            print(f"SQL file not found: {sql_file}")
