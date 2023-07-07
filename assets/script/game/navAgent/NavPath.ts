// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Component, _decorator } from "cc";
import { ControlMode } from "../../control/ControlMode";
import PathFindingAgent from "../../map/road/PathFindingAgent";
import RoadNode from "../../map/road/RoadNode";
import RVOSystem from "../../map/rvo/RVOSystem";
import NavAgent from "./NavAgent";

const { ccclass, property } = _decorator;

/**
 * 寻路导航
 */
@ccclass('NavPath')
export default class NavPath extends Component {
 
    /**
     * 是否正在导航
     */
    public naving:boolean = false;

    /**
     * 移动的角度
     */
    protected _moveAngle:number = 0;

    /**
     * 行走的路径（路点列表）
     */
    protected _roadNodeArr:RoadNode[] = [];

    /**
     * 当前正在行走向第几个路点
     */
    protected _nodeIndex:number = 0;

    private _navAgent:NavAgent = null;
    public get navAgent():NavAgent
    {
        if(!this._navAgent)
        {
            this._navAgent = this.node.getComponent(NavAgent);
        }
        return this._navAgent;
    }

    // onLoad () {}

    start () {

    }

    public init()
    {

    }

    update (dt) 
    {
        // if(this.navAgent == null || this.navAgent.controlMode != ControlMode.touch)
        // {
        //     return;
        // }

        if(this.navAgent == null || this.navAgent.controlMode != ControlMode.touch)
        {
            return;
        }

        if(this.naving)
        {
            if(RVOSystem.instance.runing && this.navAgent.navRVO.isUse && this.navAgent.navRVO.isObstacle) //如果rvo是障碍状态则停止移动
            {
                this.stop();
                return;
            }

            if(this.navAgent.moveSpeed == 0) //移动速度等于0，直接停止移动逻辑，下面的代码没必要再执行
            {
                this.stop();
                return;
            }

            var nextNode:RoadNode = this._roadNodeArr[this._nodeIndex];
            var dx:number = nextNode.px - this.navAgent.getX();
            var dy:number = nextNode.py - this.navAgent.getY();

            var speed:number = this.navAgent.moveSpeed * dt;

            if(dx * dx + dy * dy > speed * speed)
            {
                if(this._moveAngle == 0)
                {
                    this._moveAngle = Math.atan2(dy,dx);

                    var dire:number = Math.round((-this._moveAngle + Math.PI)/(Math.PI / 4));
                    this.navAgent.direction = dire > 5 ? dire-6 : dire+2;
                }

                var xspeed:number = Math.cos(this._moveAngle) * speed;
                var yspeed:number = Math.sin(this._moveAngle) * speed;

                if(RVOSystem.instance.runing && this.navAgent.navRVO.isUse) //如果RVO已经启动，并且导航单位使用了ROV导航，则使用RVO移动当前导航单位
                {
                    this.navAgent.navRVO.moveSpeed = this.navAgent.moveSpeed;
                    this.navAgent.navRVO.targetPos.x = nextNode.px;
                    this.navAgent.navRVO.targetPos.y = nextNode.py;
                }else
                {
                    this.navAgent.setX(this.navAgent.getX() + xspeed);
                    this.navAgent.setY(this.navAgent.getY() + yspeed);
                }
                
            }else
            {
                this.navAgent.walkCompleteOneRoadNode(nextNode);

                this._moveAngle = 0;

                if(this._nodeIndex == this._roadNodeArr.length - 1)
                {
                    this.navAgent.setPos(nextNode.px,nextNode.py);
                    this.stop();
                    this.navAgent.walkCompleteThePath(nextNode);
                }else
                {
                    this.walk();
                }
            }
        }
    }

    /**
     * 导航玩家到目标
     * @param targetX 
     * @param targetY 
     */
    public navTo(targetX:number,targetY:number)
    {
        if(this.navAgent == null)
        {
            return;
        }

        var roadNodeArr:RoadNode[] = PathFindingAgent.instance.seekPath2(this.navAgent.getX(),this.navAgent.getY(),targetX,targetY,this.navAgent.radius);

        if(roadNodeArr.length > 0)
        {
            this.walkByRoad(roadNodeArr);
        }
    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 
     */
    public walkByRoad(roadNodeArr:RoadNode[])
    {
        this._roadNodeArr = roadNodeArr;
        this._nodeIndex = 0;
        this._moveAngle = 0;

        this.walk();
        this.move();
    }

    private walk()
    {
        if(this._nodeIndex < this._roadNodeArr.length - 1)
        {
            this._nodeIndex ++;
        }else
        {
            //走到了终点
        }
    }

    public move()
    {
        if(this._roadNodeArr.length == 0)
        {
            this.stop();
            return;
        }

        this.naving = true;
        this._moveAngle = 0;

        if(this.navAgent != null)
        {
            this.navAgent.onMove();
        }
    }

    public stop()
    {
        this.naving = false;

        if(this.navAgent != null)
        {
            this.navAgent.navRVO.stop(); //停止RVO移动，如果RVO有移动，则被停止
            this.navAgent.onStop();
        }
    }
}
