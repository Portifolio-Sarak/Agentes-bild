import sys
import os
import logging

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.database import SessionLocal, engine
from app.models.database import User
from app.services.auth_service import verify_password, get_user_by_email, create_user
from app.config import settings

def debug_auth():
    print(f"--- DEBUG INFO ---")
    print(f"Database URL: {engine.url}")
    
    db = SessionLocal()
    try:
        # 1. Check schema
        print(f"\n--- CHECKING SCHEMA ---")
        from sqlalchemy import inspect
        inspector = inspect(engine)
        columns = inspector.get_columns('users')
        for col in columns:
            print(f"Column: {col['name']} | Type: {col['type']} | Length: {getattr(col['type'], 'length', 'N/A')}")

        # 2. List all users
        print(f"\n--- LISTING USERS ---")
        users = db.query(User).all()
        print(f"Total users in DB: {len(users)}")
        for u in users:
            print(f"ID: {u.id} | Username: {u.username} | Email: {u.email}")
            
        # 3. Create users if empty
        if len(users) == 0:
            print("\n--- CREATING USERS ---")
            try:
                create_user(db, "admin@erpmodelo.com", "AdminTeste", "admin123")
                create_user(db, "Igorsarak@gmail.com", "IgorSarak", "Sarak1234")
                print("✅ Users CREATED successfully!")
            except Exception as e:
                import traceback
                print(f"❌ Failed to create users: {e}")
                traceback.print_exc()
                db.rollback()

        # 4. Verify login for one
        print("\n--- VERIFYING LOGIN ---")
        user = get_user_by_email(db, "Igorsarak@gmail.com")
        if user:
            print(f"✅ User found: {user.email}")
            # Note: create_user now hashes, so we use verify_password from auth_service
            is_valid = verify_password("Sarak1234", user.password)
            print(f"Password 'Sarak1234' valid? {'✅ YES' if is_valid else '❌ NO'}")
        else:
            print("❌ User still not found.")

    except Exception as e:
        print(f"❌ Error during debug: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_auth()
