/*
 * @Author: dgflash
 * @Date: 2022-02-12 11:02:21
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 15:20:55
 */
import { instantiate, Prefab } from "cc";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { MapModelComp } from "./model/MapModelComp";
import { MapViewComp } from "./view/MapViewComp";

/** 游戏地图 */
@ecs.register(`GameMap`)
export class GameMap extends ecs.Entity {
    MapModel!: MapModelComp;
    MapView!: MapViewComp;

    protected init(): void {
        this.addComponents<ecs.Comp>(
            MapModelComp);
    }

    /** 加载地图显示资源 */
    load() {
        oops.res.load(this.MapModel.resPrefab, Prefab, (err: Error | null, res: Prefab) => {
            if (err) {
                console.error(err);
            }
            var map = instantiate(res);
            map.parent = oops.game.root;

            this.add(map.getChildByName("map").getComponent(MapViewComp));
        });
    }
}