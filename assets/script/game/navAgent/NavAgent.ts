// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, Enum, Vec3, _decorator } from "cc";
import { ControlMode } from "../../control/ControlMode";
import PathFindingAgent from "../../map/road/PathFindingAgent";
import RoadNode from "../../map/road/RoadNode";
import NavUnit from "../unit/base/NavUnit";
import NavJoystick from "./NavJoystick";
import NavPath from "./NavPath";
import NavRVO from "./NavRVO";

const { ccclass, property } = _decorator;

/**
 * 导航代理
 * @作者 落日故人 QQ 583051842
 */
@ccclass('NavAgent')
export default class NavAgent extends Component {

    /**
     * 代理的导航单位对象，必须和代理在同一节点上，不然会互相找不到对方
     * 这个对象可能是空，如果为空，代理的所有接口会默认用自身的
     */
    private _navUnit:NavUnit = null;
    public get navUnit():NavUnit
    {
        /*if(this._navUnit == null)
        {
            this._navUnit = this.node.getComponent(NavUnit);
        }*/
        return this._navUnit;
    }

    /**
     * 摇杆控制模式
     */
    @property({ type: Enum(ControlMode), tooltip: "控制模式:\ntouch  点击行走 \njoystick 摇杆操作 " })
    private ctrMode: ControlMode = ControlMode.touch;

    public get controlMode(): ControlMode 
    {
        if(this.navUnit != null)
        {
            return this.navUnit.controlMode;
        }

        return this.ctrMode;
    }
    public set controlMode(value: ControlMode) 
    {
        if(this.navUnit != null)
        {
            this.navUnit.controlMode = value;
        }

        this.ctrMode = value;
    }

    /**
     * 摇杆导航逻辑封装
     */
    private _joystick: NavJoystick = null;
    public get joystick(): NavJoystick 
    {
        if(this._joystick == null)
        {
            this._joystick = this.node.getComponent(NavJoystick);

            if(this._joystick == null)
            {
                this._joystick = this.node.addComponent(NavJoystick);
            }
        }

        return this._joystick;
    }

    /**
     * 寻路导航逻辑封装
     */
    private _navPath: NavPath = null;
    public get navPath(): NavPath 
    {

        if(this._navPath == null)
        {
            this._navPath = this.node.getComponent(NavPath);

            if(this._navPath == null)
            {
                this._navPath = this.node.addComponent(NavPath);
            }
        }

        return this._navPath;
    }

    /**
     * RVO导航逻辑封装
     */
    private _navRVO: NavRVO = null;
    public get navRVO(): NavRVO 
    {

        if(this._navRVO == null)
        {
            this._navRVO = this.node.getComponent(NavRVO);

            if(this._navRVO == null)
            {
                this._navRVO = this.node.addComponent(NavRVO);
            }
        }

        return this._navRVO;
    }

    /**
     * 代理当前所站在的路点
     */
     public get roadNode():RoadNode
     {
         return PathFindingAgent.instance.getRoadNodeByPixel(this.getX(),this.getY());
     }

    /**
     * 设置方向
     */
    private _direction:number = 0;
    public get direction():number
    {
        if(this.navUnit != null)
        {
            return this.navUnit.direction;
        }

        return this._direction;
    }

    public set direction(value:number)
    {
        if(this.navUnit != null)
        {
            this.navUnit.direction = value;
        }

        this._direction = value;
    }

    /**
     * 代理的移动速度
     */
    private _moveSpeed: number = 100;
    public get moveSpeed(): number 
    {
        if(this.navUnit != null)
        {
            return this.navUnit.moveSpeed;
        }

        return this._moveSpeed;
    }

    public set moveSpeed(value: number) 
    {
        if(this.navUnit != null)
        {
            this.navUnit.moveSpeed = value;
        }

        this._moveSpeed = value;
    }

    /**
     * 移动方向
     */
    private _moveDir: Vec3 = new Vec3(0,0,0);
    public get moveDir(): Vec3 
    {
        if(this.navUnit != null)
        {
            return this.navUnit.moveDir;
        }

        return this._moveDir;
    }
    public set moveDir(value: Vec3) 
    {
        if(this.navUnit != null)
        {
            this.navUnit.moveDir = value;
        }

        this._moveDir = value;
    }

    private _radius: number = 25;
    /**
     * 导航单位的半径，以像素为单位
     */
    public get radius(): number {

        if(this.navUnit != null)
        {
            return this.navUnit.radius;
        }

        return this._radius;
    }
    public set radius(value: number) {

        if(this.navUnit != null)
        {
            this.navUnit.radius = value;
        }

        this._radius = value;
    }

    /**
     * 是否已经初始化了
     */
    private isInit:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.init();
    }

    start () {

    }

    public init():void
    {
        if(this.isInit)
        {
            return;
        }

        this.isInit = true;

        if(this._navUnit == null)
        {
            this._navUnit = this.node.getComponent(NavUnit);
        }

        this.joystick.init();
        this.navPath.init();
        this.navRVO.init();

    }

    // update (dt) {}

    public setPosition(position:Vec3)
    {
        if(this.navUnit != null)
        {
            this.navUnit.node.position = position;
        }else
        {
            this.node.position = position;
        }
    }

    public setPos(x:number, y:number, z:number = 0)
    {
        if(this.navUnit != null)
        {
            this.navUnit.node.position = new Vec3(x,y,z);
        }else
        {
            this.node.position = new Vec3(x,y,z);
        }
    }

    public getPos():Vec3
    {
        if(this.navUnit != null)
        {
            return this.navUnit.node.position;
        }

        return this.node.position;
    }

    public setX(x:number)
    {
        if(this.navUnit != null)
        {
            var pos:Vec3 = this.navUnit.node.position;
            pos.x = x;
            this.navUnit.node.position = pos;
        }else
        {
            var pos:Vec3 = this.node.position;
            pos.x = x;
            this.node.position = pos;
        }
    }

    public getX():number
    {
        if(this.navUnit != null)
        {
            return this.navUnit.node.position.x;
        }

        return this.node.position.x;
    }

    public setY(y:number)
    {
        if(this.navUnit != null)
        {
            var pos:Vec3 = this.navUnit.node.position;
            pos.y = y;
            this.navUnit.node.position = pos;
        }else
        {
            var pos:Vec3 = this.node.position;
            pos.y = y;
            this.node.position = pos;
        }
    }

    public getY():number
    {
        if(this.navUnit != null)
        {
            return this.navUnit.node.position.y;
        }

        return this.node.position.y;
    }

    public setZ(z:number)
    {
        if(this.navUnit != null)
        {
            var pos:Vec3 = this.navUnit.node.position;
            pos.z = z;
            this.navUnit.node.position = pos;
        }else
        {
            var pos:Vec3 = this.node.position;
            pos.z = z;
            this.node.position = pos;
        }
    }

    public getZ():number
    {
        if(this.navUnit != null)
        {
            return this.navUnit.node.position.z;
        }

        return this.node.position.z;
    }

    /**
     * 导航玩家到目标
     * @param targetX 
     * @param targetY 
     */
    public navTo(targetX:number,targetY:number)
    {
        this.navPath.navTo(targetX,targetY);
    }

    public setMoveDir(x:number, y:number, z:number = 0)
    {
        this.moveDir.x = x;
        this.moveDir.y = y;
        this.moveDir.z = z;
    }

    /**
     * 当代理移动时
     * @returns 
     */
    public onMove()
    {
        if(this.navUnit != null)
        {
            return this.navUnit.onMove();
        }
    }

    /**
     * 当代理停止时
     * @returns 
     */
    public onStop()
    {
        if(this.navUnit != null)
        {
            return this.navUnit.onStop();
        }
    }
    
    //--------------------------------------------------------------------------------------------------

    /**
     * 
     * @param 设置朝向
     */
    public setFaceDir(dir:Vec3)
    {
        if(this.navUnit != null)
        {
            return this.navUnit.setFaceDir(dir);
        }
    }

    /**
     * 每走完一个路点节点时
     * @param roadNode 走完的路径点
     */
    public walkCompleteOneRoadNode(roadNode:RoadNode)
    {
        if(this.navUnit != null)
        {
            return this.navUnit.walkCompleteOneRoadNode(roadNode);
        }
    }

    /**
     * 走完全部路径时，即走到了终点
     * @param endRroadNode 最后的路径点
     */
    public walkCompleteThePath(endRroadNode:RoadNode)
    {
        if(this.navUnit != null)
        {
            return this.navUnit.walkCompleteThePath(endRroadNode);
        }
    }
}
