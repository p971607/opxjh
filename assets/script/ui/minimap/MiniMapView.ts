// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, _decorator, Sprite, Size, Texture2D, SpriteFrame, Vec3, Graphics, EventTouch, view, UITransform } from "cc";
import CameraController from "../../game/camera/CameraController";
import GameWorld from "../../game/gameWorld/GameWorld";
import { FogOfWar } from "../../game/map/fogOfWar/FogOfWar";
import TransferDoor from "../../game/transfer/TransferDoor";
import Monster from "../../game/unit/actor/monster/Monster";
import NPC from "../../game/unit/actor/npc/NPC";
import SceneManager, { SceneData, SceneEventType } from "../../manager/scene/SceneManager";
import MapRoadUtils from "../../map/road/MapRoadUtils";

const { ccclass, property } = _decorator;

/**
 * 小地图预览,如果不需要这块功能，可以放心把这个脚本删掉，这个类已经完全解耦了，其他模块不会受影响
 * 
 * @作者 落日故人 QQ 583051842
 */
 @ccclass('MiniMapView')
export default class MiniMapView extends Component {

    /**
     * 放置小地图的父容器
     */
    @property(Node)
    content: Node = null;

    /**
     * 小地图
     */
    @property(Sprite)
    miniMap: Sprite = null;

    /**
     * 小地图
     */
    @property(Sprite)
    fogMask: Sprite = null;

    /**
     * 小地图上面展示的视野区域
     */
    @property(Node)
    viewRect: Node = null;

    /**
     * 小地图相对于大地图的缩放倍数
     */
    private _mapScale:number = 1;

    /**
     * 小地图显示区域大小
     */
    private _rectSize:Size = new Size(0,0);

    /**
     * 是否已经初始化
     */
    private _isInit:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.miniMap.node.on(Node.EventType.TOUCH_START,this.onClickMiniMap,this);
        SceneManager.instance.on(SceneEventType.Map_INIT_COMPLETE,this.onMapInitComp,this);

    }

    /**
     * 地图初始化完成
     * @param sceneData 
     */
    private onMapInitComp(sceneData:SceneData)
    {
        this.init(sceneData.bgTex);
    }

    public init(bgTex:Texture2D)
    {
        this._isInit = true;

        var spriteFrame:SpriteFrame = new SpriteFrame();
        spriteFrame.texture = bgTex;

        this.miniMap.spriteFrame = spriteFrame;
        
        var contentTransform:UITransform = this.content.getComponent(UITransform);
        var miniMapTransform:UITransform = this.miniMap.getComponent(UITransform);
        var viewSize:Size = view.getVisibleSize(); //因为游戏地图是全屏展示，所以用游戏分辨率作为显示尺寸。如果有特殊需求，不全屏显示游戏的话，改一下这个值就可以

        if(bgTex.width > bgTex.height)
        {
            miniMapTransform.width =  contentTransform.width - 4;
            miniMapTransform.height = bgTex.height * (miniMapTransform.width / bgTex.width);
        }else
        {
            miniMapTransform.height = contentTransform.height - 4;
            miniMapTransform.width = bgTex.width * (miniMapTransform.height / bgTex.height);
        }

        var pos:Vec3 = this.miniMap.node.position;
        pos.x = -miniMapTransform.width / 2;
        pos.y = -miniMapTransform.height / 2;

        this.miniMap.node.position = pos;
        this.viewRect.position = pos;

        if(FogOfWar.instance != null)
        {
            this.fogMask.node.position = pos;
            this.fogMask.getComponent(UITransform).setContentSize(new Size(miniMapTransform.width,miniMapTransform.height));
            this.fogMask.node.active = true;
            this.fogMask.spriteFrame.texture = FogOfWar.instance.maskTex;
        }

        var mapWidth:number = MapRoadUtils.instance.mapWidth;
        var mapHeight:number = MapRoadUtils.instance.mapHeight;

        this._mapScale = miniMapTransform.width / mapWidth;


        this._rectSize.width = viewSize.width * this._mapScale;
        this._rectSize.height = viewSize.height * this._mapScale;

        this.refreshViewRect(0,0);
    }

    /**
     * 刷新小地图的绘制
     * @param mapX 
     * @param mapY 
     */
    public refreshViewRect(mapX:number,mapY:number)
    {
        var graphics:Graphics = this.viewRect.getComponent(Graphics);
        if(!graphics)
        {
            graphics = this.viewRect.addComponent(Graphics);
        }

        var viewSize:Size = view.getVisibleSize(); //因为游戏地图是全屏展示，所以用游戏分辨率作为显示尺寸。如果有特殊需求，不全屏显示游戏的话，改一下这个值就可以

        var mapWidth:number = MapRoadUtils.instance.mapWidth;
        var mapHeight:number = MapRoadUtils.instance.mapHeight;

        var rx:number = mapX; 
        var ry:number = mapY; 

        if(rx < 0)
        {
            rx = 0
        }else if(rx > mapWidth - viewSize.width)
        {
            rx = mapWidth - viewSize.width;
        }

        if(ry < 0)
        {
            ry = 0
        }else if(ry > mapHeight - viewSize.height)
        {
            ry = mapHeight - viewSize.height;
        }

        var rx:number = rx * this._mapScale;
        var ry:number = ry * this._mapScale;

        graphics.clear();
        graphics.rect(rx,ry,this._rectSize.width, this._rectSize.height);
        graphics.lineWidth = 2.5;
        graphics.strokeColor.fromHEX("#ffffff")
        graphics.stroke();

        var pos:Vec3;

        if(GameWorld.instance.gameMap.myPlayer)
        {
            pos = GameWorld.instance.gameMap.myPlayer.node.position
            this.drawCircleFlag(graphics,pos,"#ffff00aa",5); //绘制玩家标记
        }

        var npcList:NPC[] = GameWorld.instance.gameMap.npcList;
        var len:number = npcList.length;
        for(var i:number = 0 ;i < len; i++)
        {
            pos = npcList[i].node.position;
            this.drawCircleFlag(graphics,pos,"#00ff00aa",4); //绘制npc标记
        }

        var monsterList:Monster[] = GameWorld.instance.gameMap.monsterList;
        len = monsterList.length;
        for(var i:number = 0 ;i < len; i++)
        {
            pos = monsterList[i].node.position;
            this.drawCircleFlag(graphics,pos,"#ff0000aa",3); //绘制怪物标记
        }

        var transferDoorList:TransferDoor[] = GameWorld.instance.gameMap.transferDoorList;
        len = transferDoorList.length;
        for(var i:number = 0 ;i < len; i++)
        {
            pos = transferDoorList[i].node.position;
            this.drawCircleFlag(graphics,pos,"#0000ffaa",7); //绘制传送门标记
        }

        //如果还想在小地图绘制别的物体标记，继续往下写

    }

    private drawCircleFlag(graphics:Graphics,pos:Vec3,hexColor:string, radius:number)
    {
        graphics.fillColor.fromHEX(hexColor);
        graphics.circle(pos.x * this._mapScale, pos.y * this._mapScale,radius);
        graphics.fill();
    }

    private onClickMiniMap(event:EventTouch)
    {
        var miniMapTransform:UITransform = this.miniMap.getComponent(UITransform);
        var pos:Vec3 = miniMapTransform.convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y));
        pos.x = pos.x / this._mapScale;
        pos.y = pos.y / this._mapScale;

        GameWorld.instance.gameMap.myPlayer.navTo(pos.x,pos.y); //点击小地图某个位置，玩家导航到游戏地图对应位置
    }

    update (dt:number) 
    {
        if(!this._isInit)
        {
            return;
        }

        var cameraPos:Vec3 = CameraController.instance.getCameraPos();
        this.refreshViewRect(cameraPos.x, cameraPos.y);

        if(FogOfWar.instance != null)
        {
            this.fogMask.node.active = FogOfWar.instance.node.active;
        }
    }
}
