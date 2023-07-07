
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Graphics, Node, Size, Texture2D, Vec3, _decorator, view } from "cc";
import { Behaviour } from "../../base/Behaviour";
import GameController from "../../control/GameController";
import { DataConfig } from "../../data/cfgdata/DataConfig";
import GameManager from "../../manager/res/GameManager";
import { SceneData } from "../../manager/scene/SceneManager";
import { SoundManager } from "../../manager/sound/SoundManager";
import MapData from "../../map/base/MapData";
import { MapLoadModel } from "../../map/base/MapLoadModel";
import MapParams from "../../map/base/MapParams";
import EntityLayer from "../../map/layer/EntityLayer";
import MapLayer from "../../map/layer/MapLayer";
import ObstacleEdgeUtils, { ObstacleLine } from "../../map/road/ObstacleEdgeUtils";
import PathFindingAgent from "../../map/road/PathFindingAgent";
import PathLog from "../../map/road/PathLog";
import { Vector2 } from "../../map/rvo/Common";
import RVOSystem from "../../map/rvo/RVOSystem";
import { Simulator } from "../../map/rvo/Simulator";
import CameraController from "../camera/CameraController";
import { EditMonsterData, EditNpcData, EditSpawnPointData, EditTransferData } from "../editObjData/EditObjData";
import { FogOfWar } from "../map/fogOfWar/FogOfWar";
import RoadSign from "../map/roadSign/RoadSign";
import SpawnPoint from "../transfer/SpawnPoint";
import TransferDoor from "../transfer/TransferDoor";
import Monster from "../unit/actor/monster/Monster";
import NPC from "../unit/actor/npc/NPC";
import Player, { PlayerControlType, PlayerType } from "../unit/actor/player/Player";

const { ccclass, property } = _decorator;

/**
 * 地图场景逻辑
 * @作者 落日故人 QQ 583051842
 * 
 */
@ccclass('GameMap')
export default class GameMap extends Behaviour {

    public static instance:GameMap = null;

    public static isDrawRoadLayer = false; //是否隐藏路点辅助线

    @property(Node)
    public layer: Node = null;

    @property(MapLayer)
    public mapLayer: MapLayer = null;

    @property(EntityLayer)
    public entityLayer: EntityLayer = null;

    @property(Node)
    public roadLayer: Node = null; 

    /**
     * 玩家自己
     */
    private _myPlayer:Player = null;

    public get myPlayer(): Player {
        return this._myPlayer;
    }

    private _sceneData: SceneData = null;
    public get sceneData(): SceneData {
        return this._sceneData;
    }


    private _mapData:MapData = null;
    public get mapData(): MapData {
        return this._mapData;
    }

    private _mapParams:MapParams = null;

    private roadSign:RoadSign = null;


    /**
     * 场景里所有的出生点
     */
    public spawnPointList:SpawnPoint[] = [];

    /**
     * 场景里所有的传送门
     */
    public transferDoorList:TransferDoor[] = [];

    /**
     * 场景里所有的npc
     */
    public npcList:NPC[] = [];

    /**
     * 场景里所有的怪物
     */
    public monsterList:Monster[] = [];


    private _winSize: Size;
    /**游戏窗口大小 */
    public get winSize(): Size {

        if(this._winSize == null)
        {
            this._winSize = view.getVisibleSize();
        }

        return this._winSize;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        GameMap.instance = this;
        //macro.ENABLE_CULLING = true;
    }

    start () {

        this.node.position = new Vec3(-this.winSize.width / 2, -this.winSize.height / 2);
        this.roadLayer.active = GameMap.isDrawRoadLayer;

    }

    public init(sceneData:SceneData)
    {

        this._sceneData = sceneData;
        this._mapData = sceneData.mapData;

        this._mapParams = this.getMapParams(sceneData.mapData,sceneData.bgTex,sceneData.mapLoadModel); //初始化地图参数

        this.mapLayer.init(this._mapParams);
    
        PathLog.setLogEnable(false); //关闭寻路日志打印信息
        //PathLog.setLogEnable(true); //打开寻路日志打印信息     备注： 想看寻路日志信息，执行这行

        PathFindingAgent.instance.init(sceneData.mapData); //初始化寻路系统
        //PathFindingAgent.instance.setMaxSeekStep(1000); //设置最大寻路步骤
        //PathFindingAgent.instance.setPathOptimize(PathOptimize.best); //设置路径优化类型
        //PathFindingAgent.instance.setPathQuadSeek(PathQuadSeek.path_dire_4); //4方向路点地图，这个方法是用来设置寻路是使用4方向寻路，还是8方向寻路,默认是8方向寻路。对六边形路点地图无效


        //---------------------------------这是自定义寻路时检测路点是否能通过的条件----------------------------------------------
        //寻路系统默认路点值为1是障碍点。如果不想要默认寻路条件，可以自定义寻路条件，在以下回调函数中写自己的路点可通过条件
        /*PathFindingAgent.instance.setRoadNodePassCondition((roadNode:RoadNode):boolean=>
        {
            if(roadNode == null) //等于null, 证明路点在地图外，不允许通过
            {
                return false;
            }

            if(roadNode.value == 1) //路点值等于1，不允许通过
            {
                return false;
            }

            return true;
        });*/
        //-----------------------------------------------------------------------------------------------------------------------


        //设置游戏地图的宽高和背景地图一样大
        this.width = this.mapLayer.width; 
        this.height = this.mapLayer.height;

        //-----------------------------------------------------------------------------
        //RVO 是动态避障算法，两个玩家寻路行走时可以互相避开对方。
        //1、如果你不想让两个玩家行走时互相穿模,比如《星际争霸》，《红警》这些RTS游戏，加上RVO算法是个很好的选择，加上下面这行代码就可以
        //2、如果你只想做普通的RPG游戏，不需要严格的玩家之间避让行走，比如《梦幻西游》，《传奇》，则可以不用加下面这个函数 this.initRVO()，可以注释掉。
        this.initRVO(); //如果要使用RVO,RVO的初始化要优先于各地图单位（玩家，npc，怪等）之前创建
        //-----------------------------------------------------------------------------

        this.initMapElement(); //初始化编辑的地图元素
        this.afterInitMapElement(); //编辑的地图元素后处理
        this.initPlayer(); //初始化玩家
        this.initCamera(); //初始化摄像机
        this.initBGM();//初始化背景音乐
        this.initFogOfWar();//初始化战争迷雾

        //-----------------该地图系统能应对很多种类型的游戏，能应对RPG，SLG，RTS游戏，还可以应对农场类，经营类需要用到地图的游戏--------------------

        //----------------------------------------------------------------------------
        //*************                                              *****************
        //*************                                              *****************
        //************* 如果对地图系统有疑问，可以联系作者 QQ 583051842 *****************
        //*************                                              *****************
        //*************                                              *****************
        //----------------------------------------------------------------------------

    }

    /**
     * 初始化地图元素
     */
    public initMapElement()
    {
        var mapItems:object[] = this._mapData.mapItems;

        if(!mapItems)
        {
            return;
        }

        for(var i:number = 0 ; i < mapItems.length ; i++)
        {
            var mapItem:any = mapItems[i];
            
            if(mapItem.type == "npc")
            {
                this.initNpc(mapItem);
            }else if(mapItem.type == "monster")
            {
                this.initMonster(mapItem);
            }
            else if(mapItem.type == "transfer")
            {
                this.initTransferDoor(mapItem);
            }else if(mapItem.type == "spawnPoint")
            {
                this.initSpawnPoint(mapItem);
            }
        }
    }

    /**
     * 初始化Npc
     */
    private initNpc(editData:EditNpcData)
    {
        var npc:NPC = GameManager.instance.npcMgr.getNPC();
        npc.node.parent = this.entityLayer.node;
        npc.initEditData(editData);
        npc.init();

        if(RVOSystem.instance.runing) //如果RVO系统已经启动
        {
            npc.initRVO(); //如果角色要使用RVO导航，就加这行代码，不需要就注释掉
        } 
    }

    /**
     * 初始化怪物
     */
    private initMonster(editData:EditMonsterData)
    {
        var monster:Monster = GameManager.instance.monsterMgr.getMonster();
        monster.node.parent = this.entityLayer.node;
        monster.initEditData(editData);
        monster.init();

        if(RVOSystem.instance.runing) //如果RVO系统已经启动
        {
            monster.initRVO(); //如果角色要使用RVO导航，就加这行代码，不需要就注释掉
        }
    }

    /**
     * 初始化传送门
     */
    private initTransferDoor(editData:EditTransferData)
    {
        var transferDoor:TransferDoor = GameManager.instance.otherMgr.getTransferDoor(editData.transferType);
        transferDoor.node.parent = this.entityLayer.node;
        transferDoor.initEditData(editData);
        transferDoor.init();
    }

    /**
     * 初始化出生点
     */
    private initSpawnPoint(editData:EditSpawnPointData)
    {
        var spawnPoint:SpawnPoint = GameManager.instance.otherMgr.getSpawnPoint();
        spawnPoint.node.parent = this.entityLayer.node;
        spawnPoint.initEditData(editData);
        spawnPoint.init();
    }
 

    /**
     * 初始化完地图元素的后处理
     */
    private afterInitMapElement()
    {
        this.spawnPointList = this.getComponentsInChildren(SpawnPoint);
        this.transferDoorList = this.getComponentsInChildren(TransferDoor);
        this.npcList = this.getComponentsInChildren(NPC);
        this.monsterList = this.getComponentsInChildren(Monster);
    } 

    /**
     * 初始化玩家
     */
    public initPlayer()
    {
        var spawnPoint:SpawnPoint = this.getSpawnPoint(this.sceneData.enterSpawnId);

        var roleId:number = GameManager.instance.playerMgr.selectRoleId;
        this._myPlayer = GameManager.instance.playerMgr.getPlayer(roleId);
        this._myPlayer.node.parent = this.entityLayer.node;
        this._myPlayer.playerType = PlayerType.my;
        this._myPlayer.controlType = PlayerControlType.user; 
        this._myPlayer.controlMode = GameController.instance.controlMode;
        this._myPlayer.node.position = spawnPoint != null ? spawnPoint.node.position : new Vec3(1000,1000,0); //如果找得到出生点就初始化在出生点的位置，否则默认一个出生位置点给玩家，防止报错。
        
        if(RVOSystem.instance.runing) //如果RVO系统已经启动
        {
            this._myPlayer.initRVO(); //如果角色要使用RVO导航，就加这行代码，不需要就注释掉
        } 
        
    }

    /**
     * 切换玩家
     * @param roleId 
     */
    public switchPlayer(roleId:number) 
    {
        var spawnPos:Vec3 = new Vec3();

        if(this._myPlayer != null)
        {
            spawnPos = this._myPlayer.node.position;
            this._myPlayer.destroySelf();
            this._myPlayer = null;
        }

        this._myPlayer = GameManager.instance.playerMgr.getPlayer(roleId);
        this._myPlayer.node.parent = this.entityLayer.node;
        this._myPlayer.playerType = PlayerType.my;
        this._myPlayer.controlType = PlayerControlType.user; 
        this._myPlayer.controlMode = GameController.instance.controlMode;
        this._myPlayer.node.position = spawnPos;
        
        if(RVOSystem.instance.runing) //如果RVO系统已经启动
        {
            this._myPlayer.initRVO(); //如果角色要使用RVO导航，就加这行代码，不需要就注释掉
        } 

        CameraController.instance.setTarget(this._myPlayer.node); //如果游戏不需要摄像机跟随玩家，可以注释掉这行

    }

    /**
     * 初始化摄像机
     */
    private initCamera()
    {
        CameraController.instance.init(this._mapParams);
        CameraController.instance.setTarget(this._myPlayer.node); //如果游戏不需要摄像机跟随玩家，可以注释掉这行
        CameraController.instance.setViewToPoint(this._myPlayer.node.position.x, this._myPlayer.node.position.y); //将视野对准玩家
    }

    /**
     * 初始化背景音乐
     */
    private initBGM()
    {
        SoundManager.instance.stopBGSound(); //先停止上一个背景音乐
        SoundManager.instance.playBGSound(DataConfig.getMapBGSound(this.sceneData.currentMapId));
    }

    /**
     * 初始化RVO，RVO是处理多人寻路时互相避障的算法，目前只支持方形和菱形格子。(不是必须功能，根据需求可选)
     */
    private initRVO()
    {
        RVOSystem.instance.refresh(); //刷新RVO系统

        var obstacleLines:ObstacleLine[] = ObstacleEdgeUtils.instance.getObstacleEdge(); //获得所有障碍边缘线段
        var len:number = obstacleLines.length;
        
        for(var i:number = 0 ; i < len ; i++)
        {
            var obstacleLine:ObstacleLine = obstacleLines[i];
            var obstacle:Vector2[] = [];
            obstacle.push(new Vector2(obstacleLine.startX, obstacleLine.startY));
            obstacle.push(new Vector2(obstacleLine.endX, obstacleLine.endY));
            Simulator.instance.addObstacle(obstacle); //添加障碍
        }

        Simulator.instance.processObstacles(); //构建障碍树
        RVOSystem.instance.startup();

        //-----------------显示障碍（测试用）--------------------    备注：不需要显示可以注释掉下面的代码
        var graphic = this.roadLayer.getComponent(Graphics);
        ObstacleEdgeUtils.instance.showObstacleEdge(graphic);
        //-----------------------------------------------------

    }

    /**
     * 初始化战争迷雾
     */
    private initFogOfWar()
    {
        if(FogOfWar.instance != null)
        {
            FogOfWar.instance.node.position = new Vec3(-this.winSize.width / 2, -this.winSize.height / 2);
            FogOfWar.instance.init(this.mapLayer.width,this.mapLayer.height); //初始化战争迷雾
        }
    }


    /**
     * 获得地图参数
     * @param mapData 
     * @param bgTex 
     * @param mapLoadModel 
     * @returns 
     */
    public getMapParams(mapData:MapData,bgTex:Texture2D,mapLoadModel:MapLoadModel = 1):MapParams
    {
        //初始化底图参数
        var mapParams:MapParams = new MapParams();
        mapParams.name = mapData.name;
        mapParams.bgName = mapData.bgName;
        mapParams.mapType = mapData.type;
        mapParams.mapWidth = mapData.mapWidth;
        mapParams.mapHeight = mapData.mapHeight;
        mapParams.ceilWidth = mapData.nodeWidth;
        mapParams.ceilHeight = mapData.nodeHeight;
        mapParams.viewWidth = mapData.mapWidth > this.winSize.width ? this.winSize.width : mapData.mapWidth;
        mapParams.viewHeight = mapData.mapHeight > this.winSize.height ? this.winSize.height : mapData.mapHeight;
        mapParams.sliceWidth = 256;
        mapParams.sliceHeight = 256;
        mapParams.bgTex = bgTex;
        mapParams.mapLoadModel = mapLoadModel;

        return mapParams;
    }

    /**
     * 根据id获取出生点
     * @param spawnId 
     * @returns 
     */
    public getSpawnPoint(spawnId:number = 0)
    {
        for(var i:number = 0 ; i < this.spawnPointList.length ; i++)
        {
            if(this.spawnPointList[i].spawnId == spawnId)
            {
                return this.spawnPointList[i];
            }
        }

        if(spawnId == 0)
        {
            //如果没有找到匹配的出生点，则寻找默认出生点
            for(var i:number = 0 ; i < this.spawnPointList.length ; i++)
            {
                if(this.spawnPointList[i].defaultSpawn)
                {
                    return this.spawnPointList[i];
                }
            }
        }

        console.error(`地图${this.sceneData.currentMapId}不存在这个出生点 spawnId = ${spawnId}`);

        return null;
    }

    /**
     * 显示点击路标
     * @param pos 
     */
    public showRoadSign(pos:Vec3)
    {
        if(!this.roadSign)
        {
            this.roadSign = GameManager.instance.otherMgr.getRoadSign();
            this.roadSign.node.parent = this.node;
        }

        this.roadSign.node.position = pos;
        this.roadSign.play();
    }

    public destroySelf()
    {        
        this.node.destroy();
    }

}
