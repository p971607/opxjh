/*
 * @Author: dgflash
 * @Date: 2022-08-04 15:08:34
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 15:23:20
 */

import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";

@ecs.register('MapModel')
export class MapModelComp extends ecs.Comp {
    /** 初始地图编号 */
    id: number = 1;

    /** 地图数据配置 */
    resConfigMap: string = "config/map/map";

    /** 地图转场点数据配置 */
    resDeliveryMap: string = "config/map/map_delivery";

    /** 地图显示预制 */
    resPrefab: string = "game/map_ori/map_rpg";

    /** 地图内容资源 */
    getResContentMiniMap(mapName: string): string {
        return `content/map/${mapName}/${mapName}/miniMap/texture`;
    };

    /** 地图瓦片资源 */
    getResContentSlices(bgName: string, key: string): string {
        return `content/map/${bgName}/${bgName}/slices/${key}/texture`;
    };

    /** 地图数据资源 */
    getResContentData(mapName: string): string {
        return `content/map/${mapName}/${mapName}`;
    };

    reset() {

    }
}
