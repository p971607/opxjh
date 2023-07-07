
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, Vec2, Vec3, _decorator, EventTouch, UITransform } from "cc";
import CameraController from "../game/camera/CameraController";
import GameWorld from "../game/gameWorld/GameWorld";
import Player from "../game/unit/actor/player/Player";
import SceneManager, { SceneData, SceneEventType } from "../manager/scene/SceneManager";
import { ControlMode } from "./ControlMode";
import GameController from "./GameController";

const { ccclass, property } = _decorator;

/**
 * 点击控制器
 */
@ccclass('TouchController')
export default class TouchController extends Component {

    private gameController:GameController = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.gameController = this.getComponent(GameController);
    }

    start () {

        //this.controlMode = ControlMode.joystick; //摇杆操作
        //this.controlMode = ControlMode.touch; //点击操作

        SceneManager.instance.on(SceneEventType.Map_INIT_COMPLETE,this.onMapInitComp,this);
    }

    /**
     * 地图初始化完成
     * @param sceneData 
     */
    private onMapInitComp(sceneData:SceneData)
    {
        var touchNode:Node = GameWorld.instance.gameMap.mapLayer.node;
        //var touchNode:Node = GameWorld.instance.gameMap.node;
        touchNode.on(Node.EventType.TOUCH_START,this.onTouchMap,this);
    }

    public onTouchMap(event:EventTouch)
    {
        if(this.gameController.controlMode == ControlMode.touch)
        {
            if(!this.gameController.isCanControlPlayer())
            {
                //不能控制玩家
                return;
            }

            //var pos = this.node.convertToNodeSpaceAR(event.getLocation());

            var touchPos:Vec2 = event.getUILocation();
            var pos:Vec3 = CameraController.instance.getCameraPos().add(new Vec3(touchPos.x,touchPos.y));
            GameWorld.instance.gameMap.showRoadSign(pos);
            var player:Player = GameWorld.instance.gameMap.myPlayer;
            player.navTo(pos.x,pos.y);

        }
    }


    update (dt) 
    {

    }

}
