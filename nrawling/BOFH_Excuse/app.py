from flask import Flask
from flask import render_template
from excuse import *

app = Flask(__name__)

excuses = load_excuses()

@app.route('/')
def index():
    return render_template('index.html', excuse=random_excuse(excuses))

if __name__ == '__main__':
    app.run(debug=True)
