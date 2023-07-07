import { CCBoolean, Camera, Component, EventTouch, Node, Size, Texture2D, UITransform, Vec2, Vec3, _decorator, screen, view } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import MapData from "./map/base/MapData";
import { MapLoadModel } from "./map/base/MapLoadModel";
import MapParams from "./map/base/MapParams";
import { MapType } from "./map/base/MapType";
import Charactor from "./map/charactor/Charactor";
import EntityLayer from "./map/layer/EntityLayer";
import MapLayer from "./map/layer/MapLayer";
import AStarRoadSeeker from "./map/road/AStarRoadSeeker";
import AstarHoneycombRoadSeeker from "./map/road/AstarHoneycombRoadSeeker";
import IRoadSeeker from "./map/road/IRoadSeeker";
import MapRoadUtils from "./map/road/MapRoadUtils";
import Point from "./map/road/Point";
import RoadNode from "./map/road/RoadNode";

const { ccclass, property } = _decorator;

/**
 * 地图场景逻辑
 * 1、地图摄像机跟随角色位置移动
 */
@ccclass('MapViewScene')
export class MapViewScene extends Component {
    @property(Camera)
    public camera: Camera | null = null;

    @property(Node)
    public layer: Node | null = null;

    @property(MapLayer)
    public mapLayer: MapLayer | null = null;

    @property(Node)
    public floorLayer: Node | null = null;

    @property(EntityLayer)
    public entityLayer: EntityLayer | null = null;

    @property(CCBoolean)
    public isFollowPlayer: boolean = true;

    /** 2D转3D位置比例值 */
    ratio: Vec2 = new Vec2();

    private _roadDic: { [key: string]: RoadNode } = {};
    private _roadSeeker!: IRoadSeeker;
    private _mapParams: MapParams | null = null;

    private player: Charactor | null = null;            // 主角玩家
    private targetPos: Vec3 = new Vec3();               // 摄像机位置
    private winSize!: Size;                             // 屏幕尺寸
    private screenCenter: Vec3 = new Vec3();            // 屏幕中心位置
    private boundary: Vec2 = new Vec2();                // 边界位置

    setPlayer(value: Charactor | Vec3) {
        if (value instanceof Charactor) {
            this.enabled = true;
            this.player = value;
        }
        else {
            this.player!.pos = value;
        }
        this.setViewToPlayer();
    }

    onLoad() {
        this.enabled = false;
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onMapMouseDown, this);
    }

    /** 计算摄像机位置 */
    private calculateCameraPos(isLerp: boolean, dt: number = 0) {
        if (this.targetPos.x > this.boundary.x) {
            this.targetPos.x = this.boundary.x;
        }
        else if (this.targetPos.x < 0) {
            this.targetPos.x = 0;
        }

        if (this.targetPos.y > this.boundary.y) {
            this.targetPos.y = this.boundary.y;
        }
        else if (this.targetPos.y < 0) {
            this.targetPos.y = 0;
        }

        this.targetPos.z = this.camera!.node.position.z;
        if (isLerp) {
            this.targetPos = this.camera!.node.position.lerp(this.targetPos, dt * 2.0);          // 不线性差值位置就是正确的
        }
        this.camera!.node.position = this.targetPos;

        if (this._mapParams!.mapLoadModel == MapLoadModel.slices) {
            this.mapLayer!.loadSliceImage(this.targetPos.x, this.targetPos.y);
        }
    }

    private reset() {
        this.floorLayer!.removeAllChildren();                                                            // 清除地面显示对象
        this.entityLayer!.clear();                                                                       // 清除游戏实体对象
        this.mapLayer!.clear();                                                                          // 清除地图瓦片显示对象

        this._roadDic = {};

        if (this._mapParams) {
            // oops.res.releaseDir(`maps/${this.current_map.name}`, GameConfig.remote_bundle_name);     // 清除地图瓦片资源内存
            oops.res.releaseDir(`content/map/${this._mapParams!.name}`);                                // 清除地图瓦片资源内存
        }
    }

    public init(mapData: MapData, bgTex: Texture2D, mapLoadModel: MapLoadModel = 1) {
        this.reset();

        this.winSize = view.getVisibleSize();
        this.screenCenter = new Vec3(this.winSize.width / 2, this.winSize.height / 2);                   // 屏幕中心点
        this.node.position = this.screenCenter.clone().negative();

        this.ratio.x = screen.windowSize.width / this.winSize.width;
        this.ratio.y = screen.windowSize.height / this.winSize.height;

        MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

        // 初始化底图参数
        if (this._mapParams == null) this._mapParams = new MapParams();

        this._mapParams.name = mapData.name;
        this._mapParams.bgName = mapData.bgName;
        this._mapParams.mapType = mapData.type;
        this._mapParams.mapWidth = mapData.mapWidth;
        this._mapParams.mapHeight = mapData.mapHeight;
        this._mapParams.ceilWidth = mapData.nodeWidth;
        this._mapParams.ceilHeight = mapData.nodeHeight;

        this._mapParams.viewWidth = mapData.mapWidth > this.winSize.width ? this.winSize.width : mapData.mapWidth;
        this._mapParams.viewHeight = mapData.mapHeight > this.winSize.height ? this.winSize.height : mapData.mapHeight;
        this._mapParams.sliceWidth = 256;
        this._mapParams.sliceHeight = 256;
        this._mapParams.bgTex = bgTex;
        this._mapParams.mapLoadModel = mapLoadModel;

        this.boundary.x = this._mapParams!.mapWidth - this.winSize.width;
        this.boundary.y = this._mapParams!.mapHeight - this.winSize.height;
        this.mapLayer!.init(this._mapParams);

        var len: number = mapData.roadDataArr.length;
        var len2: number = mapData.roadDataArr[0].length;

        var value: number = 0;
        var dx: number = 0;
        var dy: number = 0;

        for (var i: number = 0; i < len; i++) {
            for (var j: number = 0; j < len2; j++) {
                value = mapData.roadDataArr[i][j];
                dx = j;
                dy = i;

                var node: RoadNode = MapRoadUtils.instance.getNodeByDerect(dx, dy);
                node.value = value;

                this._roadDic[node.cx + "_" + node.cy] = node;
            }
        }

        // 换新地图必须重置地形数据
        if (mapData.type == MapType.honeycomb) {
            this._roadSeeker = new AstarHoneycombRoadSeeker(this._roadDic);
        }
        else {
            this._roadSeeker = new AStarRoadSeeker(this._roadDic);
        }

        var uiTransform = this.node.getComponent(UITransform);

        if (uiTransform) {
            uiTransform.width = this.mapLayer!.width;
            uiTransform.height = this.mapLayer!.height;
        }
    }

    public getMapNodeByPixel(px: number, py: number): RoadNode {
        var point: Point = MapRoadUtils.instance.getWorldPointByPixel(px, py);
        var node: RoadNode = this._roadDic[point.x + "_" + point.y];
        return node;
    }

    public onMapMouseDown(event: EventTouch): void {
        if (this.player!.clip.checkTouch(event) == false) {
            var p = event.getUILocation();
            var touPos: Vec3 = new Vec3(p.x, p.y);
            var newPos: Vec3 = new Vec3();
            Vec3.add(newPos, this.camera!.node.position, touPos);
            this.movePlayer(newPos.x, newPos.y);
        }
    }

    update(dt: number) {
        if (this.isFollowPlayer) {
            this.followPlayer(dt);
        }
    }

    /**
     * 视图跟随玩家
     * @param dt 
     */
    public followPlayer(dt: number) {
        this.targetPos = this.player!.pos.clone().subtract(this.screenCenter);        // 摄像机位置为屏幕剧中
        this.calculateCameraPos(true, dt);
    }

    /**
     * 把视野定位到给定位置 
     * @param px
     * @param py
     */
    public setViewToPoint(px: number, py: number): void {
        this.targetPos = new Vec3(px, py).subtract(this.screenCenter);                          // 摄像机位置为屏幕剧中
        this.calculateCameraPos(false);
    }

    /**
     * 将视野对准玩家
     */
    public setViewToPlayer(): void {
        this.setViewToPoint(this.player!.pos.x, this.player!.pos.y);
    }

    /**
     * 移动玩家 
     * @param targetX 移动到的目标点x
     * @param targetY 移到到的目标点y
     */
    public movePlayer(targetX: number, targetY: number) {
        var startPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(this.player!.pos.x, this.player!.pos.y);
        var targetPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY);

        var startNode: RoadNode = this._roadDic[startPoint.x + "_" + startPoint.y];
        var targetNode: RoadNode = this._roadDic[targetPoint.x + "_" + targetPoint.y];

        if (startNode != targetNode) {
            //var roadNodeArr:RoadNode[] = this._roadSeeker.seekPath(startNode,targetNode);      // 点击到障碍点不会行走
            var roadNodeArr: RoadNode[] = this._roadSeeker.seekPath2(startNode, targetNode);     // 点击到障碍点会行走到离障碍点最近的可走路点

            if (roadNodeArr.length > 0) {
                this.player!.walkByRoad(roadNodeArr);
            }
        }
        else {
            this.player!.walkByRoad([startNode]);
        }
    }
}
