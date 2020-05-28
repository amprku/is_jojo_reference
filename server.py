#!/usr/bin/env python

import os
from flask import Flask, render_template, request
import json
from flask_cors import CORS
import compile_data
app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/phrase")
def phrase():

    result = {
        'data': [],
        'is_a_reference':False,
        'error': ''
    }

    phrase = request.args.get('value')

    # sanitization checks
    if not 3 <= len(phrase) <= 150:
        result['error'] += "Message length must be between 3 and 150 inclusively.\n"

    if not result['error']:
        try:
            result['data'] = compile_data.get_all_phrase_data(phrase)
            if result['data']:
                result['is_a_reference'] = True
        except Exception as e:
            result['error'] = str(e)

    return json.dumps(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
