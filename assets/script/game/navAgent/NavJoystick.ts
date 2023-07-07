// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, Vec3, _decorator } from "cc";
import { ControlMode } from "../../control/ControlMode";
import PathFindingAgent from "../../map/road/PathFindingAgent";
import RoadNode from "../../map/road/RoadNode";
import RVOSystem from "../../map/rvo/RVOSystem";
import NavAgent from "./NavAgent";

const { ccclass, property } = _decorator;

/**
 * 摇杆导航
 */
@ccclass('NavJoystick')
export default class NavJoystick extends Component {

    private _navAgent:NavAgent = null;
    public get navAgent():NavAgent
    {
        if(!this._navAgent)
        {
            this._navAgent = this.node.getComponent(NavAgent);
        }
        return this._navAgent;
    }

    private targetPos:Vec3 = new Vec3(0,0,0);

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public init()
    {

    }

    update (dt) 
    {
        if(this.navAgent == null || this.navAgent.controlMode != ControlMode.joystick)
        {
            return;
        }

        if(RVOSystem.instance.runing && this.navAgent.navRVO.isUse && !this.navAgent.navRVO.isObstacle) //如果rvo不是障碍状态则可以行走
        {
            this.onJoyStickControll_RVO(dt);
        }else
        {
            this.onJoyStickControll_Normal(dt);
        }
    }

    /**
     * 摇杆控制逻辑 普通控制
     */
    private onJoyStickControll_Normal(dt:number)
    {
        if(this.navAgent.moveDir.x != 0 || this.navAgent.moveDir.y != 0)
        {
            this.navAgent.setFaceDir(this.navAgent.moveDir);

            var speed:number = this.navAgent.moveSpeed * dt;

            var pos:Vec3 = this.navAgent.getPos().clone().add(this.navAgent.moveDir.clone().multiplyScalar(speed));

            var nextNode:RoadNode = PathFindingAgent.instance.getRoadNodeByPixel(pos.x,pos.y);

            if(!nextNode)
            {
                this.targetPos = this.navAgent.getPos();
            }else
            {
                if(nextNode.value != 1)
                {
                    this.targetPos = pos;
                }else
                {
                    var nodeArr:RoadNode[] = PathFindingAgent.instance.getRoundRoadNodes(this.navAgent.roadNode);

                    var bestRoadNode:RoadNode = null;

                    for(var i:number = 0 ; i < nodeArr.length ; i++)
                    {
                        if(!nodeArr[i] || nodeArr[i].value == 1 || nodeArr[i] == nextNode)
                        {
                            continue;
                        }

                        nodeArr[i].h = (Math.abs(nextNode.cx - nodeArr[i].cx) + Math.abs(nextNode.cy - nodeArr[i].cy)) * 10;

                        if(!bestRoadNode)
                        {
                            bestRoadNode = nodeArr[i];
                        }else
                        {
                            if(nodeArr[i].h < bestRoadNode.h)
                            {
                                bestRoadNode = nodeArr[i];
                            }else if(nodeArr[i].h == bestRoadNode.h)
                            {
                                    var dir1:Vec3 = new Vec3(nodeArr[i].px,nodeArr[i].py).subtract(this.navAgent.getPos()).normalize();
                                    var dir2:Vec3 = new Vec3(bestRoadNode.px,bestRoadNode.py).subtract(this.navAgent.getPos()).normalize();

                                    if((dir1.add(this.navAgent.moveDir)).length() > (dir2.add(this.navAgent.moveDir)).length())
                                    {
                                        bestRoadNode = nodeArr[i];
                                    }

                            }
                        }
                    }

                    if(bestRoadNode)
                    {
                        var dir1:Vec3 = new Vec3(nextNode.px,nextNode.py).subtract(this.navAgent.getPos()).normalize();
                        var dir2:Vec3 = new Vec3(bestRoadNode.px,bestRoadNode.py).subtract(this.navAgent.getPos()).normalize();

                        if((dir1.add(this.navAgent.moveDir)).length() / 2   > (dir2.add(this.navAgent.moveDir)).length())
                        {
                            this.targetPos = this.navAgent.getPos();
                        }else
                        {
                            this.targetPos = new Vec3(bestRoadNode.px,bestRoadNode.py);
                        }
                    }
                }
            }

            var dir:Vec3 = this.targetPos.clone().subtract(this.navAgent.getPos());
            var dis:number = dir.length();
            dir = dir.normalize();
            
            if(dis >= speed)
            {
                this.targetPos = this.navAgent.getPos().clone().add(dir.multiplyScalar(speed)); 
            }

            this.navAgent.setPosition(this.targetPos);
            this.navAgent.onMove();

        }else
        {
            this.navAgent.onStop();
        }
    }

    /**
     * 摇杆控制逻辑 RVO控制
     */
    private onJoyStickControll_RVO(dt:number)
    {
        if(this.navAgent.moveDir.x != 0 || this.navAgent.moveDir.y != 0)
        {
            this.navAgent.setFaceDir(this.navAgent.moveDir);
            this.targetPos = this.navAgent.getPos().clone().add(this.navAgent.moveDir.clone().multiplyScalar(this.navAgent.moveSpeed));
            this.navAgent.onMove();

        }else
        {
            this.targetPos = this.navAgent.getPos();
            this.navAgent.onStop();
        }

        this.navAgent.navRVO.moveSpeed = this.navAgent.moveSpeed;
        this.navAgent.navRVO.targetPos.x = this.targetPos.x;
        this.navAgent.navRVO.targetPos.y = this.targetPos.y;
    }
}
