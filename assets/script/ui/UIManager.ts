// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Component, game, _decorator } from "cc";
import BaseView from "./base/BaseView";


const { ccclass, property } = _decorator;

@ccclass('UIManager')
export default class UIManager extends Component {

    private static _instance: UIManager;
    public static get instance(): UIManager {
        /*if(this._instance == null)
        {
            this._instance = new GameManager();
            this._instance.init();
        }*/
        return this._instance;
    }

    @property(BaseView)
    introduceView: BaseView = null;

    @property(BaseView)
    helpView: BaseView = null;

    @property(BaseView)
    equipShopView: BaseView = null;

    @property(BaseView)
    getPrjView: BaseView = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        UIManager._instance = this;
    }

    start () {

    }

    public init()
    {
        //this.node.active = false;
    }

    update (dt)
    {
        
    }
    
}
