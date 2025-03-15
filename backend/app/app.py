from flask import Flask, jsonify
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    CORS(app)


    from app.langflow.routes import langflow_bp

    app.register_blueprint(langflow_bp)

    print("it works 1")

    # from app.langflow.langflow_helper import get_results
    # results = (get_results("I am feeling sad and stressed"))
    # print(results)



    return app
