import type { Game } from "../game";

import { type ObjectCategory } from "../../../../common/src/constants";
import { type ObjectType } from "../../../../common/src/utils/objectType";
import { type GunDefinition } from "../../../../common/src/definitions/guns";
import { type Vector, vAdd, v, vClone, vMul } from "../../../../common/src/utils/vector";
import { SuroiSprite, toPixiCords } from "../utils/pixi";
import { distance, distanceSquared } from "../../../../common/src/utils/math";
import { Obstacle } from "./obstacle";
import { Player } from "./player";
import { type GameObject } from "../types/gameObject";
import { PIXI_SCALE } from "../utils/constants";

export class Bullet {
    game: Game;
    image: SuroiSprite;

    source: ObjectType<ObjectCategory.Loot, GunDefinition>;

    definition: GunDefinition["ballistics"];

    initialPosition: Vector;
    position: Vector;

    maxLength: number;

    rotation: number;

    speed: Vector;

    dead = false;

    trailReachedMaxLength = false;

    trailTicks = 0;

    maxDistance: number;

    reflectCount: number;

    reflectedFromID: number;

    constructor(game: Game, source: ObjectType<ObjectCategory.Loot, GunDefinition>, position: Vector, rotation: number, maxDistance: number, reflectCount: number, reflectedFromID = -1) {
        this.game = game;

        this.source = source;
        this.definition = this.source.definition.ballistics;

        this.initialPosition = position;

        this.position = vClone(this.initialPosition);

        this.rotation = rotation;

        this.reflectCount = reflectCount;

        this.reflectedFromID = reflectedFromID;

        this.maxDistance = maxDistance;

        this.speed = vMul(v(Math.sin(rotation), -Math.cos(rotation)), this.definition.speed);

        this.image = new SuroiSprite(`${this.source.definition.ammoType}_trail.svg`)
            .setRotation(rotation - Math.PI / 2)
            .setVPos(toPixiCords(this.position));

        this.maxLength = this.image.width;

        this.image.scale.set(0, this.definition.tracerWidth ?? 1);

        this.image.anchor.set(1, 0.5);

        this.image.alpha = (this.definition.tracerOpacity ?? 1) / (reflectCount + 1);

        this.game.bulletsContainer.addChild(this.image);
    }

    update(delta: number): void {
        const oldPosition = vClone(this.position);

        if (this.dead) this.trailTicks -= delta;
        else {
            if (!this.trailReachedMaxLength) this.trailTicks += delta;
            this.position = vAdd(this.position, vMul(this.speed, delta));
        }

        const collisions: Array<{ pos: Vector, object: GameObject }> = [];

        if (!this.dead) {
            for (const o of this.game.objects) {
                const object = o[1];

                if ((object instanceof Obstacle || object instanceof Player) && !object.dead && object.id !== this.reflectedFromID) {
                    const intersection = object.hitbox.intersectsLine(oldPosition, this.position);
                    if (!intersection) continue;

                    collisions.push({ pos: intersection.point, object });
                }
            }

            collisions.sort((a, b) => {
                return distanceSquared(a.pos, this.initialPosition) - distanceSquared(b.pos, this.initialPosition);
            });

            for (const collision of collisions) {
                const object = collision.object;
                if (object instanceof Obstacle && (object.type.definition.noCollisions)) continue;

                this.dead = true;
                this.position = collision.pos;
                break;
            }
        }

        const dist = distance(this.initialPosition, this.position);

        if (dist > this.maxDistance) {
            this.position = vAdd(this.initialPosition, (vMul(v(Math.sin(this.rotation), -Math.cos(this.rotation)), this.maxDistance)));
            this.dead = true;
        }

        const fadeDist = this.definition.speed * this.trailTicks;

        const length = Math.min(Math.min(fadeDist, dist) * PIXI_SCALE, this.maxLength);

        if (length === this.maxLength) this.trailReachedMaxLength = true;

        const scale = length / this.maxLength;

        this.image.scale.x = scale;

        this.image.setVPos(toPixiCords(this.position));

        if (this.trailTicks <= 0 && this.dead) {
            this.destroy();
        }
    }

    destroy(): void {
        this.image.destroy();
        this.game.bullets.delete(this);
    }
}
