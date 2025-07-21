import { TrafficLight } from "./TrafficLight";
import { Phase } from "./Phase";
import { Junction } from "./Junction";

const phases: Phase[] = [
  new Phase("A", 2, ["red", "greenNoPriority"]),
  new Phase("B", 2, ["greenNoPriority", "red"]),
];

const trafficLight1 = new TrafficLight("1", "offNoSignal");

const trafficLight2 = new TrafficLight("2", "offNoSignal");
trafficLight2.setId("2");

const junction = new Junction(phases, [trafficLight1, trafficLight2]);
junction.start();
