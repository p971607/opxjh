/*
 * @Author: dgflash
 * @Date: 2022-08-04 15:08:35
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 15:26:38
 */
import { _decorator, sp } from "cc";
import AnimatorSpine from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/AnimatorSpine";
import Charactor, { CharactorDirection } from "../../map_ori/view/map/charactor/Charactor";

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 
 * Spine状态机组件（主状态机），trackIndex为0
 */
@ccclass
@disallowMultiple
@requireComponent(sp.Skeleton)
export default class RoleSpineAnimator extends AnimatorSpine {
    private charactor!: Charactor;
    private dir: CharactorDirection = CharactorDirection.bottom;
    private animName: string = "Stand";
    private loop: boolean = true;

    start() {
        this.charactor = this.node.parent!.getComponent(Charactor)!;
        super.start();
    }

    lateUpdate(dt: number) {
        if (this.dir != this.charactor.direction) {
            this.dir = this.charactor.direction;
            this.playAnimation(this.animName, this.loop);
        }
    }

    /**
     * 播放动画
     * @override
     * @param animName 动画名
     * @param loop 是否循环播放
     */
    protected playAnimation(animName: string, loop: boolean) {
        if (animName) {
            this.animName = animName;
            this.loop = loop;

            animName = `huaxian/${this.getDirection(this.charactor.direction)}${animName}`;
            this._spine.setAnimation(0, animName, loop);
        }
        else {
            this._spine.clearTrack(0);
        }
    }

    private getDirection(dir: CharactorDirection): string {
        let dirName = "";
        if (dir == CharactorDirection.up) {
            dirName = "back";
        }
        else if (dir == CharactorDirection.bottom) {
            dirName = "positive";
        }
        else if (dir == CharactorDirection.left || dir == CharactorDirection.left_up || dir == CharactorDirection.left_bottom) {
            dirName = "side";
        }
        else if (dir == CharactorDirection.right || dir == CharactorDirection.right_up || dir == CharactorDirection.right_bottom) {
            dirName = "side";
        }
        return dirName;
    }
}