import asyncio
import json
import aredis
from aredis import StrictRedis

# Initialize the event loop
loop = asyncio.get_event_loop()

async def init_redis_with_retry(retry_count=3):
    for i in range(retry_count):
        try:
            return await StrictRedis(host='localhost', port=6379, db=0)
        except aredis.exceptions.ConnectionError as e:
            print(f"Verbindungsfehler: {e}. Wiederhole in {2 ** i} Sekunden.")

class WorldComponent:
    def __init__(self, loop):
        self.redis = loop.run_until_complete(init_redis_with_retry())
        if self.redis is None:
            print("Konnte nicht mit Redis verbinden. Beende Programm.")
            exit(1)
        self.tick = 0
        self.terrain_image_path = "sample_world_terrain.png"

    async def init_redis(self):
        return StrictRedis(host='localhost', port=6379, db=0)

    async def init_terrain_image(self):
        with open(self.terrain_image_path, 'rb') as image_file:
            image_binary = image_file.read()
        await self.redis.set('terrain_init', image_binary)

    async def update(self):
        self.tick += 1
        new_world_state = {
            "tick": self.tick,
            "entities": ["entity_1", "entity_2"]
        }
        await self.redis.set('world_update_queue', json.dumps(new_world_state))

    async def run(self):
        await self.init_terrain_image()
        while True:
            await self.update()
            await self.init_terrain_image()
            await asyncio.sleep(1)


            await asyncio.sleep(2 ** i)



# Initialize an instance of the WorldComponent class
world_component = WorldComponent(loop)

# Start the persistent update loop
loop.run_until_complete(world_component.run())
