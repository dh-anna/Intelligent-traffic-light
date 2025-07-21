/**
 * Generated C-ITS Message Types
 * 
 * Auto-generated from ETSI ASN.1 specifications
 * Generated on: 2025-07-21T12:32:35.967697
 * Source: vanetza-nap ASN.1 definitions
 * 
 * DO NOT MODIFY - This file is auto-generated
 */

import { z } from "zod";


// ETSI Standard Constants

export const SignalPhaseState = {
  UNAVAILABLE: 0,
  DARK: 1, 
  STOP_THEN_PROCEED: 2,     // flashing red
  STOP_AND_REMAIN: 3,       // red
  PRE_MOVEMENT: 4,          // red+yellow
  PERMISSIVE_MOVEMENT_ALLOWED: 5,  // flashing yellow
  PROTECTED_MOVEMENT_ALLOWED: 6,   // green
  YELLOW_CHANGE_A: 7,       // yellow
  YELLOW_CHANGE_B: 8,       // yellow
  RED_CLEARANCE: 9          // red clearance
} as const;

export const StationType = {
  UNKNOWN: 0,
  PEDESTRIAN: 1,
  CYCLIST: 2,
  MOPED: 3,
  MOTORCYCLE: 4,
  PASSENGER_CAR: 5,
  BUS: 6,
  LIGHT_TRUCK: 7,
  HEAVY_TRUCK: 8,
  TRAILER: 9,
  SPECIAL_VEHICLES: 10,
  TRAM: 11,
  ROAD_SIDE_UNIT: 15
} as const;

export const DriveDirection = {
  FORWARD: 0,
  BACKWARD: 1,
  UNAVAILABLE: 2
} as const;

// Basic Zod Schemas (based on vanetza-nap examples)

export const CAMSchema = z.object({
  driveDirection: z.enum(["FORWARD", "BACKWARD", "UNAVAILABLE"]),
  timestamp: z.number(),
  newInfo: z.boolean(),
  rssi: z.number(),
  stationID: z.number(),
  stationAddr: z.string(),
  receiverID: z.number(),
  receiverType: z.number(),
  packet_size: z.number(),
  generationDeltaTime: z.number(),
  stationType: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  semiMajorConf: z.number(),
  semiMinorConf: z.number(),
  semiMajorOrient: z.number(),
  altitude: z.number(),
  altitudeConf: z.number(),
  heading: z.number(),
  headingConf: z.number(),
  speed: z.number(),
  speedConf: z.number(),
  length: z.number(),
  width: z.number(),
  acceleration: z.number(),
  curvature: z.number(),
  yawRate: z.number(),
  brakePedal: z.boolean(),
  gasPedal: z.boolean(),
  emergencyBrake: z.boolean(),
  collisionWarning: z.boolean(),
  accEngaged: z.boolean(),
  cruiseControl: z.boolean(),
  speedLimiter: z.boolean(),
  specialVehicle: z.any().nullable(),
  test: z.object({
    start_processing_timestamp: z.number().optional(),
    json_timestamp: z.number(),
    wave_timestamp: z.number().optional(),
  }),
});

export const SPATEMSchema = z.object({
  intersections: z.array(z.object({
    id: z.object({ id: z.number() }),
    revision: z.number(),
    states: z.array(z.object({
      signalGroup: z.number(),
      "state-time-speed": z.array(z.object({
        eventState: z.number(),
        timing: z.object({
          minEndTime: z.number(),
          maxEndTime: z.number().optional()
        }).optional()
      }))
    })),
    status: z.object({
      failureFlash: z.boolean(),
      failureMode: z.boolean(),
      fixedTimeOperation: z.boolean(),
      manualControlIsEnabled: z.boolean(),
      noValidMAPisAvailableAtThisTime: z.boolean(),
      noValidSPATisAvailableAtThisTime: z.boolean(),
      off: z.boolean(),
      preemptIsActive: z.boolean(),
      recentChangeInMAPassignedLanesIDsUsed: z.boolean(),
      recentMAPmessageUpdate: z.boolean(),
      signalPriorityIsActive: z.boolean(),
      standbyOperation: z.boolean(),
      stopTimeIsActivated: z.boolean(),
      trafficDependentOperation: z.boolean()
    })
  }))
});

export const MAPEMSchema = z.object({
  intersections: z.array(z.object({
    id: z.object({ id: z.number() }),
    revision: z.number(),
    refPoint: z.object({
      lat: z.number(),
      long: z.number()
    }),
    laneSet: z.array(z.object({
      laneID: z.number(),
      laneAttributes: z.object({
        directionalUse: z.object({
          egressPath: z.boolean(),
          ingressPath: z.boolean()
        }),
        laneType: z.object({
          vehicle: z.object({
            hasIRbeaconCoverage: z.boolean(),
            hovLaneUseOnly: z.boolean(),
            isVehicleFlyOverLane: z.boolean(),
            isVehicleRevocableLane: z.boolean(),
            permissionOnRequest: z.boolean(),
            restrictedFromPublicUse: z.boolean(),
            restrictedToBusUse: z.boolean(),
            restrictedToTaxiUse: z.boolean()
          })
        }),
        sharedWith: z.object({
          busVehicleTraffic: z.boolean(),
          cyclistVehicleTraffic: z.boolean(),
          individualMotorizedVehicleTraffic: z.boolean(),
          multipleLanesTreatedAsOneLane: z.boolean(),
          otherNonMotorizedTrafficTypes: z.boolean(),
          overlappingLaneDescriptionProvided: z.boolean(),
          pedestriansTraffic: z.boolean(),
          pedestrianTraffic: z.boolean(),
          taxiVehicleTraffic: z.boolean(),
          trackedVehicleTraffic: z.boolean()
        })
      }),
      connectsTo: z.array(z.object({
        connectingLane: z.object({
          lane: z.number(),
          maneuver: z.object({
            caution: z.boolean(),
            goWithHalt: z.boolean(),
            maneuverLaneChangeAllowed: z.boolean(),
            maneuverLeftAllowed: z.boolean(),
            maneuverLeftTurnOnRedAllowed: z.boolean(),
            maneuverNoStoppingAllowed: z.boolean(),
            maneuverRightAllowed: z.boolean(),
            maneuverRightTurnOnRedAllowed: z.boolean(),
            maneuverStraightAllowed: z.boolean(),
            maneuverUTurnAllowed: z.boolean(),
            reserved1: z.boolean(),
            yieldAllwaysRequired: z.boolean()
          })
        }),
        signalGroup: z.number()
      })).optional(),
      nodeList: z.object({
        nodes: z.array(z.object({
          delta: z.object({
            "node-LatLon": z.object({
              lat: z.number(),
              lon: z.number()
            })
          })
        }))
      })
    })),
    laneWidth: z.number().optional(),
    speedLimits: z.array(z.object({
      speed: z.number(),
      type: z.number()
    })).optional()
  })),
  msgIssueRevision: z.number()
});

export const DENMSchema = z.object({
  // Basic DENM structure - can be extended
  management: z.object({
    actionID: z.object({
      originatingStationID: z.number(),
      sequenceNumber: z.number()
    }),
    detectionTime: z.number(),
    referenceTime: z.number(),
    eventPosition: z.object({
      latitude: z.number(),
      longitude: z.number(),
      positionConfidenceEllipse: z.object({
        semiMajorConfidence: z.number(),
        semiMinorConfidence: z.number(),
        semiMajorOrientation: z.number()
      }),
      altitude: z.object({
        altitudeValue: z.number(),
        altitudeConfidence: z.number()
      })
    }),
    relevanceDistance: z.number().optional(),
    relevanceTrafficDirection: z.number().optional(),
    validityDuration: z.number().optional(),
    stationType: z.number()
  }),
  situation: z.object({
    informationQuality: z.number(),
    eventType: z.object({
      causeCode: z.number(),
      subCauseCode: z.number()
    }),
    linkedCause: z.object({
      causeCode: z.number(),
      subCauseCode: z.number()
    }).optional()
  }).optional(),
  location: z.object({}).optional(),
  alacarte: z.object({}).optional()
});

// Type exports
export type CAMMessage = z.infer<typeof CAMSchema>;
export type SPATEMMessage = z.infer<typeof SPATEMSchema>;  
export type MAPEMMessage = z.infer<typeof MAPEMSchema>;
export type DENMMessage = z.infer<typeof DENMSchema>;

// Validation Functions

export const validateMessage = (messageType: string, data: unknown) => {
  switch (messageType.toLowerCase()) {
    case 'cam':
      return CAMSchema.parse(data);
    case 'spatem':
      return SPATEMSchema.parse(data);
    case 'mapem':
      return MAPEMSchema.parse(data);
    case 'denm':
      return DENMSchema.parse(data);
    default:
      throw new Error(`Unknown message type: ${messageType}`);
  }
};

export const isValidMessage = (messageType: string, data: unknown): boolean => {
  try {
    validateMessage(messageType, data);
    return true;
  } catch {
    return false;
  }
};

