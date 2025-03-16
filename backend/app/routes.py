from flask import Blueprint, request, jsonify
from .langflow.langflow_helper import analyze_journal_entry, run_flow
# import spotipy
# from spotipy.oauth2 import SpotifyClientCredentials
import os

api = Blueprint('api', __name__)

# Initialize Spotify client - will automatically use SPOTIPY_CLIENT_ID and SPOTIPY_CLIENT_SECRET
# sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

@api.route('/analyze', methods=['POST'])
def analyze_responses():
    try:
        data = request.json
        mood = data.get('mood')
        answers = data.get('answers')
        questions = data.get('questions')

        # Format journal entries
        entries = []
        for q, a in zip(questions, answers):
            entries.append(f"Q: {q}")
            entries.append(f"A: {a}")
        
        # First get analysis from Langflow
        combined_input = f"Mood: {mood['label']}\nJournal Entries:\n" + "\n".join(entries)
        
        langflow_response = run_flow(
            message=combined_input,
            endpoint=os.getenv("FLOW_ID"),
            application_token=os.getenv("APPLICATION_TOKEN")
        )

        # Then get additional analysis from direct GPT integration
        gpt_analysis = analyze_journal_entry(mood, questions, answers)

        # Combine both analyses
        combined_analysis = {
            "summary": gpt_analysis["summary"],
            "actionItems": gpt_analysis["actionItems"],
            "langflowInsights": langflow_response.get("outputs", [{}])[0].get("outputs", [{}])[0].get("messages", [{}])[0].get("message", "No additional insights available")
        }
        
        return jsonify(combined_analysis)
        
    except Exception as e:
        print(f"Error analyzing responses: {e}")
        return jsonify({
            "error": "Failed to analyze responses",
            "message": str(e)
        }), 500

@api.route('/spotify/recommendations', methods=['POST'])
def get_music_recommendations():
    data = request.json
    mood = data.get('mood')
    analysis = data.get('analysis')

    # Map moods to Spotify audio features
    mood_features = {
        'Happy': {'valence': 0.8, 'energy': 0.8, 'tempo': 120},
        'Sad': {'valence': 0.2, 'energy': 0.3, 'tempo': 80},
        'Angry': {'valence': 0.4, 'energy': 0.9, 'tempo': 140},
        'Calm': {'valence': 0.6, 'energy': 0.3, 'tempo': 90},
        'Confused': {'valence': 0.5, 'energy': 0.5, 'tempo': 100},
        'Stressed': {'valence': 0.3, 'energy': 0.7, 'tempo': 110}
    }

    features = mood_features.get(mood['label'], {'valence': 0.5, 'energy': 0.5})

    # Get recommendations from Spotify
    recommendations = sp.recommendations(
        seed_genres=['pop', 'ambient', 'classical', 'electronic'],
        target_valence=features['valence'],
        target_energy=features['energy'],
        limit=5
    )

    # Format the response
    tracks = [{
        'name': track['name'],
        'artists': [artist['name'] for artist in track['artists']],
        'uri': track['uri']
    } for track in recommendations['tracks']]

    return jsonify({'tracks': tracks})