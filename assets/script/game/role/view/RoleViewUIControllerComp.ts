/*
 * @Author: dgflash
 * @Date: 2022-02-12 13:38:13
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-17 12:36:31
 */

import { EventTouch, Vec3, _decorator } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { CCComp } from '../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp';
import { smc } from '../../common/SingletonModuleComp';
import { Role } from '../Role';
import { JoystickDataType, RoleViewUIJoystick, SpeedType } from './RoleViewUIJoystick';

const { ccclass, property } = _decorator;

@ccclass("RoleViewUIControllerComp")
@ecs.register('RoleViewUIController', false)
export class RoleViewUIControllerComp extends CCComp {
    @property({ type: RoleViewUIJoystick })
    joystick: RoleViewUIJoystick = null!;

    private target: Role = null!;

    start() {
        this.target = smc.own;
        this.joystick.onController = (event: EventTouch, data: JoystickDataType) => {
            switch (data.type) {
                case SpeedType.NORMAL:
                case SpeedType.FAST:
                    this.target.RoleView.runJoystick(data.vector);
                    break;
                case SpeedType.STOP:
                    this.target.RoleView.runJoystick(Vec3.ZERO);
                    break;
            }
        }
    }

    onDestroy() {
        this.ent.remove(RoleViewUIControllerComp);
        super.onDestroy();
    }

    reset(): void {

    }
}