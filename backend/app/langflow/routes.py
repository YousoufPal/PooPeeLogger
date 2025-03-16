from flask import Blueprint, jsonify, request
from flask_cors import CORS
import os
from app.langflow.langflow_helper import run_flow
from dotenv import load_dotenv
import json


langflow_bp = Blueprint('langflow', __name__, url_prefix='/langflow')
CORS(langflow_bp)  # Enable CORS for this blueprint

dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env')

load_dotenv(dotenv_path)

flow_id = os.getenv("FLOW_ID")
application_token = os.getenv("APPLICATION_TOKEN")

@langflow_bp.route('/feedback', methods=['POST'])  # Changed from post() to route()
def langflow_feedback():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        message = data.get("message", "")
        
        # Run the flow with the data
        flow_response = run_flow(
            message,
            endpoint=flow_id,
            application_token=application_token
        )
        
        # Parse and structure the response
        if flow_response and "outputs" in flow_response:
            try:
                output_message = json.loads(flow_response["outputs"][0]["outputs"][0]["messages"][0]["message"])
                return jsonify(output_message), 200
            except (KeyError, IndexError, json.JSONDecodeError) as e:
                return jsonify({"error": f"Failed to parse flow response: {str(e)}"}), 500
        
        return jsonify({"error": "Invalid response from flow"}), 500

    except Exception as e:
        print(f"Error processing feedback: {str(e)}")
        return jsonify({"error": str(e)}), 500


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