
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, EventTouch, Vec2, Vec3, _decorator, Size, view } from "cc";
import GameWorld from "../game/gameWorld/GameWorld";
import Player from "../game/unit/actor/player/Player";
import SceneManager, { SceneData, SceneEventType } from "../manager/scene/SceneManager";
import { UInput } from "../plugin/InputManager";
import { ControlMode } from "./ControlMode";
import GameController from "./GameController";
import Joystick from "./Joystick";

const { ccclass, property } = _decorator;

/**
 * 摇杆控制器
 */
@ccclass('JoystickController')
export default class JoystickController extends Component {

    @property(Joystick)
    public joyStick:Joystick = null;

    private touchPos:Vec2 = Vec2.ZERO;

    private gameController:GameController = null;

    private joyMoveDir:Vec3 = new Vec3(0,0,0);
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.gameController = this.getComponent(GameController);
    }

    start () 
    {
        SceneManager.instance.on(SceneEventType.Map_INIT_COMPLETE,this.onMapInitComp,this);
    }

    /**
     * 地图初始化完成
     * @param sceneData 
     */
    private onMapInitComp(sceneData:SceneData)
    {
        //var touchNode:Node = GameWorld.instance.gameMap.mapLayer.node; 
        var touchNode:Node = GameWorld.instance.gameMap.node;
        touchNode.on(Node.EventType.TOUCH_START,this.onJoystickTouchStart,this);
        touchNode.on(Node.EventType.TOUCH_MOVE,this.onJoystickTouchMove,this);
        touchNode.on(Node.EventType.TOUCH_END,this.onJoystickTouchEnd,this);
        touchNode.on(Node.EventType.TOUCH_CANCEL,this.onJoystickTouchEnd,this);
    }

    protected update(dt: number): void 
    {
        if(this.gameController.controlMode != ControlMode.joystick)
        {
            //当前状态不是摇杆控制
            return;
        }

        if(!this.gameController.isCanControlPlayer())
        {
            //不能控制玩家
            return;
        }

        var player:Player = GameWorld.instance.gameMap.myPlayer;

        if(UInput.axis.x != 0) //如果键盘方向键(或WASD)在按,优先使用键盘
        {
            player.moveDir.x = UInput.axis.x;
        }else
        {
            player.moveDir.x = this.joyMoveDir.x;
        }

        if(UInput.axis.y != 0) //如果键盘方向键(或WASD)在按,优先使用键盘
        {
            player.moveDir.y = UInput.axis.y;
        }else
        {
            player.moveDir.y = this.joyMoveDir.y;
        }

    }

    public onJoystickTouchStart(event:EventTouch)
    {
        if(this.gameController.controlMode == ControlMode.joystick)
        {
            if(!this.gameController.isCanControlPlayer())
            {
                //不能控制玩家
                return;
            }

            var winSize:Size = view.getVisibleSize();

            this.touchPos = event.getUILocation();
            this.joyStick.node.position = new Vec3(this.touchPos.x - winSize.width * 0.5,this.touchPos.y - winSize.height * 0.5);
            this.joyStick.show();
        }
    }

    public onJoystickTouchMove(event:EventTouch)
    {
        if(this.gameController.controlMode == ControlMode.joystick)
        {
            if(!this.gameController.isCanControlPlayer())
            {
                //不能控制玩家
                return;
            }

            var currentPos:Vec2 = event.getUILocation();
            var moveDir:Vec2 = currentPos.subtract(this.touchPos).normalize();
            this.joyMoveDir.x = moveDir.x;
            this.joyMoveDir.y = moveDir.y;
            this.joyStick.cursorTo(this.joyMoveDir);
        }
    }

    public onJoystickTouchEnd(event:EventTouch)
    {
        if(this.gameController.controlMode == ControlMode.joystick)
        {
            if(!this.gameController.isCanControlPlayer())
            {
                //不能控制玩家
                return;
            }

            this.joyMoveDir.x = 0;
            this.joyMoveDir.y = 0;

            this.joyStick.hidden();
        }
    }

}
