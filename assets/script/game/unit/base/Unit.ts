// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, Label, Vec3, _decorator, CCInteger, CCFloat, CCBoolean, Size } from "cc";
import { Behaviour } from "../../../base/Behaviour";
import PathFindingAgent from "../../../map/road/PathFindingAgent";
import RoadNode from "../../../map/road/RoadNode";
import MovieClip from "../../../utils/MovieClip";
import { FogOfWar } from "../../map/fogOfWar/FogOfWar";
import { Vec2 } from "cc";

const { ccclass, property } = _decorator;

/**
 * 单位状态
 */
export enum UnitState
{
    /**
     * 无
     */
    none = 0,

    /**
     * 待机
     */
    idle = 1,

    /**
     * 行走
     */
    walk = 2,

    /**
     * 攻击
     */
    attack = 3,

    /**
     * 死亡
     */
    death = 4,
}

/**
 * 单位基类。
 * 单位就是存在场景里的各种个体对象， 所有场景里的单位（角色，建筑，植物等对象）都继承它。
 */
@ccclass('Unit')
export default class Unit extends Behaviour {

    /**
     * 动画组件
     */
    protected _movieClip:MovieClip = null;

    public get movieClip():MovieClip
    {
        if(!this._movieClip)
        {
            this._movieClip = this.node.getComponentInChildren(MovieClip);
        }
        return this._movieClip;
    }

    /**
     * 单位名字文本
     */
    @property(Label)
    public nameTxt:Label = null;

    /**
     * 单位id
     */
    @property(CCInteger)
    public id:number = 0;

    /**
     * 单位类型
     */
    @property(CCInteger)
    public type:number = 0;

    /**
     * 移动速度
     */
    @property(CCFloat)
    public moveSpeed:number = 200;

    /**
     * 血量值
     */
    @property(CCInteger)
    public hp:number = 100;

    /**
     * 魔法值
     */
    @property(CCInteger)
    public mp:number = 100;

    /**
     * 是否驱散迷雾
     */
    @property({displayName:"是否驱散迷雾"})
    public isDisperseFog:boolean = true;

    /**
     * 驱散迷雾范围
     */
    @property({type:Size,displayName:"驱散迷雾范围"})
    public disperseFogSize:Size = new Size(80,120);

    /**
     * 驱散迷雾范围
     */
    @property({type:Vec2,displayName:"驱散迷雾偏移量"})
    public disperseFogOffset:Vec2 = new Vec2(0,35);

    /**
     * 驱散迷雾范围
     */
    @property({type:CCFloat,displayName:"刷新迷雾的距离"})
    public checkMoveValue:number = 1;

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
    protected _direction:number = 0;
    public get direction():number
    {
        return this._direction;
    }

    public set direction(value:number)
    {
        this._direction = value;
    }

    /**
     * 单位状态
     */
    protected _state:UnitState = UnitState.none;
    public get state():UnitState
    {
        return this._state;
    }

    public set state(value:UnitState)
    {
        this._state = value;
    }

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
     * 单位当前所站在的路点
     */
    public get roadNode():RoadNode
    {
        return PathFindingAgent.instance.getRoadNodeByPixel(this.node.position.x,this.node.position.y);
    }


    private _lastPos:Vec3 = null;

    private _mapPos:Vec3 = null;
    /**获得单位在地图的坐标,(坐标为整数，方便计算) */
    public get mapPos():Vec3
    {
        if(this._mapPos == null)
        {
            this._mapPos = this.node.position.clone();
        }

        this._mapPos.x = Math.floor(this.node.position.x);
        this._mapPos.y = Math.floor(this.node.position.y);

        return this._mapPos;
    } 

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        super.onLoad();
    }

    start () 
    {
        this.state = UnitState.idle; //默认待机状态
    }

    update (dt) 
    {
        var newPos:Vec3 = this.mapPos;
        //判断单位位置是否有变化
        if(this._lastPos == null || Math.abs(newPos.x - this._lastPos.x) > this.checkMoveValue || Math.abs(newPos.y - this._lastPos.y) > this.checkMoveValue)
        {
            if(this._lastPos == null)
            {
                this._lastPos = new Vec3();
            }
            this._lastPos.x = newPos.x;
            this._lastPos.y = newPos.y;
            this.onPosChange();
        }
    }

    /**
     * 当单位发生位移时
     */
    protected onPosChange():void
    {
        if(this.isDisperseFog)
        {
            if(FogOfWar.instance != null)
            {
                FogOfWar.instance.drawOval(this.x + this.disperseFogOffset.x, this.y + this.disperseFogOffset.y, this.disperseFogSize.width, this.disperseFogSize.height);
            }
        }
    }

    /**
     * 单位朝向某个点
     * @param px 
     * @param py 
     */
    public rotateToPos(px:number,py:number)
    {
        var dx:number = px - this.node.position.x;
        var dy:number = py - this.node.position.y;

        var moveAngle:number = Math.atan2(dy,dx);
        var dire:number = Math.round((-moveAngle + Math.PI)/(Math.PI / 4));
        this.direction = dire > 5 ? dire-6 : dire+2;

    }

    /**
     * 设置单位朝向
     * @param dir 
     */
    public setFaceDir(dir:Vec3)
    {
        var moveAngle:number = Math.atan2(dir.y,dir.x);
        var dire:number = Math.round((-moveAngle + Math.PI)/(Math.PI / 4));
        this.direction = dire > 5 ? dire-6 : dire+2;
    }

    /**
     * 单位望向目标对象
     * @param target 
     */
    public lookAtTarget(target:Node)
    {
        var dir:Vec3 = target.position.clone().subtract(this.node.position);
        this.setFaceDir(dir);
    }

    /**
     * 获得单位周围相邻的所有路点
     * @returns 
     */		
    public getRoundRoadNodes():RoadNode[]
    {
        var nodeArr:RoadNode[] = PathFindingAgent.instance.getRoundRoadNodes(this.roadNode);;
        return nodeArr;
    }

    /**
     * 销毁自身
     */
    public destroySelf()
    {
        this.node.destroy();
    }
}
