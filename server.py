#!/usr/bin/env python

import os
from flask import Flask, render_template, request
import json
import compile_data
app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/phrase")
def phrase():
    phrase = request.args.get('value')
    if len(phrase) >= 3:return json.dumps(compile_data.get_all_phrase_data(phrase))
    else: return '{"error": "Only accept lengths of 3 or greater."}'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
