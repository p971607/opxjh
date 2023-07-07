import { EventTouch, Vec3 } from "cc";
import { CharactorDirection, CharactorState } from "./Charactor";

export interface ICharactorClip {
    setDirection(value: CharactorDirection): void;
    setState(value: CharactorState): void;
    setAlpha(value: number): void;
    setPos(value: Vec3): void;
    checkTouch(event: EventTouch): boolean;
}