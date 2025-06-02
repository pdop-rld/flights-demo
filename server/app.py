from flask import Flask, jsonify, request
import pandas as pd

app = Flask(__name__)

# Load the mapping CSV into a DataFrame
airport_df = pd.read_csv('../airport_code_mapping.csv')

# Convert to a dictionary for fast lookup
airport_dict = dict(zip(airport_df['OriginAirportID'], airport_df['OriginAirportName']))

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
    app.run(debug=False, host='0.0.0.0', use_reloader=False, port=5000)