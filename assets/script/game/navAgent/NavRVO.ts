// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, _decorator } from "cc";
import { RVOMath, Vector2 } from "../../map/rvo/Common";
import RVOSystem from "../../map/rvo/RVOSystem";
import { Simulator } from "../../map/rvo/Simulator";
import NavAgent from "./NavAgent";

const { ccclass, property } = _decorator;

/**
 * RVO导航，需要动态避障的使用它
 */
@ccclass('NavRVO')
export default class NavRVO extends Component {

    private _navAgent:NavAgent = null;
    public get navAgent():NavAgent
    {
        if(!this._navAgent)
        {
            this._navAgent = this.node.getComponent(NavAgent);
        }
        return this._navAgent;
    }

    private rvoTag:number = 0;

    public rvoAgentId:number = -1;

	public targetPos:Vector2 = new Vector2(0,0);

    /**
     * rvo移动速度
     */
    public moveSpeed = 200;

    /**
     * 是否启用RVO导航
     */
    public isUse:boolean = false;

    
    private _isObstacle: boolean = false;
    /**
     * 是否成为障碍
     */
    public get isObstacle(): boolean {
        return this._isObstacle;
    }
    public set isObstacle(value: boolean) {
        this._isObstacle = value;

        if(this.rvoAgentId != -1)
        {
            if(this._isObstacle)
            {
                Simulator.instance.setAgentMass(this.rvoAgentId,10); //如果是障碍，加大质量，让该物体不被其他物体推挤
            }else
            {
                Simulator.instance.setAgentMass(this.rvoAgentId,1); //如果是障碍，回复质量为原始值
            }
        }
    }

    /**
     * 是否已经被销毁
     */
    private isDestroy:boolean = false;
    

    start () {
        // [3]
    }

    public init()
    {

    }

    /**
     * 初始化RVO
     */
    public initRVO()
    {
        if(this.rvoAgentId != -1)
        {
            Simulator.instance.removeAgent(this.rvoAgentId); 
        }

        this.rvoTag = RVOSystem.instance.rvoTag; //打入rvo系统标记，用于判定是否属于当前rvo系统运行时
        Simulator.instance.setAgentDefaults(80.0, 10, 100.0, 0.01, this.navAgent.radius, this.navAgent.moveSpeed, new Vector2(0.0, 0.0));   
        var rvoPos:Vector2 = new Vector2(this.node.position.x,this.node.position.y);
        var agentId:number = Simulator.instance.addAgent(rvoPos);
        this.rvoAgentId = agentId;
        this.targetPos = rvoPos;
        this.isUse = true;

        this.isObstacle = this.isObstacle; //变量值赋值给原变量，可以重新刷新障碍状态
    }

    /**
     * 删除RVO运行时
     */
    public removeRVO()
    {
        if(this.rvoAgentId != -1)
        {
            Simulator.instance.removeAgent(this.rvoAgentId); 
        }

        this.rvoAgentId = -1;
        this.targetPos = new Vector2(0,0);
        this.isUse = false;
    }

    update (dt: number) {
        if(Simulator.instance.hasAgent(this.rvoAgentId))
        {
            if(this.targetPos != null)
            {
                this.setPreferredVelocities(dt);
            }

            var p:Vector2 = Simulator.instance.getAgentPosition(this.rvoAgentId);
            //this.node.position = new Vec3(p.x, p.y);
            //var newPos:Vec3 = new Vec3(p.x, p.y);
            //this.node.position = this.node.position.lerp(newPos,dt * 10.0,newPos);

            this.navAgent.setX(p.x);
            this.navAgent.setY(p.y);
        }

    }

    private setPreferredVelocities(dt):void
    {
        //如果是障碍状态，则不可移动
        if(this.isObstacle)
        {
            return;
        }

        /*var goalVector:Vector2 = this.targetPos.minus(Simulator.instance.getAgentPosition(this.rvoAgentId));

        var distSq = RVOMath.absSq(goalVector);

        var moveSpeed:number = this.speed * dt;

        var newSpeed = this.speed;

        if(distSq < moveSpeed * moveSpeed)
        {
            newSpeed = Math.sqrt(distSq);
        }

        if(RVOMath.absSq(goalVector) > 1.0) {
            goalVector = RVOMath.normalize(goalVector).scale(newSpeed);
        }

        if (RVOMath.absSq(goalVector) < RVOMath.RVO_EPSILON) {
            // Agent is within one radius of its goal, set preferred velocity to zero
            Simulator.instance.setAgentPrefVelocity (this.rvoAgentId, new Vector2 (0.0, 0.0));
            
        }else {
            Simulator.instance.setAgentPrefVelocity(this.rvoAgentId, goalVector);

            let angle = Math.random() * 2.0 * Math.PI;
            let dist = Math.random() * 0.0001;
            Simulator.instance.setAgentPrefVelocity(this.rvoAgentId,
                Simulator.instance.getAgentPrefVelocity(this.rvoAgentId).plus(new Vector2(Math.cos(angle), Math.sin(angle)).scale(dist)));
        }*/

        var goalVector:Vector2 = this.targetPos.minus(Simulator.instance.getAgentPosition(this.rvoAgentId));

        var distSq = RVOMath.absSq(goalVector);

        var speed:number = this.navAgent.moveSpeed * dt;

        var newSpeed = this.moveSpeed;

        if(distSq < speed * speed)
        {
            newSpeed = this.lerp(0,Math.sqrt(distSq),0.5);
        }

        if (RVOMath.absSq(goalVector) > 1.0)
        {
            goalVector = RVOMath.normalize(goalVector).scale(newSpeed);
        }

        Simulator.instance.setAgentPrefVelocity(this.rvoAgentId, goalVector);

        /* 在两个代理之间方向相同时，或者完全相反时，为了避免死锁，稍微扰动一下. */
        let angle = Math.random() * 2.0 * Math.PI;
        //let dist = Math.random() * 0.0001; //3d用
        let dist = Math.random() * 1; //2d用
        Simulator.instance.setAgentPrefVelocity(this.rvoAgentId,
        Simulator.instance.getAgentPrefVelocity(this.rvoAgentId).plus(new Vector2(Math.cos(angle), Math.sin(angle)).scale(dist)));
	}

    /**
     * 插值
     * @param numStart 
     * @param numEnd 
     * @param t 
     */
    public lerp(numStart:number,numEnd:number,t:number):number
    {
        if(t > 1)
        {
            t = 1;
        }else if(t < 0)
        {
            t = 0
        }

        return numStart * (1 - t) + (numEnd * t);
    }

    public stop()
    {
        if(this.targetPos != null)
        {
            this.targetPos.x = this.navAgent.getX();
            this.targetPos.y = this.navAgent.getY();
        }
    }

	/**
     * 判断是否已经到达目标点
     * @returns 
     */
	public isReachedTargetPos():boolean
	{
		if (RVOMath.absSq(Simulator.instance.getAgentPosition(this.rvoAgentId).minus(this.targetPos)) > Simulator.instance.getAgentRadius(this.rvoAgentId) * Simulator.instance.getAgentRadius(this.rvoAgentId)) //当与目标的距离大于代理的半径时，证明没有达到目标
		{
			return false;
		}

		return true;
	}

    public destroySelf():void
    {
        this.isDestroy = true;

        //属于当前RVO运行时的代理，才可以删除，不然删错了会导致RVO系统异常
        if(this.rvoTag == RVOSystem.instance.rvoTag)
        {
            Simulator.instance.removeAgent(this.rvoAgentId); 
        }
    }

    protected onDestroy(): void {
        if(!this.isDestroy)
        {
            this.isDestroy = true;

            //属于当前RVO运行时的代理，才可以删除，不然删错了会导致RVO系统异常
            if(this.rvoTag == RVOSystem.instance.rvoTag)
            {
                Simulator.instance.removeAgent(this.rvoAgentId); //最好在destroySelf里执行，因为onDestroy()是销毁后延迟一帧才响应的，这里执行只是做补救
            }
            
        }
    }
}
