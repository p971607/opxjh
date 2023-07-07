// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, CCInteger, CCString, Component, Label, _decorator, Vec3 } from "cc";
import SceneManager from "../../manager/scene/SceneManager";
import { MapLoadModel } from "../../map/base/MapLoadModel";
import { EditTransferData } from "../editObjData/EditObjData";
import Actor from "../unit/actor/base/Actor";
import Player, { PlayerType } from "../unit/actor/player/Player";
import { FogOfWar } from "../map/fogOfWar/FogOfWar";

const { ccclass, property } = _decorator;

/**
 * 传送门
 */
@ccclass('TransferDoor')
export default class TransferDoor extends Component {

    /**
     * 传送到目标地图Id
     */
    @property(CCString)
    public targetMapId: string = "";

    /**
     * 传送到目标地图的出生点Id
     */

    @property(CCInteger)
    public targetMapSpawnId: number = 0;

    /**
     * 魔法值
     */
    @property(Label)
    public nameTxt:Label = null;

    /**
     * 用于显示角色名字的接口
     */
     private _objName: string = "";
     public get objName(): string {
         return this._objName;
     }
     public set objName(value: string) {
         this._objName = value;
 
         if(this.nameTxt == null)
         {
             this.nameTxt = this.node.getChildByName("NameTxt")?.getComponent(Label);
         }
 
         if(this.nameTxt)
         {
             this.nameTxt.string = this._objName;
         }
     }

    /**
     * 编辑的数据
     */
    private editData:EditTransferData = null;

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        //this.node.opacity = 0;
        if(FogOfWar.instance != null)
        {
            FogOfWar.instance.drawOval(this.node.position.x, this.node.position.y + 50, 100, 125);
        }
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
    public initEditData(editData:EditTransferData)
    {
        this.editData = editData;

        this.objName = editData.objName;
        this.node.position = new Vec3(editData.x,editData.y);

        this.targetMapId = editData.targetMapId;
        this.targetMapSpawnId = editData.targetMapSpawnId;
    }

    // update (dt) {}

    public toString()
    {
        return this.targetMapId + "," + this.targetMapSpawnId;
    }

    /**
     * 角色进入传送门
     * @param callback 
     */
    public onTriggerEnter(actor:Actor)
    {
        var player = actor as Player;
        if(player != null)
        {
            if(player.playerType == PlayerType.my) //如果玩家是我的，跳转地图
            {
                SceneManager.instance.loadMap(this.targetMapId,this.targetMapSpawnId,MapLoadModel.slices);
            }
        }
    }

    /**
     * 角色从传送们出来
     * @param callback 
     */
    public onTriggerExit(actor:Actor)
    {
        
    }
}
