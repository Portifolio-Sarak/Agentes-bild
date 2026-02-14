import sys
import os

# Adiciona o diretório raiz ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.database import SessionLocal
from app.models.database import User

def list_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Total users found: {len(users)}")
        for user in users:
            print(f"User: {user.username}, Email: {user.email}, ID: {user.id}")
    except Exception as e:
        print(f"Error listing users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
