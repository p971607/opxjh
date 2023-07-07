// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, _decorator } from "cc";
import RoadNode from "../../../../map/road/RoadNode";
import NavUnit from "../../base/NavUnit";


const { ccclass, property } = _decorator;

/**
 * 扮演者基类
 * 场景里的一切活体单位，玩家，宠物，怪，npc都是扮演者，都应该继承自这个类
 */
 @ccclass('Actor')
export default class Actor extends NavUnit {

    // LIFE-CYCLE CALLBACKS:

    /**
     *角色最近一次所站在的地图节点 
     */		
    protected _lastRoadNode:RoadNode = null;

    onLoad () 
    {
        super.onLoad();
    }

    start () {
        super.start();
    }

    update (dt) 
    {
        super.update(dt);
        this.updateActorStateByNode();
    }

    /**
     * 根据角色所在的路节点信息更新自身的信息
     * @returns 
     */
    public updateActorStateByNode():void
    {
        var roadNode:RoadNode = this.roadNode;
        
        if(roadNode == this._lastRoadNode)
        {
            //如果角色所站的路节点没有发生变化，不处理
            return;
        }
        
        this._lastRoadNode = roadNode
        
        if(this._lastRoadNode)
        {
            switch(this._lastRoadNode.value)
            {
                case 2://如果是透明节点时
                    if(this.alpha != 0.4)
                    {
                        this.alpha = 0.4;
                    }
                    break;
                case 3://如果是隐藏节点时
                    //this.alpha < 1 && (this.alpha = 1);
                    this.alpha > 0 && (this.alpha = 0);
                    break;
                default:
                    this.alpha < 1 && (this.alpha = 1);
                    
            }
            
        }

    }
}
