from flask import Flask, request, jsonify, render_template
import math

app = Flask(__name__)

# Create an object for the square with x and y coordinates
square = {"x": 0, "y": 0}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/move", methods=["POST"])
def move_square():
    # Get the data from the request
    data = request.get_json()
    angle = data.get("angle")
    speed = data.get("speed")
    length = data.get("length")

    # Convert the angle to radians
    angle_in_radians = angle * (math.pi / 180)

    # Calculate the length of time for the move
    time = length / speed

    # Calculate the new position using vector math
    square["x"] += speed * time * math.cos(angle_in_radians)
    square["y"] += speed * time * math.sin(angle_in_radians)

    # Respond with the new position
    return jsonify(square)

@app.route("/border_hit", methods=["POST"])
def border_hit():
    data = request.get_json()
    message = data.get("message")
    print(f"Message from client: {message}")
    return jsonify({"status": "Message received"})


if __name__ == "__main__":
    app.run(debug=True)