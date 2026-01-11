from pathlib import Path

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    project_name: str = "SmartMart Analytics"
    database_url: str = f"sqlite:///{Path(__file__).resolve().parents[2] / 'smartmart.db'}"
    pandas_chunksize: int = 10_000

    class Config:
        env_file = ".env"


settings = Settings()

