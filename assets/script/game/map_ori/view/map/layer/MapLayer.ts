import { Component, Layers, Node, Sprite, SpriteFrame, Texture2D, UITransform, Vec3, _decorator } from 'cc';
import { oops } from '../../../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { LayerUtil } from '../../../../../../../extensions/oops-plugin-framework/assets/core/utils/LayerUtil';
import { smc } from '../../../../common/SingletonModuleComp';
import { MapLoadModel } from '../base/MapLoadModel';
import MapParams from '../base/MapParams';

const { ccclass, property } = _decorator;

/**
 * 地图层 
 * @author 落日故人 QQ 583051842
 * 
 */
@ccclass('MapLayer')
export default class MapLayer extends Component {
	/** 切割小图片集 */
	private _sliceImgDic: { [key: string]: Sprite | null } = {};
	private _mapParams: MapParams | null = null;

	@property(Sprite)
	private bgImg: Sprite | null = null;

	public init(mapParams: MapParams): void {
		this._mapParams = mapParams;

		if (!this.bgImg) {
			var bgNode: Node = new Node();
			this.node.addChild(bgNode);
			bgNode.layer = Layers.Enum.UI_2D;

			this.bgImg = bgNode.addComponent(Sprite);
			this.bgImg.sizeMode = Sprite.SizeMode.RAW;
			bgNode.getComponent(UITransform)!.anchorX = 0;
			bgNode.getComponent(UITransform)!.anchorY = 0;
		}

		var spriteFrame: SpriteFrame = new SpriteFrame();
		spriteFrame.texture = this._mapParams.bgTex!;

		this.bgImg.spriteFrame = spriteFrame;

		//如果是马赛克小地图，则需要把小地图缩放成原始地图一样大小
		if (mapParams.mapLoadModel == MapLoadModel.slices) {
			this.bgImg.getComponent(UITransform)!.width = mapParams.mapWidth;
			this.bgImg.getComponent(UITransform)!.height = mapParams.mapHeight;
		}

		this.getComponent(UITransform)!.width = this.width;
		this.getComponent(UITransform)!.height = this.height;
	}

	/**
	 * 根据视图区域加载小地图
	 * @param px 滚动视图左上角的x坐标 
	 * @param py 滚动视图左上角的y坐标 
	 * 
	 */
	public loadSliceImage(px: number, py: number): void {
		var iy1: number = Math.floor(py / this._mapParams!.sliceHeight);
		var iy2: number = Math.floor((py + this._mapParams!.viewHeight) / this._mapParams!.sliceHeight);

		var jx1: number = Math.floor(px / this._mapParams!.sliceWidth);
		var jx2: number = Math.floor((px + this._mapParams!.viewWidth) / this._mapParams!.sliceWidth);

		var key: string;

		for (var i: number = iy1; i <= iy2; i++) {
			for (var j: number = jx1; j <= jx2; j++) {
				key = (i + 1) + "_" + (j + 1); 				// 图片的索引是从1开始的，所以要加1

				if (!this._sliceImgDic[key]) {
					let bitmap: Sprite = this.getSliceSprite(key)
					this._sliceImgDic[key] = bitmap;
					this.node.addChild(bitmap.node);
					bitmap.node.position = new Vec3(j * this._mapParams!.sliceWidth, i * this._mapParams!.sliceHeight, 0)

					// var path: string = `maps/${this._mapParams!.bgName}/${this._mapParams!.bgName}/slices/${key}/texture`;
					// oops.res.load("remote", path, Texture2D, (error: Error | null, tex: Texture2D) => {
					var path: string = smc.map.MapModel.getResContentSlices(this._mapParams!.bgName, key);
					oops.res.load(path, Texture2D, (error: Error | null, tex: Texture2D) => {
						if (error) {
							console.error(error);
						}
						var spriteFrame: SpriteFrame = new SpriteFrame();
						spriteFrame.texture = tex;
						bitmap.spriteFrame = spriteFrame;
					});
				}
			}
		}
	}

	private getSliceSprite(name: string) {
		var node: Node = new Node(name);
		node.layer = LayerUtil.MAP.mask;	// Layers.Enum.UI_2D;
		var sprite: Sprite = node.addComponent(Sprite);
		sprite.sizeMode = Sprite.SizeMode.RAW;
		node.getComponent(UITransform)!.anchorX = 0;
		node.getComponent(UITransform)!.anchorY = 0;
		return sprite;
	}

	public clear(): void {
		this.bgImg!.spriteFrame = null;

		for (var key in this._sliceImgDic) {
			var sprite: Sprite | null = this._sliceImgDic[key];
			sprite && sprite.node.destroy();
			this._sliceImgDic[key] = null;
			delete this._sliceImgDic[key];
		}
	}

	public get bgImage(): Sprite {
		return this.bgImg!;
	}

	public get width(): number {
		if (this.bgImg) {
			return this.bgImg.getComponent(UITransform)!.width;
		}

		return this._mapParams!.viewWidth;
	}

	public get height(): number {
		if (this.bgImg) {
			return this.bgImg.getComponent(UITransform)!.height;
		}

		return this._mapParams!.viewHeight;
	}
}