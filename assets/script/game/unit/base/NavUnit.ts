// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Enum, Node,Vec3,_decorator } from "cc";
import { ControlMode } from "../../../control/ControlMode";
import MapRoadUtils from "../../../map/road/MapRoadUtils";
import PathFindingAgent from "../../../map/road/PathFindingAgent";
import Point from "../../../map/road/Point";
import RoadNode from "../../../map/road/RoadNode";
import NavAgent from "../../navAgent/NavAgent";
import Unit, { UnitState } from "./Unit";

const { ccclass, property } = _decorator;

/**
 * 追踪逻辑，（用于玩家追踪怪物，或者怪物追踪玩家，或者其他一个单位跟踪另一个单位的情况使用）
 */
export class TrackLogic
{
    /**
     * 追踪目标的导航单位
     */
    public navUnit:NavUnit = null;

    /**
     * 追踪的目标对象
     */
    public target:Node;

    /**
     * 追踪上目标时的回调函数
     */
    public arriveTargetCallback:Function;

    /**
     * 停止追踪目标的回调
     */
    public stopTrackCallback:Function;

    /**
     * 用于锁住到达状态，防止一直执行 arriveTargetCallback 回调
     */
    public lockedArrive:boolean = false;

    /**
     * 追踪目标的上一次的位置
     */
    public lastTrackPos:Vec3 = new Vec3(0,0,0);


    /**
     * 追踪距离，只要导航单位和目标的距离小于这个值就停止追踪。距离单位为：路点的单位长度
     */
    public notTrackDist:number = 3;

    /**
     * 
     * 目标新的位置和上一次追踪的位置的距离，没超过这个值就不用重新寻路。距离单位为：路点的单位长度
     * 
     * 这是优化寻路效率的方法。
     * 可以想象一下，如果没有这个条件限制，场景里100个怪在追踪玩家，每帧（fps = 60）都在寻路，那么1秒钟就寻路6000次，游戏不一点承受得住，帧率下降得可怕。
     * 但是很多寻路是重复的没必要的。比如：如果玩家一直站着不动，追踪玩家的怪只需寻第一次路就可以了，直到玩家位移一定的距离，再重新计算寻路。这样就可能把每秒6000次寻路优化到60次甚至更少。
     */
    public notSeakDist:number = 3; //默认100像素，开发者可以按自己的需求修改。备注：如果值等于0，那么每帧都会在寻路

    /**
     * 追踪目标
     * @param navUnit 发起追踪的导航单位
     * @param target 追踪的对象
     * @param arriveTargetCallback 追上目标时的回调
     * @param stopTrackCallback 停止追踪目标时的回调
     * @param notTrackDist 追踪距离，只要导航单位和目标的距离小于这个值就停止追踪。距离单位为：路点的单位长度
     * @param notSeakDist 目标新的位置和上一次追踪的位置的距离，没超过这个值就不用重新寻路。距离单位为：路点的单位长度。 备注：这个是优化寻路用
     * @returns 
     */
    public trackTarget(navUnit:NavUnit, target:Node, arriveTargetCallback:Function = null, stopTrackCallback:Function = null, notTrackDist = 3, notSeakDist:number = 3)
    {
        //追踪对象和被追踪对象其中一个为null，追踪就没意义了，直接return
        if(navUnit == null || target == null)
        {
            return;
        }

        //如果追踪对象和上一次的不一样，说明目标被切换了
        if(this.target != target)
        {
            this.lastTrackPos = new Vec3(0,0,0); //重置位置为 (0,0,0)
        }

        this.navUnit = navUnit;
        this.target = target;
        this.arriveTargetCallback = arriveTargetCallback;
        this.stopTrackCallback = stopTrackCallback;
        this.notTrackDist = notTrackDist;
        this.notSeakDist = notSeakDist;
        this.lockedArrive = false;
    }

    /**
     * 停止追踪
     */
    public stopTrack()
    {
        
        this.arriveTargetCallback = null;

        if(this.stopTrackCallback != null)
        {
            this.stopTrackCallback(this.target);
            this.stopTrackCallback = null;
        }

        this.target = null;
    }

    /**
     * 是否需要追踪
     * @returns 
     */
    public isNeedTrack()
    {
        var point1:Point = MapRoadUtils.instance.getWorldPointByPixel(this.navUnit.node.position.x,this.navUnit.node.position.y);
        var point2:Point = MapRoadUtils.instance.getWorldPointByPixel(this.target.position.x,this.target.position.y);
        var dist:number = Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y); //获得导航单位和目标的路点单位长度距离

        if(dist < this.notTrackDist) //判断一下是否需要追踪目标，小于追踪距离就不用追踪
        {
            return false;
        }

        /*if(dist < this.notTrackDist) //判断一下是否需要追踪目标，小于追踪距离就不用追踪
        {
            return false;
        }*/

        return true;
    }

    /**
     * 是否需要寻路
     * @returns 
     */
    public isNeedSeekRoad():boolean
    {
        if(this.target == null)
        {
            return false;
        }

        var point1:Point = MapRoadUtils.instance.getWorldPointByPixel(this.target.position.x,this.target.position.y);
        var point2:Point = MapRoadUtils.instance.getWorldPointByPixel(this.lastTrackPos.x,this.lastTrackPos.y);

        var dist:number = Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y); //获得目标离上一次被追踪位置的路点单位长度距离

        if(dist < this.notSeakDist)
        {
            return false;
        }

        return true;
    }

    /**
     * 追踪到目标点
     * @param targetX 
     * @param targetY 
     */
     public trackTo(targetX:number,targetY:number)
     {
        if(this.navUnit == null)
        {
            return;
        }

        //保存一下上一次导航到目标的位置
        this.lastTrackPos.x = targetX;
        this.lastTrackPos.y = targetY;

        //寻路导航到目标点
        this.navUnit.navAgent.navTo(targetX,targetY);
     }


    update (dt:number) 
    {
        //追踪对象和被追踪对象其中一个为null，追踪就没意义了，直接return
        if(this.navUnit == null || this.target == null)
        {
            return;
        }

        if(!this.isNeedTrack()) //判断一下是否需要追踪目标，小于追踪距离就不用追踪
        {
            this.navUnit.navAgent.navPath.stop();
            this.navUnit.lookAtTarget(this.target);

            if(!this.lockedArrive)
            {
                this.lockedArrive = true;
                if(this.arriveTargetCallback != null)
                {
                    this.arriveTargetCallback(this.target);
                }
            }
            return;
        }

        this.lockedArrive = false;

        if(this.navUnit.navAgent.navPath.naving) //如果正在寻路导航
        {
            if(this.isNeedSeekRoad()) //判断一下是否需要重新寻路
            {
                this.trackTo(this.target.position.x,this.target.position.y);
            }
        }else
        {
            this.trackTo(this.target.position.x,this.target.position.y);
        }
    }
}

/**
 * 具备导航能力的单位，需要寻路功能的可以继承这个类
 */
@ccclass('NavUnit')
export default class NavUnit extends Unit {

    /**
     * 摇杆控制模式
     */
    @property({ type: Enum(ControlMode), tooltip: "控制模式:\ntouch  点击行走 \njoystick 摇杆操作 " })
    private ctrMode: ControlMode = ControlMode.touch;

    public get controlMode(): ControlMode 
    {
        return this.ctrMode;
    }
    public set controlMode(value: ControlMode) 
    {
        this.ctrMode = value;
    }
    
    /**
     * 导航代理组件
     */
    private _navAgent: NavAgent = null;
    public get navAgent(): NavAgent {

        if(this._navAgent == null)
        {
            this._navAgent = this.node.getComponent(NavAgent);

            if(this._navAgent == null)
            {
                this._navAgent = this.node.addComponent(NavAgent);
            }
        }

        return this._navAgent;
    }

    public trackLogic:TrackLogic = new TrackLogic();

    /**
     * 移动方向
     */
    public moveDir:Vec3 = new Vec3(0,0,0);

    /**
     * 单位脚下占地半径（单位像素，1、可用于RVO避开障碍, 2、也用于A星寻路时按角色的半径寻路）
     */
    public radius: number = 10;

    /**
     * 寻路时每走完一个路径节点的回调 
     */
    public walkRoadNodeCallback:Function = null;

    /**
     * 寻路时走到终点的回调
     */
    public walkCompletePathCallback:Function = null;

    onLoad () 
    { 
        super.onLoad();
        this.navAgent.init();
    }

    start () 
    {
        super.start();

        
    }

    update (dt) 
    {
        super.update(dt);
        this.trackLogic.update(dt);
    }


    /**
     * 初始化RVO
     */
    public initRVO()
    {
        this.setDefaultRadius();
        this.navAgent.navRVO.initRVO();
    }

    /**
     * 设置默认半径
     */
    public setDefaultRadius()
    {
        if(PathFindingAgent.instance.mapData)
        {
            var nodeRadius:number = Math.min(MapRoadUtils.instance.halfNodeWidth,MapRoadUtils.instance.halfNodeHeight); //把路点的宽半径和高半径之间的最小值作为路点的半径
            this.radius = Math.floor(nodeRadius * 0.8); //默认取路点的半径做单位的占地半径，（乘0.8的目的是让单位半径比路点半径小一点点，做RVO运算时就不会被路点卡住）      备注: 如果要每个不同的单位设置不同的半径，就删掉这部分代码，自己另外单独处理。
        }
    }

    /**
     * 导航单位到目标点
     * @param targetX 
     * @param targetY 
     */
    public navTo(targetX:number,targetY:number)
    {
        if(this.trackLogic.target != null)
        {
            this.trackLogic.stopTrack(); //如果有在追踪目标，先停止追踪
        }
        
        this.navAgent.navTo(targetX,targetY);
    }

    /**
     * 追踪目标
     * @param target 追踪的对象
     * @param arriveTargetCallback 追上目标时的回调
     * @param stopTrackCallback 停止追踪目标时的回调
     * @param notTrackDist 追踪距离，只要导航单位和目标的距离小于这个值就停止追踪。距离单位为：路点的单位长度
     * @param notSeakDist 目标新的位置和上一次追踪的位置的距离，没超过这个值就不用重新寻路。距离单位为：路点的单位长度。 备注：这个是优化寻路用
     */
    public trackTarget(target:Node, arriveTargetCallback:Function = null, stopTrackCallback:Function = null, notTrackDist = 3, notSeakDist:number = 3)
    {
        if(this.trackLogic.target != null && this.trackLogic.target != target)
        {
            this.trackLogic.stopTrack(); //如果追踪的目标和上一个不一样，先停止追踪上一个
        }

        this.trackLogic.trackTarget(this, target, arriveTargetCallback, stopTrackCallback, notTrackDist, notSeakDist);
    }

    /**
     * 停止追踪
     */
    public stopTrack()
    {
        this.trackLogic.stopTrack();
    }

    public onMove()
    {
        this.state = UnitState.walk;
    }

    public onStop()
    {
        this.state = UnitState.idle;
    }

    /**
     * 每走完一个路点节点时。
     * 如果需要单位每走完一个路径节点时做逻辑处理，请用继承类重写这个方法，或者添加回调函数 walkRoadNodeCallback
     * @param roadNode 走完的路径点
     */
    public walkCompleteOneRoadNode(roadNode:RoadNode)
    {
        if(this.walkRoadNodeCallback != null)
        {
            this.walkRoadNodeCallback();
        }
    }
 
    /**
     * 走完全部路径点时，即走到了终点。
     * 如果需要单位走到终点时做逻辑处理，请用继承类重写这个方法，或者添加回调函数 walkCompletePathCallback
     * @param endRroadNode 路径最后的路径点，即终点
     */
    public walkCompleteThePath(endRroadNode:RoadNode)
    {
        if(this.walkCompletePathCallback != null)
        {
            this.walkCompletePathCallback();
        }
    }

    /**
     * 销毁自身
     */
     public destroySelf()
     {
        this.navAgent.navRVO.destroySelf(); //销毁RVO
        super.destroySelf();
     }
}
