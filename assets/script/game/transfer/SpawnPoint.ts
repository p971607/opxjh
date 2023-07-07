// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, CCInteger, Component, _decorator, Vec3 } from "cc";
import { EditSpawnPointData } from "../editObjData/EditObjData";

const { ccclass, property } = _decorator;

/**
 * 地图出生点
 */
@ccclass('SpawnPoint')
export default class SpawnPoint extends Component {

    /**
     * 在本地图，出生点Id
     */
    @property(CCInteger)
    public spawnId: number = 0;

    /**
     * 是否是默认出生点
     */
    @property(CCInteger)
    public defaultSpawn:boolean = false
    
    /**
     * 编辑的数据
     */
    private editData:EditSpawnPointData = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.node.opacity = 0;
    }

    /**
     * 初始化
     */
    public init()
    {

    }

    /**
     * 初始化编辑数据
     * @param editData 
     */
    public initEditData(editData:EditSpawnPointData)
    {
        this.editData = editData;

        this.node.position = new Vec3(editData.x,editData.y);

        this.spawnId = editData.spawnId;
        this.defaultSpawn = editData.defaultSpawn;
    }

    // update (dt) {}
}
