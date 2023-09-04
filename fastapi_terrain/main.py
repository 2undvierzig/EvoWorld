from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
import pika
import json
import base64
import logging
from fastapi.responses import RedirectResponse

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

def get_terrain_from_rabbitmq():
    try:
        # Setup the connection to RabbitMQ
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()

        # Get the message from the terrain_init queue
        method_frame, header_frame, body = channel.basic_get('terrain_init')
        if method_frame:
            image_base64 = base64.b64encode(body).decode('utf-8')
            logging.debug(f"Retrieved terrain data from RabbitMQ. Length: {len(image_base64)} chars, Preview: {image_base64[:100]}...")  # Ersten 100 Zeichen anzeigen
            return {"image": image_base64}
        else:
            logging.debug("No message retrieved from RabbitMQ.")
            return None

    except Exception as e:
        logging.error(f"An error occurred while fetching terrain from RabbitMQ: {e}")
        return None

@app.get("/")
def read_root():
    return RedirectResponse(url="/static/index.html")
    
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        logging.debug("WebSocket connection established.")
        
        terrain = get_terrain_from_rabbitmq()
        if terrain:
            logging.debug(f"Sending terrain data to client. Length: {len(terrain['image'])} chars.")
            await websocket.send_json(terrain)
        else:
            logging.debug("No terrain data to send.")

    except Exception as e:
        logging.error(f"An error occurred during the WebSocket interaction: {e}")

