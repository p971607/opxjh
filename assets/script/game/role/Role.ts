
/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:47:56
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 15:43:04
 */
import { instantiate, Node, Prefab, Vec3 } from "cc";
import { UICallbacks } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../common/config/GameUIConfig";
import { smc } from "../common/SingletonModuleComp";
import Charactor from "../map_ori/view/map/charactor/Charactor";
import { RoleModelComp } from "./model/RoleModelComp";
import { RoleSpine } from "./view/RoleSpine";
import { RoleViewComp } from "./view/RoleViewComp";
import { RoleViewUIControllerComp } from "./view/RoleViewUIControllerComp";

/** 角色实体 */
@ecs.register(`Role`)
export class Role extends ecs.Entity {
    // 数据层
    RoleModel!: RoleModelComp;
    // 视图层
    RoleView!: RoleViewComp;
    RoleViewUIController!: RoleViewUIControllerComp;

    protected init() {
        this.addComponents<ecs.Comp>(
            RoleModelComp);
    }

    destroy(): void {
        this.remove(RoleViewComp);
        super.destroy();
    }

    /** 加载角色 */
    load(pos: Vec3 = Vec3.ZERO, isOwn: boolean = false) {
        var path = isOwn ? "game/player/own" : "game/player/player";

        var prefab: Prefab = oops.res.get(path, Prefab)!;
        var node = instantiate(prefab);

        var mv = node.getComponent(RoleViewComp)!;
        this.add(mv);

        var as = node.getComponent(RoleSpine);
        as.setPlayer(pos);

        if (isOwn) {
            smc.map.MapView.scene.setPlayer(node.getComponent(Charactor));
        }
    }

    /** 摇撼控制 */
    loadJoystick() {
        var uic: UICallbacks = {
            onAdded: (node: Node, params: any) => {
                var comp = node.getComponent(RoleViewUIControllerComp) as ecs.Comp;
                this.add(comp);
            }
        };
        oops.gui.open(UIID.Role_Controller, null, uic);
    }
    removeJoystick() {
        oops.gui.remove(UIID.Role_Controller);
    }
}