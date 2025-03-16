from flask import Flask, jsonify
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.langflow.routes import langflow_bp
    from app.routes import api

    app.register_blueprint(langflow_bp)
    app.register_blueprint(api)

    return app
