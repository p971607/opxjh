// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node, Component, _decorator, EventTouch, Vec2, Vec3, view, Size, UITransform } from "cc";
import { Behaviour } from "../../base/Behaviour";

const { ccclass, property } = _decorator;

/**
 * 基础窗口组件
 */
 @ccclass('BaseView')
export default class BaseView extends Behaviour {

    @property({tooltip:"窗口是否可拖拽:\n勾选可拖拽 \n不勾选不可拖拽"})
    canDrag:boolean = true;

    @property(Node)
    content: Node = null;

    @property(Node)
    title:Node = null;

    @property(Node)
    closeBtn:Node = null;

    private _startDrag:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.closeBtn.on(Node.EventType.TOUCH_START,this.onCloseBtnClick,this);
        
        if(this.canDrag)
        {
            this.title.on(Node.EventType.TOUCH_START,(event:EventTouch)=>
            {
                this._startDrag = true;
            },this);
    
            this.title.on(Node.EventType.TOUCH_END,(event:EventTouch)=>
            {
                this._startDrag = false;
    
            },this);
    
            this.node.on(Node.EventType.TOUCH_MOVE,(event:EventTouch)=>
            {
                if(this._startDrag)
                {
                    //var offset:Vec3 = this.title.convertToNodeSpaceAR(event.getLocation());

                    var parentTransform:UITransform = this.node.parent.getComponent(UITransform); 
                    if(parentTransform == null)
                    {
                        parentTransform = this.node.parent.addComponent(UITransform); 
                    }

                    var wpos:Vec3 = parentTransform.convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y));
                    var newPos:Vec3 = wpos.subtract(this.title.position);
                    
                    var winSize:Size = view.getVisibleSize();

                    if(newPos.x < -(winSize.width - this.width) / 2)
                    {
                        newPos.x = -(winSize.width - this.width) / 2;
                    }else if(newPos.x > (winSize.width -  this.width) / 2)
                    {
                        newPos.x = (winSize.width -  this.width) / 2;
                    }
    
                    if(newPos.y < -(winSize.height - this.height) / 2)
                    {
                        newPos.y = -(winSize.height - this.height) / 2;
                    }else if(newPos.y > (winSize.height -  this.height) / 2)
                    {
                        newPos.y = (winSize.height -  this.height) / 2;
                    }
    
                    this.node.position = newPos;
                }
      
            },this);
        }

        
    }

    start () {

    }

    protected onCloseBtnClick(event:EventTouch)
    {
        this.close();
    }

    // update (dt) {}

    public open()
    {
        this._startDrag = false;
        this.node.active = true;
        this.node.position = new Vec3(0,0,0);
    }

    public close()
    {
        this.node.active = false;
    }
}
