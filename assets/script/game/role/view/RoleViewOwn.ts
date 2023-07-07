/*
 * @Author: dgflash
 * @Date: 2022-08-04 15:08:35
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 15:28:02
 */

import { Component, _decorator, v3 } from "cc";
import { smc } from "../../common/SingletonModuleComp";
import Charactor from "../../map_ori/view/map/charactor/Charactor";
import MapRoadUtils from "../../map_ori/view/map/road/MapRoadUtils";
import RoadNode from "../../map_ori/view/map/road/RoadNode";

const { ccclass, property } = _decorator;

@ccclass('RoleViewOwn')
export class RoleViewOwn extends Component {
    private charactor!: Charactor;

    onLoad() {
        this.charactor = this.getComponent(Charactor)!;
        this.node.on(Charactor.NextRoadNode, this.onNextRoadNode, this);
    }

    private onNextRoadNode(rn: RoadNode) {
        var key: string = rn.dx + "," + rn.dy;
        var mv = smc.map.MapView;
        var delivery = mv.deliverys.get(key);
        if (delivery && mv.isTransfer == false) {
            this.charactor.stop();
            mv.transfer(delivery.toMapId, this.aStarToVec3(delivery.start));
        }
    }

    private aStarToVec3(str: string) {
        let array = str.split(",");
        let x = parseInt(array[0]);
        let y = parseInt(array[1]);
        let p = MapRoadUtils.instance.getPixelByDerect(x, y);
        return v3(p.x, p.y);
    }
}
