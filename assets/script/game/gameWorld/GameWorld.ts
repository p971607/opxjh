// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import {Node, Component, instantiate, Prefab, _decorator, Vec3 } from "cc";
import SceneManager, { SceneData, SceneEventType } from "../../manager/scene/SceneManager";
import GameMap from "./GameMap";

const { ccclass, property } = _decorator;

/**
 * 游戏世界类，管理着游戏地图
 */
@ccclass('GameWorld')
export default class GameWorld extends Component {

    public static instance:GameWorld = null;

    @property(Prefab)
    private gameMapPrefab: Prefab = null;

    public gameMap:GameMap = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        GameWorld.instance = this;
        this.init();
    }

    start () {

    }

    private init()
    {
        this.registerEvent();
    }

    /**
     * 注册事件
     */
    private registerEvent()
    {
        SceneManager.instance.on(SceneEventType.LOAD_COMPLETE,this.onSceneLoadComp,this);
    }

    private onSceneLoadComp(sceneData:SceneData)
    {
        if(this.gameMap != null)
        {
            this.gameMap.destroySelf(); //销毁上一个地图
            this.gameMap = null;
        }

        this.gameMap = this.createMap();
        this.gameMap.init(sceneData);
    }

    /**
     * 创建地图
     * @returns 
     */
    private createMap():GameMap
    {
        var map:GameMap = instantiate(this.gameMapPrefab).getComponent(GameMap);
        map.node.parent = this.node;
        map.node.active = true;
        map.node.position = new Vec3(0,0,0);
        
        return map;
    }

    /**
     * 地图是否有效
     * @returns 
     */
    public isMapValid():boolean
    {
        return this.gameMap != null && this.gameMap.isValid && this.gameMap.node.isValid;
    }

    // update (dt) {}
}
