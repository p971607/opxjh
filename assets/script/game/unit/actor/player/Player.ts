// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import {Node, Enum, _decorator, CCInteger } from "cc";

import Body from "./Body";
import RoadNode from "../../../../map/road/RoadNode";
import Actor from "../base/Actor";
import { UnitState } from "../../base/Unit";
import MovieClip from "../../../../utils/MovieClip";


const { ccclass, property } = _decorator;

/**
 * 玩家类型
 * 
 * 多人在线游戏时，用于区分玩家是谁的
 */
export enum PlayerType
{
    /**
     * 无人认领
     */
    none = 0,

    /**
     * 属于玩家自己
     */
    my = 1,

    /**
     * 属于其他玩家
     */
    other = 1,

}

/**
 * 玩家控制的方式
 */
export enum PlayerControlType
{
    /**
     * 无控制
     */
    none = 0,

    /**
     * 用户控制
     */
    user = 1,

    /**
     * ai控制
     */
    ai = 2,

    /**
     * 网络玩家控制
     */
    net = 3,
}


@ccclass('Player')
export default class Player extends Actor {

    @property({type:Enum(PlayerControlType),tooltip:"玩家控制类型:\nnone  无控制 \nuser 用户操作 \nai ai操作 \nnet 网络玩家操作"})
    public controlType:PlayerControlType = PlayerControlType.none;

    @property(CCInteger)
    public roleId:number = 0;

    public body:Body = null;

    /**
     * 玩家类型，用于多人游戏时，区分这个玩家是谁的
     */
    public playerType:PlayerType = PlayerType.none;

    protected _state:UnitState = UnitState.none;


    /**
     * 设置单位方向
     * 
     * 方向值范围为 0-7，方向值设定如下，0是下，1是左下，2是左，3是左上，4是上，5是右上，6是右，7是右下
     * 
     *        4
     *      3   5
     *    2   *   6
     *      1   7
     *        0
     * 
     */
    public set direction(value:number)
    {
        this._direction = value;

        switch(this._direction)
        {
            case 0 : 
                this.movieClip.rowIndex = 0;
            break;

            case 1 : 
                this.movieClip.rowIndex = 4;
            break;

            case 2 : 
                this.movieClip.rowIndex = 1;
            break;

            case 3 : 
                this.movieClip.rowIndex = 6;
            break;

            case 4 : 
                this.movieClip.rowIndex = 3;
            break;

            case 5 : 
                this.movieClip.rowIndex = 7;
            break;

            case 6 : 
                this.movieClip.rowIndex = 2;
            break;

            case 7 : 
                this.movieClip.rowIndex = 5;
            break;
        }

    }

    public set state(value:UnitState)
    {
        if(this._state == value)
        {
            return;
        }

        this._state = value;

        if(this._movieClip)
        {
            this._movieClip.node.active = false;
        }

        switch(this._state)
        {
            case UnitState.idle: 
                this._movieClip = this.node.getChildByName("Body").getChildByName("Skin_Idle").getComponent(MovieClip);
            break;

            case UnitState.walk: 
                this._movieClip = this.node.getChildByName("Body").getChildByName("Skin_Walk").getComponent(MovieClip);
            break;

            case UnitState.attack: 
                this._movieClip = this.node.getChildByName("Body").getChildByName("Skin_Idle").getComponent(MovieClip);
            break;

        }

        
        this.direction = this._direction;
        this._movieClip.node.active = true;
        this._movieClip.playIndex = 0;
        this._movieClip.playAction();

    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        this.body = this.getComponentInChildren(Body);
        super.onLoad();
    }

    start () {
        super.start();
        this.state = UnitState.idle;
    }

    update(dt)
    {
        super.update(dt);
    }


    /*public onMove()
    {
        this.state = UnitState.walk;
    }

    public onStop()
    {
        this.state = UnitState.idle;
    }*/

}
