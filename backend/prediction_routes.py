from urllib.parse import unquote

from flask import Blueprint, request, jsonify, session, current_app, send_from_directory, url_for
from oauthlib.common import quote
from werkzeug.exceptions import Unauthorized

from file_service import FileService
from config import Config

prediction_blueprint = Blueprint('prediction', __name__)


file_service = FileService(upload_folder=Config.UPLOAD_FOLDER, allowed_extensions=Config.ALLOWED_EXTENSIONS)

@prediction_blueprint.route('/predict', methods=['POST'])
def predict():
    with current_app.app_context():
        prediction_service = current_app.prediction_service

        if 'image' not in request.files:
            return jsonify({'error': 'No image part in the request'}), 400

        file = request.files['image']

        if file and file_service.allowed_file(file.filename):
            filepath = file_service.save_file(file)
            image_url = url_for('prediction.uploaded_file', filename=filepath, _external=True)
            try:
                predicted_class, confidence = prediction_service.predict(filepath)
                return jsonify({'title': predicted_class, 'confidence': str(confidence), 'image_src': image_url}), 200
            except Exception as e:
                print(f"Error during prediction: {e}")
                return jsonify({'error': 'Error during prediction'}), 500

        return jsonify({'error': 'File type not allowed'}), 400

@prediction_blueprint.route('/save', methods=['POST'])
def save_prediction():
    with current_app.app_context():
        user_id = session.get('user_id')

        title = request.json.get('title')
        confidence = request.json.get('confidence')
        image_src = request.json.get('image_src')

        if not title or not confidence or not image_src:
            return jsonify({'error': 'Missing data to save prediction'}), 400

        try:
            prediction_id = current_app.prediction_service.save_prediction(user_id, image_src, title, confidence)
            return jsonify({'message': 'Prediction saved', 'id': prediction_id}), 200
        except Exception as e:
            print(f"Error saving prediction: {e}")
            return jsonify({'error': 'Error saving prediction'}), 500

@prediction_blueprint.route('/user-predictions', methods=['GET'])
def user_predictions():
    with current_app.app_context():
        if 'user_id' not in session:
            raise Unauthorized('Unauthorized')

        try:
            predictions = current_app.prediction_service.get_user_predictions(session['user_id'])
            return jsonify(predictions), 200
        except Exception as e:
            print(f"Error fetching predictions: {e}")
            return jsonify({'error': 'Error fetching predictions'}), 400


@prediction_blueprint.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    try:
        decoded_filename = filename.rsplit('/', 1)[-1]
        return send_from_directory(Config.UPLOAD_FOLDER, decoded_filename)
    except Exception as e:
        print(f"Error serving file {filename}: {e}")
        return jsonify({'error': 'File not found'}), 404