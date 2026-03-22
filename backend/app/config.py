import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    AIRTABLE_TOKEN = "patzWHd5tuDZWVKg1.4eb2cd83112d271844c0bdc4fe4dd50e44c2cd59c5284be514428e5c559631e8"
    AIRTABLE_BASE_ID = "apptrJWQiYgjwrNUS"

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False

config_by_name = {
    'dev': DevelopmentConfig,
    'prod': ProductionConfig
}
