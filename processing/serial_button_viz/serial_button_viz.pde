/*
 Serial Button Example
 Do something when the ESP32 L and R buttons are pressed
 */

import processing.serial.*;

Serial myPort;  // Create object from Serial class
String val;      // Data received from the serial port

void setup()
{
  size(500, 500);
  printArray(Serial.list());
  String portName = Serial.list()[5];
  println(portName);
  myPort = new Serial(this, portName, 115200); // ensure baudrate is consistent with arduino sketch
}

void draw()
{
  background(0);
  textSize(128);
  
  if (myPort.available() > 0) {  
    val = myPort.readStringUntil('\n');  
  }
  if (val != null){
    println(val);
    textAlign(CENTER);
    text(val, width/2, height/2);
  }    
}
