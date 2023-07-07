// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, Texture2D, _decorator, game, resources, JsonAsset } from "cc";
import MapData from "../../map/base/MapData";
import { MapLoadModel } from "../../map/base/MapLoadModel";


const { ccclass, property } = _decorator;

/**
 * 场景事件类型
 */
export class SceneEventType
{
    //地图资源加载完成
    public static LOAD_COMPLETE:string = "LOAD_COMPLETE";

    //地图初始化完成
    public static Map_INIT_COMPLETE:string = "MAP_INIT_COMPLETE";
}

/**
 * 地图加载状态
 */
export enum SceneLoadStatus
{
    /**
     * 没有进行加载
     */
    none = 0,

    /**
     * 加载中
     */
    loading = 1,

    /**
     * 已经加载完成
     */
    loaded = 2,
}

/**
 * 场景数据
 */
export class SceneData
{
    /**
     * 当前地图id
     */
     public currentMapId:string = "";

     /**
      * 进入地图后的出生点id
      */
     public enterSpawnId:number = 0;
 
     /**
      * 地图加载模式
      */
     public mapLoadModel:MapLoadModel = MapLoadModel.single;
 
     /**
      * 地图数据
      */
     public mapData:MapData = null;
 
     /**
      * 加载到的地图底图（可能是整张，也可能是缩小后的马赛克底图）
      */
     public bgTex:Texture2D = null;
}

/**
 * 场景管理器
 */
@ccclass('SceneManager')
export default class SceneManager extends Component {

    private static _instance:SceneManager = null;

    public static get instance(): SceneManager {
        if(this._instance == null)
        {
            var node:Node = new Node("SceneManager");
            game.addPersistRootNode(node);
            this._instance = node.addComponent(SceneManager);
            this._instance.init();
        }
        return this._instance;
    }


    /**
     * 加载状态
     */
    public loadStatus:SceneLoadStatus = SceneLoadStatus.none;

    /**
     * 加载数据
     */
    public sceneData:SceneData = new SceneData();

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    /**
     * 初始化
     */
    private init():void
    {
        
    }

    /**
     * 监听事件
     * @param type 
     * @param callback 
     * @param target 
     * @param useCapture 
     */
    public on(type: string, callback: Function, target?: any, useCapture?: boolean): void 
    {
        this.node.on(type,callback,target,useCapture);
    }

    /**
     * 广播事件
     * @param type 
     * @param arg1 
     * @param arg2 
     * @param arg3 
     * @param arg4 
     * @param arg5 
     */
    public emit(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void 
    {
        this.node.emit(type,arg1,arg2,arg3,arg4,arg5);
    }

    /**
     * 加载地图
     * @param mapId 地图id
     * @param enterSpawnId 进入地图的出生点id
     * @param mapLoadModel 加载模式，单张加载，还是切片加载
     */
    public loadMap(mapId:string,enterSpawnId:number,mapLoadModel:MapLoadModel = MapLoadModel.single)
    {
        if(this.loadStatus == SceneLoadStatus.loading)
        {
            return; //如果正在加载资源，拒绝加载
        }

        this.loadStatus = SceneLoadStatus.loading;

        this.sceneData.currentMapId = mapId;
        this.sceneData.enterSpawnId = enterSpawnId;
        this.sceneData.mapLoadModel = mapLoadModel;

        if(mapLoadModel == MapLoadModel.single)
        {
            this.loadSingleMap();
        }else
        {
            this.loadSlicesMap();
        }
    }

    /**
     * 重载地图
     */
    private reloadMap()
    {
        this.loadStatus = SceneLoadStatus.none;
        this.loadMap(this.sceneData.currentMapId,this.sceneData.enterSpawnId,this.sceneData.mapLoadModel);
    }

    /**
     * 加载单张地图（地图比较小的情况用）
     */
    protected loadSingleMap()
    {
        var mapName:string = "" + this.sceneData.currentMapId;

        var mapFilePath:string = "map/data/" + mapName;
        resources.load(mapFilePath,JsonAsset,(error:Error,res:JsonAsset)=>
        {
            if(error != null)
            {
                console.error("地图数据加载失败 mapFilePath = " + mapFilePath, error);
                return;
            }

            this.sceneData.mapData = res.json as MapData;

            var mapBgPath:string = "map/bg/" + this.sceneData.mapData.bgName + "/texture";
            resources.load(mapBgPath,Texture2D,(error:Error,tex:Texture2D)=>
            {
                if(error != null)
                {
                    console.error("地图背景加载失败 mapBgPath = " + mapBgPath, error);
                    return;
                }

                this.loadStatus = SceneLoadStatus.loaded;
                this.sceneData.bgTex = tex;
                this.emit(SceneEventType.LOAD_COMPLETE,this.sceneData); 
                this.emit(SceneEventType.Map_INIT_COMPLETE,this.sceneData); //地图加载事件派发玩后，必定初始化完成了，所以在这个时机派发地图完成初始化事件。如果有特殊情况，需要修改这行代码的位置
            });
        });
    }


    /**
     * 加载分切片地图（地图比较大，加载时间过程。或者超过了 2048 * 2048，微信小游戏不能加载的情况使用）
     */
    protected loadSlicesMap()
    {
        var mapName:string = "" + this.sceneData.currentMapId;

        var mapFilePath:string = "map/data/" + mapName;
        resources.load(mapFilePath,JsonAsset,(error:Error,res:JsonAsset)=>
        {
            if(error != null)
            {
                console.error("地图数据加载失败 mapFilePath = " + mapFilePath, error);
                return;
            }

            this.sceneData.mapData = res.json as MapData;

            var miniMapBgPath:string = "map/bg/" + this.sceneData.mapData.bgName + "/miniMap/texture";
            resources.load(miniMapBgPath,Texture2D,(error:Error,tex:Texture2D)=>
            {
                if(error != null)
                {
                    console.error("小地图背景加载失败 miniMapBgPath = " + miniMapBgPath, error);
                    return;
                }

                this.loadStatus = SceneLoadStatus.loaded;
                this.sceneData.bgTex = tex;
                this.emit(SceneEventType.LOAD_COMPLETE,this.sceneData);
                this.emit(SceneEventType.Map_INIT_COMPLETE,this.sceneData); //地图加载事件派发玩后，必定初始化完成了，所以在这个时机派发地图完成初始化事件。如果有特殊情况，需要修改这行代码的位置
            });

        });
    }
}
