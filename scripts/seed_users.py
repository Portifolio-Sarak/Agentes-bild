import sys
import os

# Adiciona o diretório raiz ao path para importar os módulos
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.database import SessionLocal
from app.services.auth_service import create_user, get_user_by_email
from app.models.database import User

def seed_users():
    db = SessionLocal()
    try:
        users_to_create = [
            {
                "email": "usuario@teste.com",
                "username": "UsuarioTeste",
                "password": "teste123"
            },
            {
                "email": "Igorsarak@gmail.com",
                "username": "IgorSarak",
                "password": "Sarak1234"
            }
        ]

        print("Iniciando criação de usuários...")

        for user_data in users_to_create:
            existing_user = get_user_by_email(db, user_data["email"])
            if existing_user:
                print(f"Usuário {user_data['email']} já existe. Pulando.")
            else:
                try:
                    user = create_user(
                        db=db,
                        email=user_data["email"],
                        username=user_data["username"],
                        password=user_data["password"]
                    )
                    print(f"Usuário criado com sucesso: {user.username} ({user.email})")
                except Exception as e:
                    print(f"Erro ao criar usuário {user_data['email']}: {e}")

    except Exception as e:
        print(f"Erro crítico: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
