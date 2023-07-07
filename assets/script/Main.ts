/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-17 13:43:02
 */
import { _decorator, profiler } from 'cc';
import { DEBUG } from 'cc/env';
import { oops } from '../../extensions/oops-plugin-framework/assets/core/Oops';
import { Root } from '../../extensions/oops-plugin-framework/assets/core/Root';
import { ecs } from '../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { smc } from './game/common/SingletonModuleComp';
import { UIConfigData } from './game/common/config/GameUIConfig';
import { Initialize } from './game/initialize/Initialize';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected async run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
    }

    protected initEcsSystem() {

    }
}