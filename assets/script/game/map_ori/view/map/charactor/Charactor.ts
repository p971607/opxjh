import { Component, game, Vec3, _decorator } from 'cc';
import { MapViewScene } from '../../MapViewScene';
import RoadNode from '../road/RoadNode';
import { RoadType } from '../road/RoadType';
import { ICharactorClip } from './ICharactorClip';

const { ccclass, property } = _decorator;

export enum CharactorState {
    Idle = 0,
    Run = 1
}

export enum CharactorDirection {
    none = -1,
    bottom = 0,
    left_bottom = 1,
    left = 2,
    left_up = 3,
    up = 4,
    right_up = 5,
    right = 6,
    right_bottom = 7
}

/**
 * 场景角色 
 */
@ccclass('Charactor')
export default class Charactor extends Component {
    /** 优化后的路点移动 */
    static WalkRoadNode: string = "WalkRoadNode";
    /** 移动到新的一个格子路点 */
    static NextRoadNode: string = "NextRoadNode";

    private _direction: CharactorDirection = CharactorDirection.bottom;
    public get direction(): CharactorDirection {
        return this._direction;
    }
    public set direction(value: CharactorDirection) {
        this._direction = value;
        this.clip.setDirection(value);
    }

    private _state: CharactorState = 0;
    public get state(): CharactorState {
        return this._state;
    }
    public set state(value: CharactorState) {
        this._state = value;
        this.clip.setState(value);
    }

    private _alpha: number = 1;
    public get alpha(): number {
        return this._alpha;
    }
    public set alpha(value: number) {
        this._alpha = value;
        this.clip.setAlpha(value);
    }

    private _zIndex: number = 0;
    /** 深度排序 */
    public get zIndex(): number {
        return this._zIndex;
    }

    private _pos!: Vec3;
    /** 玩家地图上的位置 */
    public get pos(): Vec3 {
        return this._pos;
    }
    public set pos(value: Vec3) {
        this._pos = value;
        this.clip.setPos(value);
    }

    public sceneMap: MapViewScene = null!;
    public clip!: ICharactorClip;
    public moving: boolean = false;
    public joystic: boolean = false;
    public joystic_dir: Vec3 = new Vec3();
    public moveSpeed: number = 200;

    /**
     * 玩家当前所站在的地图节点 
     */
    private _currentNode!: RoadNode;
    private _moveAngle: number = 0;
    private _roadNodeArr: RoadNode[] = [];
    private _nodeIndex: number = 0;

    start() {
        this.direction = CharactorDirection.bottom;
        this.state = CharactorState.Idle;
    }

    update(dt: number) {
        // 触摸地图移动
        if (this.moving) {
            var nextNode: RoadNode = this._roadNodeArr[this._nodeIndex];
            var dx: number = nextNode.px - this._pos.x;
            var dy: number = nextNode.py - this._pos.y;
            var speed: number = this.moveSpeed * dt;

            if (dx * dx + dy * dy > speed * speed) {
                if (this._moveAngle == 0) {
                    this._moveAngle = Math.atan2(dy, dx);

                    var dire: number = Math.round((-this._moveAngle + Math.PI) / (Math.PI / 4));
                    this.direction = dire > 5 ? dire - 6 : dire + 2;
                }

                var xspeed: number = Math.cos(this._moveAngle) * speed;
                var yspeed: number = Math.sin(this._moveAngle) * speed;

                this._pos.x += xspeed;
                this._pos.y += yspeed;
            }
            else {
                this._moveAngle = 0;
                if (this._nodeIndex == this._roadNodeArr.length - 1) {
                    this._pos.x = nextNode.px;
                    this._pos.y = nextNode.py;
                    this.stop();
                }
                else {
                    this.walk();
                }
            }

            this.pos = this._pos;
            this.updateZIndex();
        }

        // 摇杆移动
        if (this.joystic) {
            var speed: number = this.moveSpeed * game.deltaTime;
            var xspeed = this.joystic_dir.x * speed;
            var yspeed = this.joystic_dir.y * speed;

            this._pos.x += xspeed;
            this._pos.y += yspeed;

            var nextNode: RoadNode = this.sceneMap.getMapNodeByPixel(this._pos.x, this._pos.y);
            if (nextNode == null || nextNode && nextNode.value == RoadType.Obstacle) {
                this._pos.x -= xspeed;
                this._pos.y -= yspeed;
                return;
            }

            // 角色方向
            var dx: number = this.joystic_dir.x;
            var dy: number = this.joystic_dir.y;
            this._moveAngle = Math.atan2(dy, dx);
            var dire: number = Math.round((-this._moveAngle + Math.PI) / (Math.PI / 4));
            if (dire != this.direction) this.direction = dire > 5 ? dire - 6 : dire + 2;

            this.pos = this._pos;
            this.updateZIndex();
        }

        this.setPlayerStateByNode();
    }

    joystick(dir: Vec3) {
        if (this.moving) {
            this.moving = false;
            this._roadNodeArr.splice(0, this._roadNodeArr.length);
        }

        if (dir.strictEquals(Vec3.ZERO)) {
            this.joystic = false;
            this.state = CharactorState.Idle;
        }
        else {
            this.joystic = true;
            this.state = CharactorState.Run;
        }
        this.joystic_dir.set(dir);
    }

    public updateZIndex() {
        this._zIndex = this.sceneMap.mapLayer!.height - this._pos.y;
    }

    public setPlayerStateByNode(): void {
        var node: RoadNode = this.sceneMap.getMapNodeByPixel(this._pos.x, this._pos.y);
        if (node == this._currentNode) return;

        this._currentNode = node;
        if (this._currentNode) {
            switch (this._currentNode.value) {
                case RoadType.RoadTransparent:                  // 如果是透明节点时
                    if (this.alpha != 0.4) this.alpha = 0.4;
                    break;
                case RoadType.Hidden:                           // 如果是透明节点时（编辑器要按快捷键 R 才可以调出来）
                    this.alpha > 0 && (this.alpha = 0);
                    break;
                default:
                    this.alpha < 1 && (this.alpha = 1);
            }
        }

        // 移动一格事件
        this.node.emit(Charactor.NextRoadNode, node);
    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 
     */
    public walkByRoad(roadNodeArr: RoadNode[]) {
        this._roadNodeArr = roadNodeArr;
        this._nodeIndex = 0;
        this._moveAngle = 0;

        this.walk();
        this.move();
    }

    private walk() {
        if (this._nodeIndex < this._roadNodeArr.length - 1) {
            this._nodeIndex++;

            // 移动一个路点事件
            this.node.emit(Charactor.WalkRoadNode, this._roadNodeArr[this._nodeIndex]);
        }
    }

    public move() {
        this.joystic = false;

        this.moving = true;
        this.state = CharactorState.Run;
    }

    public stop() {
        this.moving = false;
        this.state = CharactorState.Idle;
    }
}
