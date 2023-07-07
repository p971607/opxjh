// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, Sprite, Vec3, _decorator, SpriteFrame, resources, Texture2D, UITransform, Layers } from "cc";

import MapParams from "../base/MapParams";
import { MapLoadModel } from "../base/MapLoadModel";
import CameraController from "../../game/camera/CameraController";


const { ccclass, property } = _decorator;

/**
 * 地图层 
 * @作者 落日故人 QQ 583051842
 * 
 */
 @ccclass('MapLayer')
export default class MapLayer extends Component {
		
	/**
	 *切割小图片集 
		*/		
	private _sliceImgDic:{[key:string]:Sprite} = {};
	
	
	private _mapParams:MapParams = null;

	private _lastCameraPos:Vec3 = null;

	@property(Sprite)
	private bgImg:Sprite = null;
	
	
	public init(mapParams:MapParams):void
	{
		this._mapParams = mapParams;

		if(!this.bgImg)
		{
			var bgNode:Node = new Node();
			this.node.addChild(bgNode);
			bgNode.layer = this.node.layer; //Layers.Enum.Map;
			
			this.bgImg = bgNode.addComponent(Sprite);
			this.bgImg.sizeMode = Sprite.SizeMode.RAW;
			bgNode.getComponent(UITransform).anchorX = 0;
			bgNode.getComponent(UITransform).anchorY = 0;
		}

		var spriteFrame:SpriteFrame = new SpriteFrame();
		spriteFrame.texture = this._mapParams.bgTex;

		this.bgImg.spriteFrame = spriteFrame;

		//如果是马赛克小地图，则需要把小地图缩放成原始地图一样大小
		if(mapParams.mapLoadModel == MapLoadModel.slices)
		{
			this.bgImg.getComponent(UITransform).width = mapParams.mapWidth;
			this.bgImg.getComponent(UITransform).height = mapParams.mapHeight;
		}

		this.getComponent(UITransform).width = this.width;
		this.getComponent(UITransform).height = this.height;
		
	}


	/**
	 * 根据视图区域加载小地图
	 * @param px 滚动视图左下角的x坐标 
	 * @param py 滚动视图左下角的y坐标 
	 * 
	 */		
	public loadSliceImage(px:number,py:number):void
	{
		var iy1:number = Math.floor(py / this._mapParams.sliceHeight);
		var iy2:number = Math.floor((py + this._mapParams.viewHeight) / this._mapParams.sliceHeight);

		var jx1:number = Math.floor(px / this._mapParams.sliceWidth);  
		var jx2:number = Math.floor((px + this._mapParams.viewWidth) / this._mapParams.sliceWidth);
		
		var key:string;
		
		for(var i:number = iy1 ; i <= iy2 ; i++)
		{
			for(var j:number = jx1 ; j <= jx2 ; j++)
			{
				key = (i + 1) + "_" + (j + 1); // 图片的索引是从1开始的，所以要加1
				
				if(!this._sliceImgDic[key])
				{
					let bitmap:Sprite = this.getSliceSprite(key)
					this._sliceImgDic[key] = bitmap;
					this.node.addChild(bitmap.node);
					bitmap.node.position = new Vec3(j * this._mapParams.sliceWidth,i * this._mapParams.sliceHeight,0);
					
					//如果地图资源放在远程服务器，执行以下代码
					/*
					var root = "远程资源地址根目录"; //填写你的远程资源地址根目录
					assetManager.loadRemote<Texture2D>(root + "map_bg/slices/" + key + ".jpg", (error:Error, tex:Texture2D)=> {
						var spriteFrame:SpriteFrame = new SpriteFrame();
						spriteFrame.texture = tex;
						bitmap.spriteFrame = spriteFrame;
					});
					*/

					//如果地图资源放在项目resources目录，执行以下代码
					resources.load("map/bg/" + this._mapParams.bgName + "/slices/" + key + "/texture",Texture2D,(error:Error,tex:Texture2D)=>
					{
						if(error != null)
						{
							//console.error("加载图快" + key + "失败"); //玩家走到地图边缘时尝试加载地图外的地图块会引起加载失败，因为地块本就不存在所以不用理会。如果加载地图内的地图失败，就要查原因了，可能是地址路径填错
							return;
						}

						var spriteFrame:SpriteFrame = new SpriteFrame();
						spriteFrame.texture = tex;
						bitmap.spriteFrame = spriteFrame;
					});
				}
				
			}
		}
		//C:\Users\ASUS\AppData\Local\Google\Chrome\Application\chrome.exe
	}

	private getSliceSprite(name:string)
	{
		var node:Node = new Node(name);
		node.layer =  this.node.layer; //Layers.Enum.Map; //Map是自定义层
		var sprite:Sprite = node.addComponent(Sprite);
		sprite.sizeMode = Sprite.SizeMode.RAW;
		node.getComponent(UITransform).anchorX = 0;
		node.getComponent(UITransform).anchorY = 0;
		return sprite;
	}
	
	public clear():void
	{
		this.bgImg.spriteFrame = null;
		
		for(var key in this._sliceImgDic)
		{
			var bitmap:Sprite = this._sliceImgDic[key];
			bitmap && bitmap.node.destroy();
			this._sliceImgDic[key] = null;
			delete this._sliceImgDic[key];
		}
		
	}
	
	public  get bgImage():Sprite
	{
		return this.bgImg;
	}

	public get width():number
	{
		if(this.bgImg)
		{
			return this.bgImg.getComponent(UITransform).width;
		}

		return this._mapParams.viewWidth;
	}

	public get height():number
	{
		if(this.bgImg)
		{
			return this.bgImg.getComponent(UITransform).height;
		}

		return this._mapParams.viewHeight;
	}

	protected update(dt: number): void 
	{
		if(CameraController.instance == null || this._mapParams == null)
		{
			return;
		}

		if(this._mapParams.mapLoadModel == MapLoadModel.slices)
		{
			var targetPos:Vec3 = CameraController.instance.getCameraPos();

			//当摄像头位置有变化时，加载可视区域的地图块
			if(this._lastCameraPos == null || targetPos.x != this._lastCameraPos.x || targetPos.y != this._lastCameraPos.y)
			{
				this._lastCameraPos = targetPos;
				this.loadSliceImage(targetPos.x, targetPos.y);
			}
		}
	}
}
