from pathlib import Path

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    project_name: str = "SmartMart Analytics"
    base_dir: Path = Path(__file__).resolve().parents[2]
    database_file_path: Path = base_dir / "smartmart.db"
    database_url: str = f"sqlite:///{database_file_path}"
    pandas_chunksize: int = 10_000

    class Config:
        env_file = ".env"


settings = Settings()

