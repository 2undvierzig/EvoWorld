from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
import random
import asyncio
import json

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established.")

    particle_data = {"x": 150, "y": 150}

    while True:
        data = await websocket.receive_text()
        print(f"Received message from client: {data}")

        if data == "request_particles":
            await websocket.send_json(particle_data)
            print(f"Sent initial particle data to client: {json.dumps(particle_data)}")

        dx = random.randint(-10, 10)
        dy = random.randint(-10, 10)
        particle_data["x"] += dx
        particle_data["y"] += dy
        particle_data["x"] = max(0, min(300, particle_data["x"]))
        particle_data["y"] = max(0, min(300, particle_data["y"]))

        await websocket.send_json(particle_data)
        print(f"Sent updated particle data to client: {json.dumps(particle_data)}")

        await asyncio.sleep(1)
