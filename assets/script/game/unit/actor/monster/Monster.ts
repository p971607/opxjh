// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CCInteger, EventTouch, Node, Texture2D, Vec3, _decorator, resources } from "cc";
import { EditMonsterData } from "../../../editObjData/EditObjData";
import GameWorld from "../../../gameWorld/GameWorld";
import Actor2 from "../base/Actor2";

const { ccclass, property } = _decorator;

@ccclass('Monster')
export default class Monster extends Actor2 {

    @property(CCInteger)
    public monsterId:number = 0;

    /**
     * 编辑的数据
     */
    private editData:EditMonsterData = null;

    start () {
        super.start();
        this.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

    /**
     * 初始化
     */
    public init()
    {
        this.width = 100;
        this.height = 100;
        this.direction = this.defaultDir;
        
        this.loadRes();
    }

    /**
     * 初始化编辑数据
     * @param editData 
     */
    public initEditData(editData:EditMonsterData)
    {
        this.editData = editData;

        this.objName = editData.objName;
        this.monsterId = Number(editData.objId);
        this.node.position = new Vec3(editData.x,editData.y);
        this.defaultDir = editData.direction;
        this.isPatrol = editData.isPatrol;
    }

    /**
     * 下载资源
     */
    private loadRes()
    {
        if(this.monsterId != 0)
        {
            var filePath:string = "game/monster/" + this.monsterId + "/texture";
            resources.load(filePath, Texture2D,(error:Error,tex:Texture2D)=>
            {
                if(error != null)
                {
                    console.log("\n");
                    console.error("加载怪物资源失败 filePath：",filePath);
                    console.error("错误原因",error);
                    console.log("\n");
                    return;
                }
                this.movieClip.init(tex,5,8);

                //把影片的宽高赋值给根节点
                this.width = this.movieClip.uiTransform.width;
                this.height = this.movieClip.uiTransform.height;
            });
        }
    }

    private onTouchStart(event:EventTouch)
    {
        console.log("点击了怪物");

        GameWorld.instance.gameMap.myPlayer.trackTarget(this.node,(targetNode:Node)=>
        {
            //玩家走到了怪物旁边。想触发什么事件自己写
            this.navAgent.navPath.stop(); //停止寻路
            this.lookAtTarget(GameWorld.instance.gameMap.myPlayer.node); //望向玩家
        });
    }
}
