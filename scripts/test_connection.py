import requests
import sys

def check_backend_health():
    url = "http://127.0.0.1:8000/health"
    try:
        print(f"Tentando conectar em {url}...")
        response = requests.get(url, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 200:
            print("✅ Backend está acessível na porta 8001!")
            return True
        else:
            print("❌ Backend respondeu com erro.")
            return False
    except Exception as e:
        print(f"❌ Falha na conexão: {e}")
        return False

if __name__ == "__main__":
    if check_backend_health():
        sys.exit(0)
    else:
        sys.exit(1)
