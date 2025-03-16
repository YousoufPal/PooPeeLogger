from flask import Blueprint, jsonify, request
import os
from app.langflow.langflow_helper import run_flow
from dotenv import load_dotenv
import json


langflow_bp = Blueprint('/langflow', __name__, url_prefix='/langflow')

dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env')

load_dotenv(dotenv_path)

flow_id = os.getenv("FLOW_ID")
application_token = os.getenv("APPLICATION_TOKEN")

@langflow_bp.get("/feedback")
def langflow_feedback():
    try:
        example_message = (run_flow("I am feeling sad and stressed", endpoint=flow_id, application_token=application_token))
        output_message  = json.loads(example_message["outputs"][0]["outputs"][0]["messages"][0]["message"])
        return (output_message)

    except Exception as e:
        print(f"Error registering user: {e}")

@langflow_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        return run_flow(
            message=data.get('message', ''),
            endpoint=os.getenv("FLOW_ID"),
            application_token=os.getenv("APPLICATION_TOKEN")
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500