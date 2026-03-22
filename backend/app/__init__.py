from flask import Flask
from flask_cors import CORS
from .config import config_by_name

# Initialize extensions here
cors = CORS()

def create_app(config_name='dev'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Register Blueprints
    from .routes.health import health_bp
    from .routes.data import users_bp
    from .routes.auth import auth_bp
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(users_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    # You could also initialize your Airtable service here and attach it to app
    from .services.airtable_service import AirtableService
    from .services.auth_service import AuthService
    
    app.airtable = AirtableService(
        app.config['AIRTABLE_TOKEN'],
        app.config['AIRTABLE_BASE_ID']
    )
    
    # Inject AirtableService into AuthService
    app.auth = AuthService(app.airtable)

    return app
