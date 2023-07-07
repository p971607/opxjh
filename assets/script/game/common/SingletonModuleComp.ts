/*
 * @Author: dgflash
 * @Date: 2021-11-18 14:20:46
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 15:46:16
 */

import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Initialize } from "../initialize/Initialize";
import { GameMap } from "../map/GameMap";
import { Role } from "../role/Role";

/** 游戏模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 游戏初始化模块 */
    initialize: Initialize = null!;
    /** 游戏地图 */
    map: GameMap = null!;
    /** 游戏主角 */
    own: Role = null;

    reset() { }
}

export var smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);