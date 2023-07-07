// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Button,Node, Component, _decorator, EventTouch, Label, director } from "cc";
import { ControlMode } from "../control/ControlMode";
import GameController from "../control/GameController";
import MouseCursorController, { MouseCursorStyle } from "../control/MouseCursorController";
import GameMap from "../game/gameWorld/GameMap";
import GameWorld from "../game/gameWorld/GameWorld";
import { FogOfWar } from "../game/map/fogOfWar/FogOfWar";
import GameManager from "../manager/res/GameManager";
import SceneManager, { SceneData, SceneEventType } from "../manager/scene/SceneManager";
import { SoundManager } from "../manager/sound/SoundManager";
import RVOSystem from "../map/rvo/RVOSystem";



const { ccclass, property } = _decorator;

/**
 * 顶部工具栏，测试功能用，可以删
 */
@ccclass('TopToolBar')
export default class TopToolBar extends Component {

    @property(Button)
    controllBtn: Button = null;

    @property(Button)
    swBtn: Button = null;

    @property(Button)
    roadBtn: Button = null;

    @property(Button)
    mouseStyleBtn: Button = null;

    @property(Button)
    miniMapBtn: Button = null;

    @property(Button)
    fogOfWarBtn: Button = null;

    @property(Button)
    loginBtn: Button = null;

    @property(Node)
    miniMapNode: Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.refreshControlMode();
        this.refreshRoadInfo();

        this.controllBtn.node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
        {
            if(GameController.instance.controlMode == ControlMode.touch)
            {
                GameController.instance.controlMode = ControlMode.joystick
            }else
            {
                GameController.instance.controlMode = ControlMode.touch
            }

            GameWorld.instance.gameMap.myPlayer.controlMode = GameController.instance.controlMode;
            this.refreshControlMode();

        },this);

        this.swBtn.node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
        {
            var newRoleId:number = GameManager.instance.playerMgr.selectRoleId + 1;

            if(newRoleId > 11)
            {
                newRoleId = 1;
            }

            GameManager.instance.playerMgr.selectRoleId = newRoleId;
            GameWorld.instance.gameMap.switchPlayer(newRoleId);

        },this);

        this.roadBtn.node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
        {
            GameMap.isDrawRoadLayer = !GameMap.isDrawRoadLayer;
            GameWorld.instance.gameMap.roadLayer.active = GameMap.isDrawRoadLayer;
            this.refreshRoadInfo();
        },this);

        this.mouseStyleBtn.node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
        {
            var mouseCursorController:MouseCursorController = GameController.instance.getComponent(MouseCursorController);
            if(mouseCursorController.cursorStyle == MouseCursorStyle.custom)
            {
                mouseCursorController.setCursorStyle(MouseCursorStyle.normal);
            }else
            {
                mouseCursorController.setCursorStyle(MouseCursorStyle.custom);
            }

            this.refreshMouseStyleInfo();
        },this);

        this.miniMapBtn.node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
        {
            this.miniMapNode.active = !this.miniMapNode.active;
            this.refreshMiniMapInfo();
        },this);

        this.fogOfWarBtn.node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
        {
            if(FogOfWar.instance == null)
            {
                return;
            }

            FogOfWar.instance.node.active = !FogOfWar.instance.node.active;

            this.refreshFogOfWarInfo();
            
        },this);

        this.loginBtn.node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
        {
            var mouseCursorController:MouseCursorController = GameController.instance.getComponent(MouseCursorController);
            mouseCursorController.setCursorStyle(MouseCursorStyle.normal);
            SoundManager.instance.stopBGSound();
            director.loadScene("Login");

        },this);


        SceneManager.instance.on(SceneEventType.Map_INIT_COMPLETE,this.onMapInitComp,this);

    }

    /**
     * 地图初始化完成
     * @param sceneData 
     */
    private onMapInitComp(sceneData:SceneData)
    {
        this.refreshRoadInfo();
    }

    private refreshControlMode()
    {
        if(GameController.instance == null)
        {
            return;
        }

        if(GameController.instance.controlMode == ControlMode.touch)
        {
            this.controllBtn.getComponentInChildren(Label).string = "切换摇杆导航";
        }else
        {
            this.controllBtn.getComponentInChildren(Label).string = "切换寻路导航";
        }
    }

    private refreshRoadInfo()
    {
        if(GameWorld.instance.gameMap == null)
        {
            return;
        }

        this.roadBtn.node.active == RVOSystem.instance.runing;

        if(GameWorld.instance.gameMap.roadLayer.active)
        {
            this.roadBtn.getComponentInChildren(Label).string = "隐藏路点辅助线";
        }else
        {
            this.roadBtn.getComponentInChildren(Label).string = "显示路点辅助线";
        }
    }

    
    private refreshMouseStyleInfo()
    {
        if(GameController.instance == null)
        {
            return;
        }

        var mouseCursorController:MouseCursorController = GameController.instance.getComponent(MouseCursorController);
        if(mouseCursorController.cursorStyle == MouseCursorStyle.custom)
        {
            this.mouseStyleBtn.getComponentInChildren(Label).string = "切换普通光标";
        }else
        {
            this.mouseStyleBtn.getComponentInChildren(Label).string = "切换自定义光标";
        }
    }

    private refreshMiniMapInfo()
    {
        if(GameWorld.instance.gameMap == null)
        {
            return;
        }

        if(this.miniMapNode.active)
        {
            this.miniMapBtn.getComponentInChildren(Label).string = "隐藏小地图";
        }else
        {
            this.miniMapBtn.getComponentInChildren(Label).string = "显示小地图";
        }
    }

    private refreshFogOfWarInfo()
    {
        if(FogOfWar.instance == null)
        {
            return;
        }

        if(FogOfWar.instance.node.active)
        {
            this.fogOfWarBtn.getComponentInChildren(Label).string = "关闭战争迷雾";
        }else
        {
            this.fogOfWarBtn.getComponentInChildren(Label).string = "打开战争迷雾";
        }
    }

    
}
