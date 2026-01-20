#!/usr/bin/env python

import asyncio
from bleak import BleakClient, discover

address = "46CE59D4-B29A-FC91-EF12-56FB09E15987"
UUID_NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
UUID_NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
command = b"\x03\x10clearInterval()\n\x10setInterval(function() {LED.toggle()}, 500);\n\x10print('Hello World')\n"

def uart_data_received(sender, data):
    print("RX> {0}".format(data))

# You can scan for devices with:
async def find():
   devices = await discover()
   for d in devices:
       print(repr(d))



# //
# Bangle.emit("glucodata", {
#   a: "0",
#   ar: "?",
#   d: "-1.0",
#   dl: "FortyFiveDown",
#   g: "108.0",
#   o: "10",
#   r: "-1.0",
#   rl: "falling",
#   rv: "108",
#   s: "%sensorid",
#   t: "1725850664428",
#   td: "299445",
#   u: "mg/dl",
# });



async def run(address, loop):
    print("Connecting...")
    async with BleakClient(address, loop=loop) as client:
        print("Connected")
        await client.start_notify(UUID_NORDIC_RX, uart_data_received)
        print("Writing command")
        c=command
        while len(c)>0:
          await client.write_gatt_char(UUID_NORDIC_TX, bytearray(c[0:20]), True)
          c = c[20:]
        print("Waiting for data")
        await asyncio.sleep(1.0) # wait for a response
        print("Done!")


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    # loop.run_until_complete(run(address, loop))
    loop.run_until_complete(find())
