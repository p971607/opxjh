import { CCBoolean, CCFloat, CCInteger, Component, Rect, Size, Sprite, SpriteFrame, Texture2D, UITransform, Vec2, _decorator } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 动画播放器
 * @author 落日故人 QQ 583051842
 * 
 */
@ccclass('MovieClip')
export default class MovieClip extends Component {
    /** Sprite渲染器 */
    protected m_sprite: Sprite | null = null;;

    /** 动画计时间隔 每隔0.1s更新一帧 */
    protected timer: number = 0.1;

    /** 播放 时间 间隔 */
    @property({ type: CCFloat })
    public interval: number = 0.1;

    /** 贴图文件名 */
    @property({ type: Texture2D })
    public texture: Texture2D | null = null;

    /** 播放次数 */
    @property({ type: CCInteger })
    public playTimes: number = 0;

    @property({ type: CCInteger })
    public row: number = 4;

    /** 图片切割成几列 */
    @property({ type: CCInteger })
    public col: number = 4;

    @property({ type: CCInteger })
    public rowIndex: number = 0;

    @property(CCBoolean)
    public isAll: boolean = false;

    @property(CCBoolean)
    public autoPlayOnLoad: boolean = true;

    /** 播放完自动销毁 */
    @property(CCBoolean)
    public autoDestroy: boolean = false;

    @property(CCFloat)
    public begin: number = 0;

    @property(CCFloat)
    public end: number = 0;

    /** 动画帧数 */
    public totalFrame: number = 8;

    /** 当前帧数 */
    public currentFrame: number = 0;

    /** 当前播放了第几次 */
    private currentTimes: number = 0;

    /** 影片是否在跑动中 */
    public running: boolean = true;

    //private _direction:number = 1;

    private _playIndex: number = 0;
    private _pieceWidth: number = 0;
    private _pieceHeight: number = 0;
    private _bitmapArr: SpriteFrame[][] = [];

    onLoad() {
        //this. m_clips = new SpriteFrame[this.row][this.col];
        //Texture2D tex = Resources.Load<Texture2D>("Image/Avatar/" + m_sprite_name);

        //this.begin = 0;

        if (this.end == 0) {
            this.end = this.col;
        }

        this.rowIndex = this.clamp(this.rowIndex, 0, this.row - 1);

        this._pieceWidth = this.texture!.width / this.col;
        this._pieceHeight = this.texture!.height / this.row;

        this.m_sprite = this.getComponent(Sprite);

        if (!this.m_sprite) {
            this.m_sprite = this.addComponent(Sprite);
        }

        for (var i = 0; i < this.row; i++) {
            this._bitmapArr[i] = [];

            for (var j = 0; j < this.col; j++) {
                var spriteFrame: SpriteFrame = new SpriteFrame();
                spriteFrame.texture = this.texture!;
                spriteFrame.rect = new Rect(j * this._pieceWidth, i * this._pieceHeight, this._pieceWidth, this._pieceHeight);
                spriteFrame.rotated = false;
                spriteFrame.offset = new Vec2(0, 0);
                spriteFrame.originalSize = new Size(this._pieceWidth, this._pieceHeight);
                this._bitmapArr[i][j] = spriteFrame;
            }
        }

        this.m_sprite!.spriteFrame = this._bitmapArr[this.rowIndex][0];
        this.m_sprite!.spriteFrame.width

        var uiTransform = this.getComponent(UITransform);

        if (uiTransform) {
            uiTransform.width = this._pieceWidth;
            uiTransform.height = this._pieceHeight;
        }

        this.timer = 0;
        this.running = this.autoPlayOnLoad;
    }

    update(dt: number) {
        if (!this.running)
            return;

        if (this.playTimes != 0 && this.currentTimes == this.playTimes) {
            this.running = false;
            return;
        }

        this.timer -= dt;

        if (this.timer <= 0) {
            this.timer = this.interval;
            this.currentFrame = this.currentFrame % this.col;

            this.playAction();

            this.currentFrame++;
            if (this.currentFrame == this.col) {

                if (this.isAll) {
                    this.rowIndex++;
                    if (this.rowIndex == this.row) {
                        this.currentTimes++;
                        this.node.emit("completeTimes");

                        if (this.playTimes != 0 && this.currentTimes == this.playTimes) {
                            this.node.emit("complete");

                            if (this.autoDestroy) {
                                this.node.destroy();
                            }
                        }
                    }

                    this.rowIndex %= this.row;
                }
                else {
                    this.currentTimes++;
                    this.node.emit("completeTimes");

                    if (this.playTimes != 0 && this.currentTimes == this.playTimes) {
                        this.node.emit("complete");

                        if (this.autoDestroy) {
                            this.node.destroy();
                        }
                    }
                }
            }
        }
    }

    private playAction() {
        this.rowIndex = this.clamp(this.rowIndex, 0, this.row - 1);
        this._playIndex = this._playIndex % (this.end - this.begin) + this.begin;
        this.m_sprite!.spriteFrame = this._bitmapArr[this.rowIndex][this._playIndex];
        //this.m_sprite.spriteFrame.setRect(this.rect);

        this._playIndex++;
    }

    /** 播放影片 */
    public play() {
        this.running = true;
    }

    /** 停止播放影片 */
    public stop() {
        this.running = false;
    }

    /**
     * 跳帧播放
     * @param frame  帧
     */
    public gotoAndPlay(frame: number) {
        this.running = true;
        this._playIndex = frame;
        this._playIndex = this.clamp(this._playIndex, 0, this.col - 1);
    }

    /**
     * 跳帧停止
     * @param frame  帧
     */
    public gotoAndStop(frame: number) {
        this.running = false;

        this._playIndex = frame;
        this._playIndex = this.clamp(this._playIndex, 0, this.col - 1);

        this.m_sprite!.spriteFrame = this._bitmapArr[this.rowIndex][this._playIndex];
    }

    public clamp(value: number, minLimit: number, maxLimit: number) {
        if (value < minLimit) {
            return minLimit;
        }

        if (value > maxLimit) {
            return maxLimit;
        }

        return value;
    }
}
