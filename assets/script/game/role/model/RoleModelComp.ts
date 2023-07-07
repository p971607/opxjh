/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-17 13:43:25
 */
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";

/** 
 * 角色属性数据
 */
@ecs.register('RoleModel')
export class RoleModelComp extends ecs.Comp {
    /** 角色编号 */
    id: number = -1;

    /** 角色名 */
    name: string = "oops-framework";

    /** 动画名资源 */
    anim: string = "model1";

    reset() {
        this.id = -1;
        this.name = "";
    }
}
