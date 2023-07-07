// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, Vec3, _decorator } from "cc";

const { ccclass, property } = _decorator;

/**
 * 摇杆
 */
@ccclass('Joystick')
export default class Joystick extends Component {

    @property(Node)
    private cursor: Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.node.scale = 2.5;
    }

    /**
     * 移动摇杆光标位置
     * @param dir 
     */
    public cursorTo(dir:Vec3)
    {
        /*var angle:number = Math.atan2(dir.y,dir.x);
        this.cursor.x = 20 * Math.cos(angle);
        this.cursor.y = 20 * Math.sin(angle);*/
        this.cursor.position = dir.clone().multiplyScalar(20);
    }

    public show()
    {
        this.node.active = true;
    }

    public hidden()
    {
        this.node.active = false;
    }

    // update (dt) {}
}
