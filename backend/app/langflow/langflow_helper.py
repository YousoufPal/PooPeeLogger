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

from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

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

def analyze_journal_entry(mood, questions, answers):
    # Initialize ChatGPT
    chat = ChatOpenAI(
        temperature=0.7,
        model="gpt-4",
        openai_api_key=os.getenv('OPENAI_API_KEY')
    )

    # Format the questions and answers for the prompt
    qa_pairs = "\n".join([f"Q: {q}\nA: {a}" for q, a in zip(questions, answers)])

    # Create the analysis prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an empathetic AI therapist analyzing a user's journal entry. 
        Provide a thoughtful analysis of their responses and suggest helpful actions.
        Format your response as a JSON-like structure with two keys:
        1. 'summary': A compassionate analysis of their feelings and situation
        2. 'actionItems': A list of 3-5 specific, actionable suggestions"""),
        ("user", f"The user is feeling {mood['label']}.\n\nThey answered these questions:\n{qa_pairs}\n\nAnalyze their responses and provide guidance.")
    ])

    # Get response from ChatGPT
    response = chat.invoke(prompt.format_messages())

    # Parse the response into sections
    try:
        # The response should be in a format like:
        # {
        #   "summary": "...",
        #   "actionItems": ["...", "...", "..."]
        # }
        return eval(response.content)
    except:
        # Fallback in case the response isn't perfectly formatted
        return {
            "summary": response.content[:500],
            "actionItems": [
                "Take a few deep breaths",
                "Write down your thoughts",
                "Talk to someone you trust"
            ]
        }