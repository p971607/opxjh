// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {CCInteger, CCObject, EventTouch, Node, resources, Texture2D, Vec3, _decorator } from "cc";
import { DataConfig } from "../../../../data/cfgdata/DataConfig";
import UIManager from "../../../../ui/UIManager";
import { EditNpcData } from "../../../editObjData/EditObjData";
import GameWorld from "../../../gameWorld/GameWorld";
import Actor2 from "../base/Actor2";
import { NPCTalkBoard } from "./NPCTalkBoard";


const { ccclass, property } = _decorator;

@ccclass('NPC')
export default class NPC extends Actor2 {

    @property(CCInteger)
    public npcId:number = 0;

    @property(Node)
    public skin:Node = null;


    protected _talkBoard:NPCTalkBoard = null;
    public get talkBoard():NPCTalkBoard
    {
        if(!this._talkBoard)
        {
            this._talkBoard = this.node.getComponentInChildren(NPCTalkBoard);
        }
        return this._talkBoard;
    }

    /**
     * 编辑的数据
     */
    public editData:EditNpcData = null;

    start () {
        super.start();
        //this.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.skin.on(Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

    /**
     * 初始化
     */
    public init()
    {
        this.width = 100;
        this.height = 100;
        this.direction = this.defaultDir;

        if(!this.isPatrol) //如果npc是站立不动的
        {
            this.navAgent.navRVO.isObstacle = true; //把npc设置为RVO障碍。如果不设为障碍，可能会受到其他RVO导航对象推挤，而偏离当前站立的位置。
        }

        this.loadRes();
    }

    /**
     * 初始化编辑数据
     * @param editData 
     */
    public initEditData(editData:EditNpcData)
    {
        this.editData = editData;

        this.objName = editData.objName;
        this.npcId = Number(editData.objId);
        this.node.position = new Vec3(editData.x,editData.y);
        this.defaultDir = editData.direction;
        this.isPatrol = editData.isPatrol;
    }

    /**
     * 下载资源
     */
    private loadRes()
    {
        if(this.npcId != 0)
        {
            var filePath:string = "game/npc/" + this.npcId + "/texture";
            resources.load(filePath, Texture2D,(error:Error,tex:Texture2D)=>
            {
                if(error != null)
                {
                    console.log("\n");
                    console.error("加载NPC资源失败 filePath：",filePath);
                    console.error("错误原因",error);
                    console.log("\n");
                    return;
                }
                this.movieClip.init(tex,5,12);

                //把影片的宽高赋值给根节点
                this.width = this.movieClip.uiTransform.width;
                this.height = this.movieClip.uiTransform.height;
            });
        }
    }

    private onTouchStart(event:EventTouch)
    {
        //console.log("点击了npc");
        GameWorld.instance.gameMap.myPlayer.trackTarget(this.node,(targetNode:Node)=>
        {
            //玩家走到了npc旁边。想触发什么事件自己写
            this.isStopPatrol = true;
            this.navAgent.navPath.stop(); //停止寻路
            this.lookAtTarget(GameWorld.instance.gameMap.myPlayer.node); //望向玩家
            this.say(DataConfig.getNpcTalkData(this.editData.dialogueId),()=>
            {
                //对话结束，要做些什么自己处理

                if(this.editData.funcId == 1)
                {
                    //根据功能id的值执行不同的逻辑
                    UIManager.instance.equipShopView.open();
                }
                
            });
        },()=>
        {
            //玩家停止追踪npc时。想触发什么事件自己写
            this.isStopPatrol = false; 
            this.navAgent.navPath.move(); //重新移动
            //this.stopSay();
        });
    }

    /**
     * 说话
     * @param talkMsg 说话内容
     */
    public say(talkMsg:string,talkCompCallback:Function = null)
    {
        if(this.talkBoard != null)
        {
            this.talkBoard.showTalkContent(talkMsg,talkCompCallback);
        }
    }

    /**
     * 关闭对话
     */
    public stopSay()
    {
        this.talkBoard.close();
    }
}
