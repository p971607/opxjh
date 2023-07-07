/*
 * @Author: dgflash
 * @Date: 2022-08-04 15:08:35
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 15:26:26
 */
import { Color, Component, EventTouch, Vec3, _decorator, sp } from "cc";
import { LayerUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/LayerUtil";
import { smc } from "../../common/SingletonModuleComp";
import Charactor, { CharactorDirection, CharactorState } from "../../map_ori/view/map/charactor/Charactor";
import { ICharactorClip } from "../../map_ori/view/map/charactor/ICharactorClip";
import RoleSpineAnimator from "./RoleSpineAnimator";

const { ccclass, property } = _decorator;

/** 
 * ＲＰＧ ＳＰＩＮＥ角色模型
 */
@ccclass('RoleSpine')
export class RoleSpine extends Component implements ICharactorClip {
    @property({ type: RoleSpineAnimator, tooltip: '动画控制器' })
    animator: RoleSpineAnimator = null!;

    private spine!: sp.Skeleton;
    private charactor!: Charactor;

    onLoad() {
        // 角色控制组件
        this.charactor = this.addComponent(Charactor)!;

        this.initAnimator();

        LayerUtil.setNodeLayer(LayerUtil.MAP, this.node);
    }

    /** 初始化动画 */
    protected initAnimator() {
        this.spine = this.animator.getComponent(sp.Skeleton)!;
    }

    setPlayer(pos: Vec3) {
        var scene = smc.map.MapView.scene;
        this.node.parent = scene.entityLayer!.node!;
        this.charactor.clip = this;
        this.charactor.sceneMap = scene;
        this.charactor.pos = pos;
        this.charactor.updateZIndex();
    }

    setDirection(value: CharactorDirection): void {
        if (value > 4) {
            this.animator!.node.setScale(-1, 1, 1);
        }
        else {
            this.animator!.node.setScale(1, 1, 1);
        }
    }

    setState(value: CharactorState): void {
        switch (value) {
            case CharactorState.Idle:
                this.idle();
                break;
            case CharactorState.Run:
                this.walk();
                break;
        }
    }

    setAlpha(value: number): void {
        var color: Color = this.spine.color;
        color.a = 255 * (value / 1);
        this.spine.color = color;
    }

    setPos(value: Vec3): void {
        this.node.position = value;
    }

    checkTouch(event: EventTouch): boolean {
        return false;
    }

    onDestroy() {
        this.node.destroy();
    }

    walk() {
        this.animator!.setNumber("Speed", 1);
    }

    idle() {
        this.animator!.setNumber("Speed", 0);
    }
}
