// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Collider, Component, _decorator, Collider2D, ITriggerEvent } from "cc";
import { Behaviour } from "../../../../base/Behaviour";
import TransferDoor from "../../../transfer/TransferDoor";
import Actor from "./Actor";

const { ccclass, property } = _decorator;

/**
 * 角色脚底触发器，用来检测脚底踩到什么东西,和角色配合使用
 */
@ccclass('FootTrigger')
export default class FootTrigger extends Behaviour {

    /**
     * 动画组件
     */
    @property(Actor)
    protected selfActor:Actor = null;

    public get actor():Actor
    {
        if(!this.selfActor && this.node.parent)
        {
            this.selfActor = this.node.parent.getComponent(Actor);
        }
        return this.selfActor;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    //用3d物理碰撞检测
    protected onTriggerEnter(event:ITriggerEvent):void
    {
        var transferDoor:TransferDoor = event.otherCollider.getComponent(TransferDoor);
        if(transferDoor != null) //脚下触碰到传送门时
        {
            transferDoor.onTriggerEnter(this.actor);
        }
    }

    protected onTriggerExit(event:ITriggerEvent):void
    {
        var transferDoor:TransferDoor = event.otherCollider.getComponent(TransferDoor);
        if(transferDoor != null) //脚下触碰到传送门时
        {
            transferDoor.onTriggerEnter(this.actor);
        }
    }

    /* //2d物理碰撞有bug
    public onCollisionEnter2D(self:Collider2D, other:Collider2D)
    {   
        if(other.tag == 2)
        {
            var transferDoor:TransferDoor = other.getComponent(TransferDoor);
            if(transferDoor != null) //脚下触碰到传送门时
            {
                transferDoor.onTriggerEnter(this.actor);
            }
        }
    }

    public onCollisionExit2D(self:Collider2D, other:Collider2D)
    {
        if(other.tag == 2)
        {
            var transferDoor:TransferDoor = other.getComponent(TransferDoor);
            if(transferDoor != null) //脚下触碰到离开传送门时
            {
                transferDoor.onTriggerExit(this.actor);
            }
        }
    }*/
}
