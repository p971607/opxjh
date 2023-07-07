// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, Enum, EventTouch, game, Vec2, Vec3, _decorator, view, Size } from "cc";

const { ccclass, property } = _decorator;

/**
 * 鼠标光标样式
 */
export enum MouseCursorStyle
{
    /**
     * 普通样式
     */
    normal = 0,

    /**
     * 自定义样式
     */
    custom = 1,
}

/**
 * 鼠标光标控制器 （可以控制鼠标风格）
 */
@ccclass('MouseCursorController')
export default class MouseCursorController extends Component {

    @property({type:Enum(MouseCursorStyle),tooltip:"默认鼠标光标样式 "})
    public defaultCursorStyle:MouseCursorStyle = MouseCursorStyle.custom;

    @property(Node)
    public touchPlane:Node = null;

    @property(Node)
    public mouseCursor:Node = null;

    public mousePos:Vec3 = new Vec3(0,0,0);

    public currMousePos:Vec3 = new Vec3(0,0,0);

    /**
     * 当前使用的鼠标光标样式
     */
    public cursorStyle:MouseCursorStyle = MouseCursorStyle.custom;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        var winSize:Size = view.getVisibleSize();
        this.mousePos.x = -winSize.width;
        this.mousePos.y = -winSize.height;
        this.setCursorStyle(this.defaultCursorStyle);

        this.touchPlane.on(Node.EventType.MOUSE_MOVE,this.onTouchMove,this);

    }

    /**
     * 设置鼠标光标样式
     */
    public setCursorStyle(style:MouseCursorStyle)
    {
        //game.canvas.style.cursor = "default" //默认箭头鼠标光标
        //game.canvas.style.cursor = "pointer" //手指型鼠标光标
        //game.canvas.style.cursor = "None";     //隐藏鼠标光标，一般用于自定义鼠标光标是设置。

        this.cursorStyle = style;

        if(this.cursorStyle == MouseCursorStyle.custom) //如果是自定义鼠标光标
        {
            game.canvas.style.cursor = "None";
            this.mouseCursor.active = true;
            this.mouseCursor.position = this.mousePos;
        }else
        {
            game.canvas.style.cursor = "default";
            this.mouseCursor.active = false;
        }

    }

    public onTouchMove(event:EventTouch)
    {
        var winSize = view.getVisibleSize();
        var pos:Vec2 = event.getUILocation().subtract(new Vec2(winSize.width / 2,winSize.height / 2));
        this.mousePos.x = pos.x;
        this.mousePos.y = pos.y;
    }

    update (dt)
    {
        this.mousePos = this.mouseCursor.position.lerp(this.mousePos,dt * 40);
        this.mouseCursor.position = this.mousePos;
    }
}
