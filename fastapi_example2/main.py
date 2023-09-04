from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
import json
import random
import asyncio

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

particles = []
for i in range(1,20):
    p = {"id": i, "x": random.randint(100, 700), "y": random.randint(100, 700)}
    particles.append(p)

"""particles = [
    {"id": 1, "x": random.randint(100, 200), "y": random.randint(100, 200)},
    {"id": 2, "x": random.randint(100, 200), "y": random.randint(100, 200)}
]"""

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established.")
    
    # Send initial particle data
    await websocket.send_json(particles)
    print(f"Sent initial particle data to client: {particles}")

    # Update particles
    while True:
        for particle in particles:
            particle["x"] += random.randint(-1000, 1000)
            particle["y"] += random.randint(-1000, 1000)
        
        await websocket.send_json(particles)
        print(f"Sent updated particle data to client: {particles}")
        await asyncio.sleep(1)

        