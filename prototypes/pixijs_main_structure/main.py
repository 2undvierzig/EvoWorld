from fastapi import FastAPI, WebSocket
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from threading import Thread
import time
import redis

app = FastAPI()

# English comment: Serve static files like HTML, JS, CSS
app.mount("/static", StaticFiles(directory="static"), name="static")

# English comment: Create a Redis client to read the world_update key
redis_client = redis.Redis(host='localhost', port=6379, db=0)

async def fetch_redis_data(websocket: WebSocket):
    while True:
        message = redis_client.get("world_update")
        if message:
            await websocket.send_text(message.decode('utf-8'))
        # English comment: Sleep for 500 milliseconds before fetching the next update
        #time.sleep(0.5)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # English comment: Start fetching Redis data in an asynchronous manner
    await fetch_redis_data(websocket)

@app.get("/")
def read_root():
    # English comment: Serve the index.html file from the static directory
    return FileResponse("static/index.html")
