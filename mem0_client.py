import requests
from typing import List, Dict, Optional, Any
import json

class Mem0Client:
    def __init__(self, base_url: str = "http://localhost:8081", user_id: str = "default_user"):
        self.base_url = base_url
        self.user_id = user_id
        self.headers = {"Content-Type": "application/json"}
    
    def add_memory(self, messages: List[Dict[str, str]], metadata: Optional[Dict] = None):
        """
        Añade una nueva memoria al sistema
        
        Args:
            messages: Lista de mensajes con formato [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
            metadata: Metadatos opcionales para la memoria
        """
        data = {
            "messages": messages,
            "user_id": self.user_id,
            "metadata": metadata
        }
        response = requests.post(
            f"{self.base_url}/memory/add",
            headers=self.headers,
            json=data
        )
        return response.json()
    
    def search(self, query: str, limit: int = 10):
        """
        Busca memorias relevantes
        
        Args:
            query: Consulta de búsqueda
            limit: Número máximo de resultados
        """
        data = {
            "query": query,
            "user_id": self.user_id,
            "limit": limit
        }
        response = requests.post(
            f"{self.base_url}/memory/search",
            headers=self.headers,
            json=data
        )
        return response.json()
    
    def get_all_memories(self):
        """Obtiene todas las memorias del usuario"""
        response = requests.get(f"{self.base_url}/memory/all/{self.user_id}")
        return response.json()
    
    def update_memory(self, memory_id: str, new_data: str):
        """
        Actualiza una memoria existente
        
        Args:
            memory_id: ID de la memoria a actualizar
            new_data: Nuevo contenido
        """
        data = {
            "memory_id": memory_id,
            "data": new_data,
            "user_id": self.user_id
        }
        response = requests.put(
            f"{self.base_url}/memory/update",
            headers=self.headers,
            json=data
        )
        return response.json()
    
    def delete_memory(self, memory_id: str):
        """
        Elimina una memoria
        
        Args:
            memory_id: ID de la memoria a eliminar
        """
        response = requests.delete(
            f"{self.base_url}/memory/{memory_id}",
            params={"user_id": self.user_id}
        )
        return response.json()
    
    def health_check(self):
        """Verifica el estado del servicio"""
        response = requests.get(f"{self.base_url}/health")
        return response.json()

if __name__ == "__main__":
    client = Mem0Client(user_id="micmac_user")
    
    print("Verificando estado del servicio...")
    try:
        health = client.health_check()
        print(f"Estado: {health}")
    except Exception as e:
        print(f"Error: El servicio no está disponible - {e}")
        exit(1)
    
    print("\nEjemplo de uso:")
    
    messages = [
        {"role": "user", "content": "Mi proyecto micmac es una aplicación de gestión"},
        {"role": "assistant", "content": "Entiendo que micmac es tu aplicación de gestión"}
    ]
    
    print("\n1. Añadiendo memoria...")
    result = client.add_memory(messages, metadata={"project": "micmac", "type": "project_info"})
    print(f"Resultado: {result}")
    
    print("\n2. Buscando memorias...")
    search_results = client.search("micmac proyecto")
    print(f"Resultados de búsqueda: {search_results}")
    
    print("\n3. Obteniendo todas las memorias...")
    all_memories = client.get_all_memories()
    print(f"Todas las memorias: {all_memories}")