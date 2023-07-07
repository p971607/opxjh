// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, _decorator } from "cc";
import Actor from "../base/Actor";

const { ccclass, property } = _decorator;

@ccclass('Pet')
export default class Pet extends Actor {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    /**
     * 初始化
     */
    public init()
    {

    }

    // update (dt) {}
}
