import { ObjectDefinitions, type BulletDefinition, type ObjectDefinition } from "../utils/objectDefinitions";

export interface ExplosionDefinition extends ObjectDefinition {
    readonly damage: number
    readonly obstacleMultiplier: number
    readonly radius: {
        readonly min: number
        readonly max: number
    }
    readonly cameraShake: {
        readonly duration: number
        readonly intensity: number
    }
    readonly animation: {
        readonly duration: number
        readonly tint: number
        readonly scale: number
    }
    readonly sound?: string // TODO: move the barrel and super barrel destroy sounds to explosion sounds

    readonly shrapnelCount: number
    readonly ballistics: BulletDefinition
    readonly decal?: string
}

export const Explosions = new ObjectDefinitions<ExplosionDefinition>(
    [
        {
            idString: "barrel_explosion",
            name: "Barrel",
            damage: 130,
            obstacleMultiplier: 2,
            radius: {
                min: 8,
                max: 25
            },
            cameraShake: {
                duration: 250,
                intensity: 50
            },
            animation: {
                duration: 1000,
                tint: 0x91140b,
                scale: 1.5
            },
            shrapnelCount: 10,
            ballistics: {
                damage: 10,
                obstacleMultiplier: 1,
                speed: 0.08,
                maxDistance: 20,
                variance: 1,
                shrapnel: true
            }
        },
        {
            idString: "stove_explosion",
            name: "Stove",
            damage: 130,
            obstacleMultiplier: 2,
            radius: {
                min: 8,
                max: 25
            },
            cameraShake: {
                duration: 250,
                intensity: 50
            },
            animation: {
                duration: 1000,
                tint: 0xff5500,
                scale: 1.5
            },
            shrapnelCount: 10,
            ballistics: {
                damage: 10,
                obstacleMultiplier: 1,
                speed: 0.08,
                maxDistance: 20,
                variance: 1,
                shrapnel: true
            }
        },
        {
            idString: "super_barrel_explosion",
            name: "Super Barrel",
            damage: 160,
            obstacleMultiplier: 3,
            radius: {
                min: 12,
                max: 36
            },
            cameraShake: {
                duration: 500,
                intensity: 100
            },
            animation: {
                duration: 1500,
                tint: 0xff0000,
                scale: 2.5
            },
            shrapnelCount: 20,
            ballistics: {
                damage: 10,
                obstacleMultiplier: 2,
                speed: 0.08,
                maxDistance: 30,
                variance: 1,
                shrapnel: true
            }
        },
        {
            idString: "small_refinery_barrel_explosion",
            name: "Small Refinery Barrel",
            damage: 200,
            obstacleMultiplier: 3,
            radius: {
                min: 16,
                max: 40
            },
            cameraShake: {
                duration: 750,
                intensity: 100
            },
            animation: {
                duration: 1500,
                tint: 0x91140b,
                scale: 2.5
            },
            shrapnelCount: 25,
            ballistics: {
                damage: 12,
                obstacleMultiplier: 2,
                speed: 0.08,
                maxDistance: 30,
                variance: 1,
                shrapnel: true
            }
        },
        {
            idString: "large_refinery_barrel_explosion",
            name: "Large Refinery Barrel",
            damage: 10000,
            obstacleMultiplier: 3,
            radius: {
                min: 48,
                max: 58
            },
            cameraShake: {
                duration: 2000,
                intensity: 100
            },
            animation: {
                duration: 1500,
                tint: 0xff0000,
                scale: 5
            },
            shrapnelCount: 50,
            ballistics: {
                damage: 15,
                obstacleMultiplier: 3,
                speed: 0.08,
                maxDistance: 60,
                variance: 1,
                shrapnel: true
            }
        }
    ]
);
