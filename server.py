from flask import (
    Flask,
    request
    )

from motto import run 

app = Flask(__name__)

# TODO: We might want to create a better interface for passing arguments.
class Args(object):
    def __init__(self):
        self.inMeme = None
        self.method = 'Motto'
        self.style = 'compact'
        self.delimiter = ''
        self.penalty = 0
        self.maxCharacter = None
        self.trim = True


@app.route('/upload', methods=['POST'])
def get_seq():
    data = request.json['data']
    ret = run(Args(), data)
    return ret

if __name__ == '__main__':
    app.run(host='localhost', port=8080)
