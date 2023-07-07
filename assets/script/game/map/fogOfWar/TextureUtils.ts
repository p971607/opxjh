import { Color, Texture2D } from "cc";

/**
 * 纹理处理工具
 * @作者 落日故人 QQ 583051842
 */
export class TextureUtils
{
    private _texture2d: Texture2D;
    public get texture2d(): Texture2D {
        return this._texture2d;
    }
    public set texture2d(value: Texture2D) {
        this._texture2d = value;
    }

    private width:number = 100;
    private height:number = 100;

    /**存储像素数据的内存块 */
    private buffer: ArrayBuffer;
    /**颜色分量一维数组，供渲染使用 */
    private pixelColor: Uint8Array;
    /**记录各种颜色的像素的数量 */
    private colorCount: { [key: number]: number };
    /**记录每个像素点的颜色值的数组，颜色值用十六进制表示，RGBA格式 */
    private pointColor: number[][];

    public init(tex:Texture2D)
    {
        this._texture2d = tex;
        this.width = this._texture2d.width;
        this.height = this._texture2d.height;


        //var arrbuf:ArrayBuffer = new ArrayBuffer(size)
        //var data:DataView = new DataView(tex.image.data);
        //console.log(this.width,this.height);

        //console.log("tex.image.data",tex.image.data)
        
        this.initPixelColor();
    }

    private initPixelColor() {
        this.buffer = new ArrayBuffer(this.width * this.height * 4);
        this.pixelColor = new Uint8Array(this.buffer);
        this.pixelColor.fill(0);
    }

    private resetPixelColor() {
        this.pixelColor.fill(0);
    }

    /**
     * 传入图像的像素数据，直接设置图像的内容，图像尺寸必须与图像一致，若需要重新设置图像大小，请使用 init() 函数
     * @param data 记录各像素颜色分量的一维数组
     */
     public setData(data: ArrayBuffer) {
        let pixelData = new Uint8Array(data);
        if (pixelData.length != this.width * this.height * 4) {
            console.warn("数据格式不对");
            return;
        }
        this.setPixelColorByRGBA(pixelData);
        this.setPointColorByRGBA(pixelData);
    }

    /**
     * 获取图像中记录每个像素的颜色分量的数据
     * @returns 将直接返回图像内部的数组；注：若使用者需要对该数据进行修改，请使用 copyData 方法获取，以免影响图像的像素个数计数功能
     */
     public getData(): Uint8Array {
        return this.pixelColor;
    }

    /**
     * 获取图像中的数据
     * @param data 用于接收数据的数组
     * @returns {number[]} 返回存储各像素点颜色分量的一维数组
     */
     public copyData(data?: number[]): number[] {
        if (undefined === data) {
            data = [];
        }
        for (let i = 0, count = this.pixelColor.length; i < count; ++i) {
            data[i] = this.pixelColor[i];
        }
        return data;
    }

    /**获取图像内部使用的内存块，若仅需要获取像素数据，不进一步处理，使用 getData 即可 */
    public getBuffer(): ArrayBuffer {
        return this.buffer;
    }

    public getPointData(): number[][] {
        return this.pointColor;
    }

    /**
     * 获取指定颜色的像素的个数
     * @param r 颜色的r分量
     * @param g 颜色的g分量
     * @param b 颜色的b分量
     * @param a 颜色透明度，默认为255
     */
     public getColorCount(r: number, g: number, b: number, a: number = 255): number {
        let c = this.convertToNumber(r, g, b, a);
        return this.colorCount[c];
    }

    /**
     * 记录各像素颜色分量
     * @param data 颜色分量一维数组
     */
     private setPixelColorByRGBA(data: Uint8Array) {
        this.pixelColor.set(data);
    }

    /**
     * 按像素点的坐标记录像素点的颜色值
     * @param data 颜色分量一维数组
     */
    private setPointColorByRGBA(data: Uint8Array) {
        this.colorCount = {};
        for (let y = 0; y < this.height; ++y) {
            let i = y * this.height;
            for (let x = 0; x < this.width; ++x) {
                let color = this.convertToNumber(data[i++], data[i++], data[i++], data[i++]);
                this.pointColor[x][y] = color;
                if (!this.colorCount[color]) {
                    this.colorCount[color] = 1;
                } else {
                    this.colorCount[color] += 1;
                }
            }
        }
    }
    

    /**
     * 将RGBA颜色分量转换为一个数值表示的颜色，颜色分量为0~255之间的值
     * @param r 
     * @param g 
     * @param b 
     * @param a 
     */
     private convertToNumber(r: number, g: number, b: number, a: number = 255): number {
        // 颜色值将用于数组索引，不能为负数，故红色分量为奇数时将减1变为偶数
        return ((r & 0xfe) << 23) | (g << 16) | (b << 8) | a;
    }

    /**
     * 设置图像某个像素的颜色
     * @param x 
     * @param y 
     * @param color 
     */
     public setPixel(x:number,y:number,color:Color):void
    {
        if(x < 0 || x >= this.width || y < 0 || y > this.height)
        {
            return;
        }

        x = Math.round(x);
        y = Math.round(y);

        let index = (y * this.width + x) * 4;

        this.pixelColor[index] = color.r;
        this.pixelColor[index + 1] = color.g;
        this.pixelColor[index + 2] = color.b;
        this.pixelColor[index + 3] = color.a;

    }

    //设置
    public setPixels(colors:Color[]):void
    {
        var colorLen:number = colors.length;
        var len:number = this.width * this.height; //像素总数

        for(var i:number = 0 ; i < len; i++)
        {
            let index = i;
            if(index < colorLen)
            {
                var color:Color = colors[i];
                this.pixelColor[index] = color.r;
                this.pixelColor[index + 1] = color.g;
                this.pixelColor[index + 2] = color.b;
                this.pixelColor[index + 3] = color.a;
            }else
            {
                //要设置的颜色区域大于源颜色数据的范围 用黑色替代
                this.pixelColor[index] = 0;
                this.pixelColor[index + 1] = 0;
                this.pixelColor[index + 2] = 0;
                this.pixelColor[index + 3] = 255;
            }
        }
    }

    public setBlockPixels(x:number, y:number, blockWidth:number, blockHeight:number,colors:Color[]):void
    {
        var colorIndex:number = 0;
        var colorLen:number = colors.length;

        for(var i:number = y; i < y + blockHeight ; i++)
        {
            for(var j:number = x; j < x + blockWidth ; j++)
            {
                var px:number = j;
                var py:number = i;

                if(px < 0 || px >= this.width || py < 0 || py > this.height)
                {
                    continue;
                }

                let index = (py * this.width + px) * 4;

                var color:Color = colors[colorIndex];
                
                if(colorIndex < colorLen)
                {
                    this.pixelColor[index] = color.r;
                    this.pixelColor[index + 1] = color.g;
                    this.pixelColor[index + 2] = color.b;
                    this.pixelColor[index + 3] = color.a;
                }else
                {
                    //要设置的颜色区域大于源颜色数据的范围 用黑色替代
                    this.pixelColor[index] = 0;
                    this.pixelColor[index + 1] = 0;
                    this.pixelColor[index + 2] = 0;
                    this.pixelColor[index + 3] = 255;
                }

                colorIndex ++;
            }
        }
    }

    public getPixel(x:number,y:number):Color
    {
        if(x < 0 || x >= this.width || y < 0 || y > this.height)
        {
           return new Color(0,0,0,255);
        }

        x = Math.round(x);
        y = Math.round(y);

        let index = (y * this.width + x) * 4;

        var color:Color = new Color();
        color.r = this.pixelColor[index];
        color.g = this.pixelColor[index + 1];
        color.b = this.pixelColor[index + 2];
        color.a = this.pixelColor[index + 3];

        return color;
    }

    public getPixels():Color[]
    {
        var colors:Color[] = [];

        var len:number = this.pixelColor.length;
        for(var i:number = 0 ; i < len; i += 4)
        {
            let index = i;

            var color:Color = new Color();
            color.r = this.pixelColor[index];
            color.g = this.pixelColor[index + 1];
            color.b = this.pixelColor[index + 2];
            color.a = this.pixelColor[index + 3];
            colors.push(color);
        }

        return colors;
    }

    public getBlockPixels(x:number, y:number, blockWidth:number, blockHeight:number):Color[]
    {
        var colors:Color[] = [];

        for(var i:number = y; i < y + blockHeight ; i++)
        {
            for(var j:number = x; j < x + blockWidth ; j++)
            {
                var px:number = j;
                var py:number = i;

                var color:Color = new Color();

                if(px < 0 || px >= this.width || py < 0 || py > this.height)
                {
                    color.r = 0;
                    color.g = 0;
                    color.b = 0;
                    color.a = 255;
                }else
                {
                    let index = (py * this.width + px) * 4;

                    color.r = this.pixelColor[index];
                    color.g = this.pixelColor[index + 1];
                    color.b = this.pixelColor[index + 2];
                    color.a = this.pixelColor[index + 3];
                }

                colors.push(color);
            }
        }

        return colors;
    }
}