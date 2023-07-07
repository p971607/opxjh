/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-17 12:36:18
 */

import { Vec3, _decorator } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import Charactor from "../../map_ori/view/map/charactor/Charactor";
import { RoleSpine } from "./RoleSpine";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewComp')                   // 定义为 Cocos Creator 组件
@ecs.register('RoleView', false)           // 定义为 ECS 组件
export class RoleViewComp extends CCComp {
    /** 角色动画 */
    as: RoleSpine = null!;
    /** 角色控制器 */
    charactor: Charactor = null!;

    /** 视图层逻辑代码分离演示 */
    onLoad() {
        this.as = this.getComponent(RoleSpine);
        this.charactor = this.getComponent(Charactor);
    }

    /**
    * 摇杆移动
    * @param dir     移动方向
    */
    runJoystick(dir: Vec3) {
        this.charactor.joystick(dir);
    }

    reset() {
        this.node.destroy();
    }
}