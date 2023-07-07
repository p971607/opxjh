import { JsonAsset, Node, Prefab, Texture2D, Vec3, _decorator, instantiate, v3 } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Logger } from "../../../../../extensions/oops-plugin-framework/assets/core/common/log/Logger";
import { LayerUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/LayerUtil";
import { StringUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/StringUtil";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { smc } from "../../common/SingletonModuleComp";
import { Role } from "../../role/Role";
import { MapModelComp } from "../model/MapModelComp";
import { MapViewScene } from "./MapViewScene";
import MapData from "./map/base/MapData";
import { MapLoadModel } from "./map/base/MapLoadModel";
import MapRoadUtils from "./map/road/MapRoadUtils";

const { ccclass, property } = _decorator;

@ccclass('MapViewComp')
@ecs.register('MapView', false)
export class MapViewComp extends CCComp {
    scene: MapViewScene = null!;

    /** 是否正在转场 */
    isTransfer = false;

    /** 当前地图数据 */
    current_map: any;
    /** 转场碰撞点对象集合 */
    deliverys: Map<string, any> = new Map();

    private map_data: any;                                          // 地图配置
    private map_delivery: any;                                      // 转场点配置

    reset(): void {

    }

    start() {
        this.scene = this.getComponent(MapViewScene);
        this.loadRes();
    }

    /** 转场 */
    transfer(id: number, start: Vec3) {
        this.deliverys.clear();

        if (smc.own) {
            smc.own.RoleView.runJoystick(Vec3.ZERO);
            smc.own.removeJoystick();
        }

        this.loadMap(id, () => {
            this.addHero(start);
            smc.own.loadJoystick();
        });
    }

    private async loadRes() {
        // await oops.res.loadBundle(GameConfig.remote_res_server, GameConfig.remote_resb_md5);

        // 加载地图配置与转场点配置
        var mm = this.ent.get(MapModelComp);
        oops.res.loadDir("config", (err: Error | null) => {
            var map: any = oops.res.get(mm.resConfigMap, JsonAsset);
            var map_delivery: any = oops.res.get(mm.resDeliveryMap, JsonAsset);
            this.map_data = map.json;
            this.map_delivery = map_delivery.json;
            this.loadMap(mm.id, () => {
                this.addHero();
            });
        });
    }

    /** 加载地图 */
    private loadMap(id: number, callback?: Function) {
        this.isTransfer = true;

        // 设置当前所在地图
        this.current_map = this.map_data[id];

        // 加载地图
        this.loadSlicesMap(this.current_map.name, callback);
    }

    /**
     * 加载分切片地图
     */
    protected loadSlicesMap(mapName: string, callback?: Function) {
        var mm = this.ent.get(MapModelComp);

        // oops.res.load(GameConfig.remote_bundle_name, `maps/${mapName}/${mapName}`, JsonAsset, (err: Error | null, res: JsonAsset) => {
        oops.res.load(mm.getResContentData(mapName), JsonAsset, (err: Error | null, res: JsonAsset) => {
            if (err) {
                console.error(err);
            }
            var mapData: MapData = res.json as MapData;
            // oops.res.load(GameConfig.remote_bundle_name, `maps/${mapName}/${mapName}/miniMap/texture`, Texture2D, (err: Error | null, tex: Texture2D) => {
            oops.res.load(mm.getResContentMiniMap(mapName), Texture2D, (err: Error | null, tex: Texture2D) => {
                if (err) {
                    console.error(err);
                }

                // 显示地图
                this.scene!.node.active = true;
                this.scene!.init(mapData, tex, MapLoadModel.slices);

                // 地图加载完成
                this.mapLoaded();

                callback && callback();

                this.isTransfer = false;
            });
        });
    }

    private mapLoaded() {
        this.addDelivery();
    }

    /** 添加玩家 */
    private addHero(pos?: Vec3) {
        if (pos == null) {
            this.scene.node.active = true
            smc.own = ecs.getEntity<Role>(Role);
            smc.own.load(this.aStarToVec3("25,267"), true);
            smc.own.loadJoystick();

            // 测试玩家
            var test = ecs.getEntity<Role>(Role);
            test.load(this.aStarToVec3("25,267"), false);
        }
        else {
            this.scene.setPlayer(pos);
        }
    }

    private aStarToVec3(str: string) {
        let array = str.split(",");
        let x = parseInt(array[0]);
        let y = parseInt(array[1]);
        let p = MapRoadUtils.instance.getPixelByDerect(x, y);
        return v3(p.x, p.y);
    }

    /** 通过数据设置节点位置 */
    private setNodePos(data: any, prefab: Prefab, parent: Node, outTilePos?: Vec3): Node {
        let array = StringUtil.stringToArray1(data);
        let x = parseInt(array[0]);
        let y = parseInt(array[1]);

        if (outTilePos) outTilePos.set(x, y);

        let node = instantiate(prefab)!;
        node.setParent(parent);

        let pos = MapRoadUtils.instance.getPixelByDerect(x, y);
        node.setPosition(v3(pos.x, pos.y));
        LayerUtil.setNodeLayer(LayerUtil.MAP, node);

        return node;
    }

    /** 添加转场点 */
    private addDelivery() {
        var prefab: Prefab = oops.res.get("game/delivery/delivery", Prefab)!;
        var datas = StringUtil.stringToArray1(this.current_map.delivery);
        datas.forEach((id: any) => {
            let d = this.map_delivery[id];
            let tilePos = new Vec3();
            this.setNodePos(d.pos, prefab, this.scene.floorLayer!, tilePos);
            this.createCollisionPoint(this.deliverys, tilePos, d);
        });
        Logger.logView(`本地图共有${datas.length}个转场点`);
    }

    /** 生成碰撞点 */
    private createCollisionPoint(map: any, tilePos: Vec3, data: any) {
        let center: string = `${tilePos.x},${tilePos.y}`;
        let top: string = `${tilePos.x},${tilePos.y + 1}`;
        let bottom: string = `${tilePos.x},${tilePos.y - 1}`;
        let left: string = `${tilePos.x - 1},${tilePos.y}`;
        let left_top: string = `${tilePos.x - 1},${tilePos.y + 1}`;
        let left_bottom: string = `${tilePos.x - 1},${tilePos.y - 1}`;
        let right: string = `${tilePos.x + 1},${tilePos.y}`;
        let right_top: string = `${tilePos.x + 1},${tilePos.y + 1}`;
        let right_bottom: string = `${tilePos.x + 1},${tilePos.y - 1}`;
        map.set(center, data);
        map.set(top, data);
        map.set(bottom, data);
        map.set(left, data);
        map.set(left_top, data);
        map.set(left_bottom, data);
        map.set(right, data);
        map.set(right_top, data);
        map.set(right_bottom, data);
    }
}
