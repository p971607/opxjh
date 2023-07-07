import { _decorator, Component, Node, Texture2D, Sprite, SpriteFrame, Size, Color, CCInteger, EventTouch, Vec2, UITransform, Vec3 } from 'cc';
import CameraController from '../../camera/CameraController';
import { TextureUtils } from './TextureUtils';
const { ccclass, property } = _decorator;

/**
 * 迷雾绘制参数数据
 */
export class FogDrawParam
{
    /**
     * 绘制的x坐标
     */
    public x:number = 0;
    /**
     * 绘制的y坐标
     */
    public y:number = 0;
    /**
     * 绘制的椭圆的水平半径
     */
    public a:number = 0;
    /**
     * 绘制的椭圆的垂直半径
     */
    public b:number = 0;
    /**
     * 用于计算范围的半径
     */
    public radius:number = 0;

    /**
     * 判断两个参数是否相等
     * @param param1 
     * @param param2 
     * @returns 
     */
    public static equal(param1:FogDrawParam,param2:FogDrawParam):boolean
    {
        if(
            param1.x == param2.x && 
            param1.y == param2.y && 
            param1.a == param2.a && 
            param1.b == param2.b && 
            param1.radius == param2.radius
            )
        {
            return true;
        }

        return false;
    }
}

/**
 * 战争迷雾
 * @作者 落日故人 QQ 583051842
 */
@ccclass('FogOfWar')
export class FogOfWar extends Component {

    public static instance:FogOfWar = null;

    @property(Sprite)
    public fogMask:Sprite = null;

    @property(CCInteger)
    public texWidth:number = 256;

    @property(CCInteger)
    public texHeight:number = 256;

    @property(Color)
    public defaultColor:Color = new Color(0,0,0,255);

    public maskTex:Texture2D = null

    public texUtils:TextureUtils;

    public maskSize:Size = null;

    public maskScaleX:number = 1;
    public maskScaleY:number = 1;
    public maskScale:number = 1;

    private tempVec3:Vec3 = new Vec3();

    private drawList:FogDrawParam[] = [];

    /**
     * 纹理是否有修改
     */
    private isTexChange:boolean = false;
    
    onLoad () {
        FogOfWar.instance = this;
    }

    public init(maskWidth:number,maskHeight:number)
    {
        this.fogMask.node.getComponent(UITransform).setContentSize(maskWidth,maskHeight);

        this.maskTex = new Texture2D();
        this.maskTex.reset(
            {
                width : this.texWidth,
                height : this.texHeight,
                format : Texture2D.PixelFormat.RGBA8888
            }
        );

        this.texUtils = new TextureUtils();
        this.texUtils.init(this.maskTex);
        this.resetColor();

        this.maskTex.uploadData(this.texUtils.getData());
        this.maskSize = this.fogMask.node.getComponent(UITransform).contentSize;
        this.maskScaleX = (this.texWidth / this.maskSize.width);
        this.maskScaleY = (this.texHeight / this.maskSize.height);
        this.maskScale = Math.max(this.maskScaleX, this.maskScaleY);

        this.fogMask.enabled = true;
        this.fogMask.spriteFrame.texture = this.maskTex;

        /*this.fogMask.node.on(Node.EventType.TOUCH_START,(event: EventTouch)=>
        {
            var touchPos:Vec2 = event.getUILocation();
            var pos:Vec3 = CameraController.instance.getCameraPos().add(new Vec3(touchPos.x,touchPos.y));

            //console.log(pos.x,pos.y)
            this.resetColor();
            this.drawOval(pos.x  ,pos.y ,50 ,25 );

        },this)

        this.fogMask.node.on(Node.EventType.TOUCH_MOVE,(event: EventTouch)=>
        {
            var touchPos:Vec2 = event.getUILocation();
            var pos:Vec3 = CameraController.instance.getCameraPos().add(new Vec3(touchPos.x,touchPos.y));
            //console.log(pos.x,pos.y)
            var radius:number = 50;

            this.resetColor();
            this.drawCircle(pos.x ,pos.y ,radius);

        },this)*/
    }

    /**
     * 把cocos节点UI坐标转化为纹理坐标，因为cocos节点UI坐标是从左下角计算的，而纹理坐标是从左上角计算的
     * @param uiNode 
     * @param uiPos 
     * @returns 
     */
    public convertNodePosToTexPos(uiNode: Node, uiPos: Vec2): Vec2 
    {
        this.tempVec3.set(uiPos.x, uiPos.y, 0);
        let pos = uiNode.getComponent(UITransform).convertToNodeSpaceAR(this.tempVec3);
        pos.x += uiNode.getComponent(UITransform).width * uiNode.getComponent(UITransform).anchorX;
        pos.y += uiNode.getComponent(UITransform).height * uiNode.getComponent(UITransform).anchorY;
        pos.y = uiNode.getComponent(UITransform).height - pos.y;
        return new Vec2(pos.x, pos.y);
    }

    lateUpdate () 
    {
        var len:number = this.drawList.length
        if(len > 0)
        {
            //this.resetColor();
            for(var i = 0; i < len; i++)
            {
                var drawParam:FogDrawParam = this.drawList[i];
                this.drawColor(drawParam.x,drawParam.y,drawParam.a,drawParam.b,drawParam.radius);
            }

            this.drawList.length = 0; //每帧绘制完，清空参数
        }

        if(this.isTexChange) //备注 纹理的 uploadData是教消耗性能的算法，所以加个开关，纹理数据有变化时才执行一次
        {
            this.isTexChange = false;
            this.maskTex.uploadData(this.texUtils.getData());
        }
    }

    /**
     * 重置颜色，备注：重置颜色因为要把纹理颜色全部遍历一遍，频繁执行会有性能消耗
     */
    public resetColor()
    {
        for(var i = 0 ; i < this.texHeight ; i++)
        {
            for(var j = 0 ; j < this.texWidth ; j++)
            {
                this.texUtils.setPixel(j,i,this.defaultColor);
            }
        }
    }

    /**
     * 绘制圆形 
     * @param x 
     * @param y 
     * @param radius 
     */
    public drawCircle(x:number,y:number,radius:number):void
    {
        if(!this.node.active)
            return;

        var pos:Vec2 = this.convertNodePosToTexPos(this.fogMask.node, new Vec2(x, y)); //因为ui坐标是从左下角计算，纹理坐标是从左上角计算，所以要转换
        x = Math.floor(pos.x * this.maskScaleX);
        y = Math.floor(pos.y * this.maskScaleY);
        radius = Math.floor(radius);

        //椭圆焦点在X轴上
        var a = radius * this.maskScale; //椭圆长轴
        var b = radius * this.maskScale; //椭圆短轴
        //var lxl = c / a; //c为椭圆两个焦点距离的一半  离心率

        //this.drawColor(x, y, a, b, radius);

        var drawParam:FogDrawParam = new FogDrawParam();
        drawParam.x = x;
        drawParam.y = y;
        drawParam.a = a;
        drawParam.b = b;
        drawParam.radius = radius;
        this.drawList.push(drawParam); //缓存参数到绘制数组里
    }

    /**
     * 绘制椭圆形
     * @param x 
     * @param y 
     * @param aRadius 椭圆的X轴半径
     * @param bRadius 椭圆的Y轴半径  （aRadius == bRadius时即为圆形）
     */
    public drawOval(x:number,y:number,aRadius:number, bRadius:number):void
    {
        if(!this.node.active)
            return;

        var pos:Vec2 = this.convertNodePosToTexPos(this.fogMask.node, new Vec2(x, y)); //因为ui坐标是从左下角计算，纹理坐标是从左上角计算，所以要转换
        x = Math.floor(pos.x * this.maskScaleX);
        y = Math.floor(pos.y * this.maskScaleY);

        //椭圆焦点在X轴上
        var a = aRadius * this.maskScale; //椭圆长轴
        var b = bRadius * this.maskScale; //椭圆短轴
        //var lxl = c / a; //c为椭圆两个焦点距离的一半  离心率

        var radius:number = Math.max(a,b);

        //this.drawColor(x, y, a, b, radius);
        var drawParam:FogDrawParam = new FogDrawParam();
        drawParam.x = x;
        drawParam.y = y;
        drawParam.a = a;
        drawParam.b = b;
        drawParam.radius = radius;
        this.drawList.push(drawParam); //缓存参数到绘制数组里
    }

    public drawColor(x:number,y:number, a:number, b:number, radius:number)
    {
        if(this.maskSize.width < this.maskSize.height)
        {
            b = b * (this.maskSize.width / this.maskSize.height);
        }else if(this.maskSize.width > this.maskSize.height)
        {
            a = a * (this.maskSize.height / this.maskSize.width);
        }

        var aSp = a * a;
        var bSp = b * b;

        //var radiusSp:number = radius * radius;

        for(var i = y - radius; i < y + radius; i++)
        {
            for(var j = x - radius ; j < x + radius; j++)
            {
                /*var px:number = j;
                var py:number = i;

                var disX:number = px - x;
                var disY:number = py - y;

                var disSp = disX * disX + disY * disY;

                if(disSp <= radiusSp)
                {
                    var color:Color = this.tu.getPixel(px,py);
                    //color.a = Math.floor(255 * (disSp / radiusSp));
                    color.a = Math.floor(color.a * (disSp / radiusSp));
                    this.tu.setPixel(px,py,color);
                }*/

                var px:number = j;
                var py:number = i;
                var disX:number = px - x;
                var disY:number = py - y;

                var disSp:number = (disX * disX) / aSp + (disY * disY) / bSp;

                if(disSp <= 1)
                {
                    var color:Color = this.texUtils.getPixel(px,py);
                    //color.a = 0;
                    color.a = Math.floor(color.a * disSp);
                    this.texUtils.setPixel(px,py,color);
                }
            }
        }

        this.isTexChange = true;
    }

     
}

