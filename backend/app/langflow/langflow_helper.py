import argparse
import json
from argparse import RawTextHelpFormatter
import requests
from typing import Optional
import warnings
import os

from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env')

load_dotenv(dotenv_path)

base_api_url = os.getenv("BASE_API_URL")
langflow_id = os.getenv("LANGFLOW_ID")
flow_id = os.getenv("FLOW_ID")
application_token = os.getenv("APPLICATION_TOKEN")
endpoint = os.getenv("ENDPOINT")
try:
    from langflow.load import upload_file
except ImportError:
    warnings.warn("Langflow provides a function to help you upload files to the flow. Please install langflow to use it.")
    upload_file = None


def run_flow(message: str,
  endpoint: str,
  output_type: str = "chat",
  input_type: str = "chat",
  tweaks: Optional[dict] = None,
  application_token: Optional[str] = None) -> dict:
   
    api_url = f"{base_api_url}/lf/{langflow_id}/api/v1/run/{endpoint}"
    
    payload = {
        "input_value": message,
        "output_type": output_type,
        "input_type": input_type,
    }
    headers = None
    if tweaks:
        payload["tweaks"] = tweaks

    if application_token:
        headers = {"Authorization": "Bearer " + application_token, "Content-Type": "application/json"}

    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()