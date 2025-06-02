from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load('../flight_delay_model.joblib')

# Load the mapping CSV into a DataFrame
airport_df = pd.read_csv('../airport_code_mapping.csv')

# Convert to a dictionary for fast lookup
airport_dict = dict(zip(airport_df['OriginAirportID'], airport_df['OriginAirportName']))

@app.route('/predict', methods=['GET'])
def predict_delay():
    # Expecting JSON: {"DayOfWeek": int, "OriginAirportID": int, "DestAirportID": int}
    try:
        day_of_week = int(request.args['DayOfWeek'])
        origin_airport_id = int(request.args['OriginAirportID'])
        dest_airport_id = int(request.args['DestAirportID'])
        features = [day_of_week, origin_airport_id, dest_airport_id]
    except (KeyError, ValueError):
        return jsonify({'error': 'Missing or invalid required query parameters'}), 400

    # Reshape for prediction
    X_input = np.array(features).reshape(1, -1)
    prob = model.predict_proba(X_input)[0]  # Probability of delay > 15 min
    prob_false = prob[0]
    prob_true = prob[1]
    print(f"Probability of delay > 15 min: {prob_true}, Probability of no delay: {prob_false}")
    pred = model.predict(X_input)[0]
    confidence = max(model.predict_proba(X_input)[0])  # Highest class probability

    return jsonify({
        'delayed_over_15': bool(pred),
        'chance_percent': round(prob[1] * 100, 2),
        'confidence_percent': round(confidence * 100, 2)
    })

@app.route('/airport/<int:code>', methods=['GET'])
def get_airport_name(code):
    name = airport_dict.get(code)
    if name:
        return jsonify({'code': code, 'name': name})
    else:
        return jsonify({'error': 'Airport code not found'}), 404

@app.route('/airports', methods=['GET'])
def get_all_airports():
    return jsonify([
        {'code': int(code), 'name': name}
        for code, name in airport_dict.items()
    ])



if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)