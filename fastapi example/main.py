from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
import random
import asyncio

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
#print("Hello start")
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established.")

    particle_data = {"x": 150, "y": 150}

    print("Starting loop for sending updates...")

    while True:
        if not websocket.client:
            print("WebSocket disconnected.")
            break

        data = await websocket.receive_text()
        print(f"Received message from client: {data}")

        if data == "request_particles":
            await websocket.send_json(particle_data)
            print(f"Sent initial particle data to client: {particle_data}")

        elif data == "keep_alive":
            print("Received keep-alive message from client.")

        dx = random.randint(-10, 10)
        dy = random.randint(-10, 10)
        particle_data["x"] += dx
        particle_data["y"] += dy
        particle_data["x"] = max(0, min(300, particle_data["x"]))
        particle_data["y"] = max(0, min(300, particle_data["y"]))

        await websocket.send_json(particle_data)
        print(f"Sent updated particle data to client: {particle_data}")

        await asyncio.sleep(1)
