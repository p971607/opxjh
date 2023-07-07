// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Component, Enum, _decorator } from "cc";
import GameWorld from "../game/gameWorld/GameWorld";
import Player from "../game/unit/actor/player/Player";
import SceneManager, { SceneLoadStatus } from "../manager/scene/SceneManager";
import { ControlMode } from "./ControlMode";

const { ccclass, property } = _decorator;

 /**
  * 游戏控制器
  */
@ccclass('GameController')
export default class GameController extends Component {

    public static instance:GameController = null;

    @property({type:Enum(ControlMode),tooltip:"控制模式:\ntouch  点击行走 \njoystick 摇杆操作 "})
    public controlMode:ControlMode = ControlMode.joystick;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        GameController.instance = this;
        this.init();
    }

    start () {

    }

    private init()
    {
        
    }

    // update (dt) {}

    /**
     * 当前是否能控制玩家
     * @returns 
     */
    public isCanControlPlayer():boolean
    {
        if(SceneManager.instance.loadStatus == SceneLoadStatus.loading)
        {
            //地图还在加载中
            return false;
        }

        if(!GameWorld.instance.isMapValid())
        {
            //如果地图无效
            return false;
        }

        var player:Player = GameWorld.instance.gameMap.myPlayer;

        if(player == null)
        {
            //要控制的玩家不存在
            return false;
        }

        return true;
    }
}
