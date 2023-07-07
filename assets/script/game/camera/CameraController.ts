// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Node, Camera, Component, Vec3, _decorator, Size, view, Vec2 } from "cc";
import MapParams from "../../map/base/MapParams";

const { ccclass, property } = _decorator;

/**
 * 摄像机控制类
 */
@ccclass('CameraController')
export default class CameraController extends Component {

    public static instance:CameraController = null;

    @property(Camera)
    private camera:Camera = null;


    private target:Node = null;
    private targetPos:Vec3 = new Vec3(0,0,0);

    private _mapParams:MapParams = null;

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
        CameraController.instance = this;
    }

    public init(mapParams:MapParams):void
    {
        this._mapParams = mapParams;
    }

    update (dt) 
    {
        this.followTarget(dt);
    }
    
    /**
     * 获得摄像机坐标
     * @returns 
     */
    public getCameraPos():Vec3
    {
        if(this.camera == null)
        {
            return new Vec3(0,0,0);
        }

        //对摄像机位置向上取整后返回
        return new Vec3(Math.ceil(this.camera.node.position.x), Math.ceil(this.camera.node.position.y),0);
    }

    public setTarget(target:Node)
    {
        this.target = target;
    }

    /**
     * 视野跟随目标
     * @param dt 
     */
    public followTarget(dt:number):void
    {
        if((this.target == null || !this.target.isValid) || this.camera == null)
        {
            return;
        }
        

        this.targetPos = this.target.position.clone().subtract(new Vec3(this.winSize.width / 2, this.winSize.height / 2));

        if(this._mapParams.mapWidth < this.winSize.width)
        {
            this.targetPos.x = (this._mapParams.mapWidth - this.winSize.width) / 2;
        }else
        {
            if(this.targetPos.x > this._mapParams.mapWidth - this.winSize.width)
            {
                this.targetPos.x = this._mapParams.mapWidth - this.winSize.width;
            }else if(this.targetPos.x < 0)
            {
                this.targetPos.x = 0;
            }   
        }

        if(this._mapParams.mapHeight < this.winSize.height)
        {
            this.targetPos.y = (this._mapParams.mapHeight - this.winSize.height) / 2;
        }else
        {
            if(this.targetPos.y > this._mapParams.mapHeight - this.winSize.height)
            {
                this.targetPos.y = this._mapParams.mapHeight - this.winSize.height;
            }else if(this.targetPos.y < 0)
            {
                this.targetPos.y = 0;
            }
        }

        this.targetPos.z = this.camera.node.position.z;   
        this.targetPos = this.camera.node.position.lerp(this.targetPos,dt * 2.0); //摄像机平滑跟随
        this.camera.node.position = this.targetPos;
    }

    /**
     *把视野定位到给定位置 
    * @param px
    * @param py
    * 
    */		
    public setViewToPoint(px:number,py:number):void
    {
        this.targetPos = new Vec3(px,py).subtract(new Vec3(this.winSize.width / 2, this.winSize.height / 2));

        if(this._mapParams.mapWidth < this.winSize.width)
        {
            this.targetPos.x = (this._mapParams.mapWidth - this.winSize.width) / 2;
        }else
        {
            if(this.targetPos.x > this._mapParams.mapWidth - this.winSize.width)
            {
                this.targetPos.x = this._mapParams.mapWidth - this.winSize.width;
            }else if(this.targetPos.x < 0)
            {
                this.targetPos.x = 0;
            }   
        }

        if(this._mapParams.mapHeight < this.winSize.height)
        {
            this.targetPos.y = (this._mapParams.mapHeight - this.winSize.height) / 2;
        }else
        {
            if(this.targetPos.y > this._mapParams.mapHeight - this.winSize.height)
            {
                this.targetPos.y = this._mapParams.mapHeight - this.winSize.height;
            }else if(this.targetPos.y < 0)
            {
                this.targetPos.y = 0;
            }
        }
        
        this.targetPos.z = this.camera.node.position.z;
        this.camera.node.position = this.targetPos;
        
    }

    protected onDestroy(): void 
    {
        CameraController.instance = null;
    }
}
