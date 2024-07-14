from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from deepface import DeepFace
import fitz  # PyMuPDF
import requests
from bs4 import BeautifulSoup
import logging
import torch


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/data')
def get_data():
    return {"message": "Hello from Flask"}


# Set up logging
logging.basicConfig(level=logging.DEBUG)

sentiment_pipeline = pipeline('sentiment-analysis')
emotion_model = AutoModelForSequenceClassification.from_pretrained(
    'j-hartmann/emotion-english-distilroberta-base')
emotion_tokenizer = AutoTokenizer.from_pretrained(
    'j-hartmann/emotion-english-distilroberta-base')
emotion_labels = emotion_model.config.id2label

model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=5)
# Define the MPAA ratings
ratings = ["G", "PG", "PG-13", "R", "NC-17"]


def analyze_text(text):
    max_length = 512
    chunks = [text[i:i + max_length] for i in range(0, len(text), max_length)]

    sentiments = []
    emotions = []

    for chunk in chunks:
        inputs = emotion_tokenizer(
            chunk, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            sentiment_result = sentiment_pipeline(chunk)
            emotion_result = emotion_model(**inputs)
            emotion_probs = torch.nn.functional.softmax(
                emotion_result.logits, dim=-1)
            emotion_label = emotion_labels[torch.argmax(emotion_probs).item()]

        sentiments.extend(sentiment_result)
        emotions.append(emotion_label)

    return map_sentiment(sentiments), map_emotion(emotions)


def map_sentiment(sentiment_results):
    sentiment_mapping = {
        'POSITIVE': 'Positive',
        'NEGATIVE': 'Negative',
        'NEUTRAL': 'Neutral'  # Assuming the model provides a neutral category
    }
    # Map and aggregate the sentiments
    sentiment_counts = {'Positive': 0, 'Neutral': 0, 'Negative': 0}
    for result in sentiment_results:
        sentiment = result['label'].upper()
        sentiment_counts[sentiment_mapping.get(sentiment, 'Neutral')] += 1
    # Determine the overall sentiment
    overall_sentiment = max(sentiment_counts, key=sentiment_counts.get)
    return overall_sentiment


def map_emotion(emotion_results):
    emotion_mapping = {
        'love': 'Romance',
        'joy': 'Humor',
        'compassion': 'Compassion',
        'anger': 'Rage',
        'valor': 'Valor',
        'disgust': 'Disgust',
        'fear': 'Fear',
        'surprise': 'Wonder',
        'peace': 'Peace'  # Assuming the model provides a peace category
    }
    # Map and aggregate the emotions
    emotion_counts = {emotion: 0 for emotion in emotion_mapping.values()}
    for emotion in emotion_results:
        mapped_emotion = emotion_mapping.get(
            emotion.lower(), 'Wonder')  # Default to Wonder if not found
        emotion_counts[mapped_emotion] += 1
    # Determine the most frequent emotion
    most_frequent_emotion = max(emotion_counts, key=emotion_counts.get)
    return most_frequent_emotion


def analyze_image(image_path):
    analysis = DeepFace.analyze(image_path, actions=['emotion'])
    return analysis


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ''
    for page in doc:
        text += page.get_text()
    return text


def extract_text_from_url(url):
    try:
        response = requests.get(url)
        if response.status_code != 200:
            app.logger.error(f"Error fetching URL: {response.status_code}")
            return None
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract text from specific HTML tags
        paragraphs = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        text = ' '.join([para.get_text() for para in paragraphs])

        if not text.strip():
            app.logger.error("Extracted text is empty.")
            return None

        return text
    except Exception as e:
        app.logger.error(f"Error extracting text from URL: {e}")
        return None


# Function to predict MPAA rating
def determine_age_appropriateness(text):
    inputs = tokenizer(text, return_tensors="pt",
                       padding=True, truncation=True, max_length=512)
    outputs = model(**inputs)
    prediction = torch.argmax(outputs.logits, dim=1).item()
    return ratings[prediction]


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'filename': filename}), 200
    except Exception as e:
        app.logger.error(f"Error uploading file: {e}")
        return jsonify({'error': 'File upload failed'}), 500


@app.route('/analyze', methods=['POST'])
def analyze_content():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        result = {}
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.svg')):
            result = analyze_image(file_path)
        elif filename.lower().endswith(('.pdf', '.txt')):
            text = extract_text_from_pdf(file_path) if filename.lower().endswith(
                '.pdf') else extract_text_from_txt(file_path)
            if not isinstance(text, str):
                app.logger.error(
                    f"Extracted text is not a string: {type(text)}")
                return jsonify({'error': 'Failed to extract text from file'}), 500
            # Log the first 100 characters of the text
            app.logger.debug(f"Extracted text: {text[:100]}")
            sentiment, emotion = analyze_text(text)
            age_rating = determine_age_appropriateness(text)
            result = {'sentiment': sentiment,
                      'emotion': emotion, 'age_rating': age_rating}
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        os.remove(file_path)
        return jsonify(result), 200
    except Exception as e:
        app.logger.error(f"Error analyzing content: {e}")
        return jsonify({'error': 'Content analysis failed'}), 500


def extract_text_from_txt(txt_path):
    with open(txt_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text


@app.route('/analyze-url', methods=['POST'])
def analyze_url():
    try:
        data = request.get_json()
        url = data.get('url')
        if not url:
            return jsonify({'error': 'No URL provided'}), 400

        app.logger.debug(f"Fetching URL: {url}")
        text = extract_text_from_url(url)
        if not text or not isinstance(text, str):
            app.logger.error(f"Failed to extract valid text from URL: {url}")
            return jsonify({'error': 'Failed to extract text from URL'}), 500

        sentiment, emotion = analyze_text(text)
        age_rating = determine_age_appropriateness(text)
        return jsonify({'sentiment': sentiment, 'emotion': emotion, 'age_rating': age_rating}), 200
    except Exception as e:
        app.logger.error(f"Error analyzing URL: {e}")
        return jsonify({'error': 'URL analysis failed'}), 500


if __name__ == "__main__":
    app.run(debug=True)
