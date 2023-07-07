// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, instantiate, Prefab, Vec3, _decorator } from "cc";
import RoadSign from "../../game/map/roadSign/RoadSign";
import SpawnPoint from "../../game/transfer/SpawnPoint";
import TransferDoor from "../../game/transfer/TransferDoor";

const { ccclass, property } = _decorator;

/**
 * 杂货管理,管理一些不好归类的零散资源
 */
 @ccclass('OtherManager')
export default class OtherManager extends Component {

    /**
     * 路标预制体
     */
    @property(Prefab)
    public roadSignPrefab:Prefab = null;

    /**
     * 出生点预制体
     */
    @property(Prefab)
    public spawnPointPrefab:Prefab = null;

    /**
     * 传送点预制体
     */
    @property(Prefab)
    public transferDoorPrefabs:Prefab[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    /**
     * 获得路标资源
     * @returns 
     */
    public getRoadSign():RoadSign
    {
        var rd:RoadSign = instantiate(this.roadSignPrefab).getComponent(RoadSign);
        rd.node.active = true;
        rd.node.position = new Vec3(0,0,0);
        
        return rd;
    }

    /**
     * 获得出生点资源
     * @returns 
     */
    public getSpawnPoint():SpawnPoint
    {
        var spawnPoint:SpawnPoint = instantiate(this.spawnPointPrefab).getComponent(SpawnPoint);
        spawnPoint.node.active = true;
        spawnPoint.node.position = new Vec3(0,0,0);
        
        return spawnPoint;
    }

     /**
     * 获得传送点资源
     * @returns 
     */
    public getTransferDoor(type:number):TransferDoor
    {
        var index:number = 0;

        if(type < this.transferDoorPrefabs.length)
        {
            index = type;
        }

        var transferDoor:TransferDoor = instantiate(this.transferDoorPrefabs[index]).getComponent(TransferDoor);
        transferDoor.node.active = true;
        transferDoor.node.position = new Vec3(0,0,0);
        
        return transferDoor;
    }
}
