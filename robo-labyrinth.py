#!/usr/bin/env python3

import time
import logging
import json
import random
import threading
import string

from agt import AlexaGadget

from ev3dev2.led import Leds
from ev3dev2.sound import Sound
from ev3dev2.motor import OUTPUT_A, OUTPUT_D, MoveTank 

# Set the logging level to INFO to see messages from AlexaGadget
logging.basicConfig(level=logging.INFO)

lower_case = string.ascii_lowercase[:10] 

class MindstormsGadget(AlexaGadget):

    def __init__(self):

        super().__init__()
        
        self.leds = Leds()
        self.sound = Sound()
        self.tank = MoveTank(OUTPUT_A, OUTPUT_D)

    def on_connected(self, device_addr):
        """
        Gadget connected to the paired Echo device.
        :param device_addr: the address of the device we connected to
        """
        self.leds.set_color("LEFT", "GREEN")
        self.leds.set_color("RIGHT", "GREEN")
        print("{} connected to Echo device".format(self.friendly_name))

    def on_disconnected(self, device_addr):
        """
        Gadget disconnected from the paired Echo device.
        :param device_addr: the address of the device we disconnected from
        """
        self.leds.set_color("LEFT", "BLACK")
        self.leds.set_color("RIGHT", "BLACK")
        print("{} disconnected from Echo device".format(self.friendly_name))

    def _forward(self, dur):
        self.tank.on_for_rotations(50,50,1.3*dur)

    def _backward(self, dur):
        self.tank.on_for_rotations(-50,-50,1.3*dur)

    def _turn_right(self):
        self.tank.on_for_rotations(-50,-50,1.)
        self.tank.on_for_rotations(50,10,1.7)
        self.tank.on_for_rotations(-50,-50,.15)

    def _turn_left(self):
        self.tank.on_for_rotations(-50,-50,1.)
        self.tank.on_for_rotations(10,50,1.8)
        self.tank.on_for_rotations(-50,-50,.15)
        
    def on_custom_mindstorms_gadget_control(self, directive):
        payload = json.loads(directive.payload.decode("utf-8"))
        print("Control payload: {}".format(payload))
        try:
            for i, idx in enumerate(range(1,11)):
                idx_str = str(idx)
                duration = 1
                duration = payload[lower_case[i]]
                if duration == 'to':
                    duration = 2
                duration = int(duration)
                if payload[idx_str] in ['none']:
                    pass
                if payload[idx_str] in ['left','go left','turn left']:
                    self._turn_left()
                if payload[idx_str] in ['right','go right','turn right']:
                    self._turn_right()
                if payload[idx_str] in ['forward', 'go forward']:
                    self._forward(duration)
                if payload[idx_str] in ['backward', 'back', 'go backward']:
                    self._backward(duration)

        except KeyError:
            print("Missing expected parameters: {}".format(directive))


if __name__ == '__main__':
    # Startup sequence
    gadget = MindstormsGadget()
    gadget.sound.play_song((('C4', 'e'), ('D4', 'e'), ('E5', 'q')))
    gadget.leds.set_color("LEFT", "GREEN")
    gadget.leds.set_color("RIGHT", "GREEN")

    # Gadget main entry point
    gadget.main()

    # Shutdown sequence
    gadget.sound.play_song((('E5', 'e'), ('C4', 'e')))
    gadget.leds.set_color("LEFT", "BLACK")
    gadget.leds.set_color("RIGHT", "BLACK")
