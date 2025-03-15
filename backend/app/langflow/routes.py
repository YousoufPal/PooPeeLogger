from flask import Blueprint, jsonify, request
import os
from app.langflow.langflow_helper import run_flow
from dotenv import load_dotenv


langflow_bp = Blueprint('/langflow', __name__, url_prefix='/langflow')

dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env')

load_dotenv(dotenv_path)

flow_id = os.getenv("FLOW_ID")
application_token = os.getenv("APPLICATION_TOKEN")

@langflow_bp.get("/feedback")
def langflow_feedback():
    try:

        # user_message = request.json.get('message')
        # if not user_message:
        #     return jsonify({'error': 'No message provided'}), 400

        #use runflow
        # return jsonify({'response': "__runflow__response"})

        example_message = (run_flow("I am feeling sad and stressed", endpoint=flow_id, application_token=application_token))
        print(example_message)
        return (example_message)

    except Exception as e:
        print(f"Error registering user: {e}") 