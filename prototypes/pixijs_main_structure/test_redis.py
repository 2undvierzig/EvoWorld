import time
import redis
from threading import Thread

class WorldComponent:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)

    def world_update(self):
        while True:
            message = "World updated at: " + str(time.time())
            self.redis_client.set("world_update", message)
            # English comment: Sleep for 500 milliseconds before next update
            #time.sleep(0.5)

if __name__ == "__main__":
    world_component = WorldComponent()
    
    # English comment: Start the world_update method in a separate thread
    Thread(target=world_component.world_update).start()
