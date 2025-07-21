import mqtt from "mqtt";
import {CAMSchema, MAPEMSchema, SignalPhaseState, SPATEMSchema, StationType} from "./types/c-its";

console.log("Attempting to connect to MQTT broker at localhost:1883...");

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
    console.log("✅ Connected to MQTT broker!");
    
    // Subscribe to vanetza topics
    client.subscribe("vanetza/#", (err) => {
        if (err) {
            console.error("❌ Subscribe error:", err);
        } else {
            console.log("📡 Subscribed to vanetza/# topics");
        }
    });
});

client.on("message", (topic, message) => {
    const messageStr = message.toString();
    
    try {
        const messageData = JSON.parse(messageStr);
        
        // Type check based on topic using generated schemas
        if (topic.endsWith("/cam")) {
            try {
                const camMessage = CAMSchema.parse(messageData);
                console.log(`🚗 [${topic}] CAM Message:`);
                console.log(`   Station ID: ${camMessage.stationID} (${getStationTypeString(camMessage.stationType)})`);
                console.log(`   Position: ${camMessage.latitude}, ${camMessage.longitude}`);
                console.log(`   Speed: ${camMessage.speed / 100}m/s, Heading: ${camMessage.heading / 10}°`);
                console.log(`   Drive Direction: ${camMessage.driveDirection}`);
                
                if (camMessage.emergencyBrake) {
                    console.log("   🚨 EMERGENCY BRAKE ENGAGED!");
                }
                if (camMessage.collisionWarning) {
                    console.log("   ⚠️  COLLISION WARNING!");
                }
                
            } catch (error) {
                console.log(`📨 [${topic}] Raw CAM (validation failed):`, messageStr.slice(0, 200) + "...");
                console.log(`   Validation error: ${error instanceof Error ? error.message : error}`);
            }
        } 
        else if (topic.includes("/spatem")) {
            try {
                const spatemMessage = SPATEMSchema.parse(messageData);
                console.log(`🚦 [${topic}] SPATEM Message:`);
                spatemMessage.intersections.forEach(intersection => {
                    console.log(`   Intersection ID: ${intersection.id.id}`);
                    intersection.states.forEach(state => {
                        const phaseState = getSignalPhaseString(state["state-time-speed"][0]?.eventState);
                        const timing = state["state-time-speed"][0]?.timing;
                        console.log(`   Signal Group ${state.signalGroup}: ${phaseState}${timing ? ` (ends: ${timing.minEndTime})` : ""}`);
                    });
                });
                
            } catch (error) {
                console.log(`📨 [${topic}] Raw SPATEM (validation failed):`, messageStr.slice(0, 200) + "...");
                console.log(`   Validation error: ${error instanceof Error ? error.message : error}`);
            }
        }
        else if (topic.includes("/mapem")) {
            try {
                const mapemMessage = MAPEMSchema.parse(messageData);
                console.log(`🗺️  [${topic}] MAPEM Message:`);
                mapemMessage.intersections.forEach(intersection => {
                    console.log(`   Intersection ID: ${intersection.id.id}`);
                    console.log(`   Reference Point: ${intersection.refPoint.lat}, ${intersection.refPoint.long}`);
                    console.log(`   Lanes: ${intersection.laneSet.length}`);
                });
                
            } catch (error) {
                console.log(`📨 [${topic}] Raw MAPEM (validation failed):`, messageStr.slice(0, 200) + "...");
                console.log(`   Validation error: ${error instanceof Error ? error.message : error}`);
            }
        }
        else {
            // Other topics - show raw
            console.log(`📨 [${topic}]:`, messageStr.slice(0, 200) + (messageStr.length > 200 ? "..." : ""));
        }
        
    } catch (parseError) {
        console.log(`📨 [${topic}] (not JSON):`, messageStr.slice(0, 100) + "...");
    }
});

client.on("error", (error) => {
    console.error("❌ MQTT connection error:", error);
});

client.on("close", () => {
    console.log("🔌 MQTT connection closed");
});

client.on("offline", () => {
    console.log("📴 MQTT client offline");
});

// Helper functions
function getStationTypeString(stationType: number): string {
    const typeMap: Record<number, string> = {
        [StationType.UNKNOWN]: "Unknown",
        [StationType.PEDESTRIAN]: "Pedestrian",
        [StationType.CYCLIST]: "Cyclist",
        [StationType.MOPED]: "Moped",
        [StationType.MOTORCYCLE]: "Motorcycle",
        [StationType.PASSENGER_CAR]: "Car",
        [StationType.BUS]: "Bus",
        [StationType.LIGHT_TRUCK]: "Light Truck",
        [StationType.HEAVY_TRUCK]: "Heavy Truck",
        [StationType.TRAILER]: "Trailer",
        [StationType.SPECIAL_VEHICLES]: "Special Vehicle",
        [StationType.TRAM]: "Tram",
        [StationType.ROAD_SIDE_UNIT]: "RSU"
    };
    return typeMap[stationType] || `Type ${stationType}`;
}

function getSignalPhaseString(eventState: number): string {
    const phaseMap: Record<number, string> = {
        [SignalPhaseState.UNAVAILABLE]: "UNAVAILABLE",
        [SignalPhaseState.DARK]: "DARK",
        [SignalPhaseState.STOP_THEN_PROCEED]: "STOP_THEN_PROCEED (Flashing Red)",
        [SignalPhaseState.STOP_AND_REMAIN]: "STOP_AND_REMAIN (Red)",
        [SignalPhaseState.PRE_MOVEMENT]: "PRE_MOVEMENT (Red+Yellow)",
        [SignalPhaseState.PERMISSIVE_MOVEMENT_ALLOWED]: "PERMISSIVE (Flashing Yellow)",
        [SignalPhaseState.PROTECTED_MOVEMENT_ALLOWED]: "PROTECTED (Green)",
        [SignalPhaseState.YELLOW_CHANGE_A]: "YELLOW_CHANGE_A",
        [SignalPhaseState.YELLOW_CHANGE_B]: "YELLOW_CHANGE_B",
        [SignalPhaseState.RED_CLEARANCE]: "RED_CLEARANCE"
    };
    return phaseMap[eventState] || `State ${eventState}`;
}

// Keep the process running
process.on('SIGINT', () => {
    console.log("\n👋 Closing MQTT connection...");
    client.end();
    process.exit(0);
});