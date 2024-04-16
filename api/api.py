import time
from flask import Flask

app = Flask(__name__)

@app.route('/')
def get_curr_time():
    return {'time': time.time()}