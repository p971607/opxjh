import { Node, Component, _decorator, Enum, CCString } from "cc";

import { GamePlatformType } from "./GamePlatformType";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = _decorator;

/**
 * 游戏平台配置
 */
 @ccclass('GamePlatformConfig')
export default class GamePlatformConfig extends Component {

    /**
     * 平台类型
     */
    @property({type:Enum(GamePlatformType),displayName:"平台类型"})
    public type:GamePlatformType = GamePlatformType.none;

    /**
     * 游戏appid
     */
     @property({displayName:"游戏appid"})
    public appId:string = "";

    /**
     * 游戏密匙
     */
     @property({displayName:"游戏密匙"})
    public secret:string = "";

    /**
     * 视频广告
     */
    @property({type:CCString,displayName:"视频广告"})
    public videoAd_unitIds:string[] = ["","","","",""];

    /**
     * 横幅广告
     */
     @property({type:CCString,displayName:"横幅广告"})
    public bannerAd_unitIds:string[] = ["","","","",""];

    // update (dt) {}
}
