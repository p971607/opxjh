// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import { Component,EventTouch,Node, _decorator } from "cc";
import SceneManager from "../manager/scene/SceneManager";
import { MapLoadModel } from "../map/base/MapLoadModel";

const { ccclass, property } = _decorator;

@ccclass('MapBar')
export default class MapBar extends Component {

    @property(Node)
    mapItems: Node[] = [];


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        for(let i = 0 ; i < this.mapItems.length ; i++)
        {
            this.mapItems[i].on(Node.EventType.TOUCH_START,(event:EventTouch)=>
            {
                SceneManager.instance.loadMap("" + (10000 + (i + 1)),1,MapLoadModel.slices);
            });
        }

    }

    // update (dt) {}
}
