// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {CCBoolean, CCFloat, CCInteger, Node, Vec2, Vec3, _decorator } from "cc";
import { UnitState } from "../../base/Unit";
import Actor from "./Actor";

const { ccclass, property } = _decorator;

/**
 * 扮演者2。npc，怪物，宠物等不受玩家控制的角色继承自这个类
 */
@ccclass('Actor2')
export default class Actor2 extends Actor {

    /**
     * 是否巡逻
     */
    @property(CCBoolean)
    public isPatrol:boolean = true;

    /**
     * 以角色初始化位置为中心，巡逻的范围
     */
    @property(CCFloat)
    public patrolRange:number = 200;

    /**
     * 初始化时默认方向
     */
    @property(CCInteger)
    public defaultDir:number = 0;

    public get direction():number
    {
        return this._direction;
    }

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

        if(value > 4)
        {
            this.movieClip.rowIndex = 4 - value % 4;
            var scale:Vec3 = this.movieClip.node.scale;
            scale.x = -1;
            this.movieClip.node.scale = scale;
        }else
        {
            this.movieClip.rowIndex = value;
            var scale:Vec3 = this.movieClip.node.scale;
            scale.x = 1;
            this.movieClip.node.scale = scale;
        }
    }

    public get state():UnitState
    {
        return this._state;
    }
    public set state(value:UnitState)
    {
        this._state = value;

        var halfCol:number = this.movieClip.col / 2;

        switch(this._state)
        {
            case UnitState.idle: 
                this.movieClip.begin = 0;
                this.movieClip.end = halfCol;
            break;

            case UnitState.walk: 
                this.movieClip.begin = halfCol;
                this.movieClip.end = this.movieClip.col;
            break;
        }

    }

    protected basePos:Vec3 = null;

    protected targetPos:Vec2 = new Vec2();

    protected timer:number = 3.5;

    /**
     * 是否停止巡逻
     */
    public isStopPatrol:boolean = false;


    start () 
    {
        super.start();
        this.basePos = this.node.position;
        this.timer = this.Range(0.5 , 1.5);
    }


    update (dt) 
    {
        super.update(dt);

        if(this.isStopPatrol)
        {
            return;
        }

        //如果需要巡逻，则每隔一段时间在巡逻范围内随机一个点移动
        if(this.isPatrol)
        {
            this.timer -= dt;

            if(this.timer <= 0)
            {
                this.timer = this.Range(1.5 , 4);
                this.patrol();
            }
        }

    }

    public Range(num1:number,num2:number)
    {
        if(num2 > num1)
        {
            return Math.random() * (num2 - num1) + num1;
        }
        return Math.random() * (num1 - num2) + num2;
    }

    public patrol()
    {
        this.targetPos.x = this.basePos.x + this.Range(-this.patrolRange , this.patrolRange);
        this.targetPos.y = this.basePos.y + this.Range(-this.patrolRange , this.patrolRange);

        this.navTo(this.targetPos.x,this.targetPos.y);
    }
}
