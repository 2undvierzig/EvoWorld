from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit
import gym
from gym import spaces
import math
import numpy as np
import requests

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")



@socketio.on('move_rectangle')
def handle_move_rectangle():
    state = discretize(env.current_position)
    action = agent.choose_action(state)
    new_position, reward, done, _ = env.step(action)

    emit('rectangle_update', {
        "new_position": new_position,
        "reward": reward,
        "done": done
    })

@socketio.on('border_hit')
def handle_border_hit(data):
    hit = data.get('hit', False)
    if hit:
        print("The rectangle has hit the border!")
    else:
        print("The rectangle is within the canvas boundaries.")

    emit('border_hit_response', {"status": "Received"})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
