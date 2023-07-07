// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, _decorator, game } from "cc";
import { UInput, UKeyCode } from "../../plugin/InputManager";

const { ccclass, property } = _decorator;

/**
 * 系统接口，各个系统需要实现这个接口
 */
export interface ISystem 
{
    init();
    register();
    release();
}

/**
 * 系统管理 全局对象 用于做低层数据处理 生命周期一直存在
 */
@ccclass('SystemManager')
export default class SystemManager extends Component {


    private static _instance: SystemManager;
    public static get instance(): SystemManager {
        if (this._instance == null) {
            var node: Node = new Node("SystemManager");
            node.setSiblingIndex(1000);
            game.addPersistRootNode(node);
            this._instance = node.addComponent(SystemManager);
            this._instance.init();
        }
        return this._instance;
    }

    private init() 
    {

    }

    /**
     * 启动系统管理
     */
    public startup() 
    {
        console.log("SystemManager 启动系统管理");
    }


    onLoad() 
    {
        //game.setFrameRate(60); //设置游戏帧率
    }

    start() 
    {

    }

    update(dt) 
    {

        if(CC_EDITOR || CC_PREVIEW)
        {
            if (UInput.getKeyDown(UKeyCode.Space)) 
            {
                //按下space键时触发
            }
        }
    }


    /**
     * 注册各子系统
     */
    public RegisterSystems()
    {

    }
}


if (!CC_EDITOR) 
{
    SystemManager.instance.startup();//启动输入管理
}

declare const CC_EDITOR:boolean;
declare const CC_PREVIEW:boolean;