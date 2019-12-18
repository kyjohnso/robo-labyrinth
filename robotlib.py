#!/usr/bin/env python3
import time

from ev3dev2.motor import OUTPUT_A, OUTPUT_D, LargeMotor, MoveTank

speed = 500
duration = 700

#left_motor = LargeMotor(OUTPUT_A)
#right_motor = LargeMotor(OUTPUT_D)

tank = MoveTank(OUTPUT_A, OUTPUT_D)

def forward(units=1):
    tank.on_for_rotations(50,50,1.35*units)

def backward(units=1):
    tank.on_for_rotations(-50,-50,1.35*units)
def turn_right(units=1):
    tank.on_for_rotations(-50,-50,1.1)
    tank.on_for_rotations(50,10,1.7)
    tank.on_for_rotations(-50,-50,.15)
def turn_left(units=1):
    tank.on_for_rotations(-50,-50,1.1)
    tank.on_for_rotations(10,50,1.7)
    tank.on_for_rotations(-50,-50,.15)


