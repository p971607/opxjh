/*
 * @Author: dgflash
 * @Date: 2021-08-09 16:43:23
 * @LastEditTime: 2021-08-09 18:32:54
 * @LastEditors: Please set LastEditors
 * @Description: 地形类型
 * @FilePath: \Game\assets\script\core\libs\map\road\RoadType.ts
 */
export enum RoadType {
    /** 标准路 */
    Road = 0,
    /** 障碍物 */
    Obstacle = 1,
    /** 班透明路 */
    RoadTransparent = 2,
    /** 隐藏点 */
    Hidden = 3
}