from flask import Flask, render_template, request
import cv2
import numpy as np
from deepface import DeepFace
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Initialize Flask app
app = Flask(__name__)

# Spotify setup
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="b03f61046f98454fad7c6e734fc4fc1e",
    client_secret="f867e800921943dca90ebd50d9ca18b6"
))

# Function to get song based on emotion
def get_song(emotion):
    mood_map = {
        "happy": "happy",
        "sad": "sad",
        "angry": "angry",
        "surprised": "surprised"
    }
    results = sp.search(q=mood_map.get(emotion, "chill"), limit=1)
    return results['tracks']['items'][0]['external_urls']['spotify']

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['image']
        # Convert image to array
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        # Analyze emotions
        analysis = DeepFace.analyze(img, actions=['emotion'])
        emotion = analysis[0]['dominant_emotion']
        song_link = get_song(emotion)
        return render_template('result.html', emotion=emotion, song_link=song_link)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
