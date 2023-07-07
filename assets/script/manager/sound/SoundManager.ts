import { _decorator, Component, Node, Enum, AudioClip, log, director, CCString, game, AudioSource, resources } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 背景音乐
 */
export enum BGSound
{
    none = 0,
    bgm1 = 1,
    bgm2 = 2,
    bgm3 = 3,
    bgm4 = 4,
    bgm5 = 5,
}

@ccclass("BGSoundClip")
export class BGSoundClip
{
    
    @property(CCString)
    public name:string = "";

    @property(CCString)
    public srcName:string = "";

    @property({type:Enum(BGSound)})
    public type:BGSound = BGSound.none;

    @property(AudioClip)
    public clip:AudioClip = null;

}

/**
 * 音效
 */
export enum OtherSound
{
    none = 0,
    
    /**
     * 点击音效
     */
    click = 1,

    /**
     * 中奖音效
     */
    bonus = 2,

}

@ccclass("OtherSoundClip")
export class OtherSoundClip
{
    @property(CCString)
    public name:string = "";

    @property({type:Enum(OtherSound)})
    public type:OtherSound = OtherSound.none;

    @property(AudioClip)
    public clip:AudioClip = null;
}

/**
 * 声音管理器
 */
@ccclass('SoundManager')
export class SoundManager extends Component {
    
    private static _instance: SoundManager;
    public static get instance(): SoundManager {
        if(this._instance == null)
        {
            /*cc.loader.loadRes("prefab/SoundManager",cc.Prefab,(err,prefab)=>{
                var node:cc.Node = cc.instantiate(prefab);
                this._instance = node.getComponent(SoundManager);
            });*/
            //this._instance = new SoundManager();
            //this._instance.init();
        }
        return SoundManager._instance;
    }

    @property(AudioSource)
    public bgAS:AudioSource = null;

    @property(BGSoundClip)
    public bgSoundClips:BGSoundClip[] = [];

    private bgSoundDic:{[key:number]:BGSoundClip} = {};

    @property(OtherSoundClip)
    public otherSoundClips:OtherSoundClip[] = [];

    private otherSoundDic:{[key:number]:OtherSoundClip} = {};

    private lastBgSound:BGSound = BGSound.none;

    onLoad()
    {
        if(SoundManager._instance)
        {
            this.node.destroy();
            return;
        }

        SoundManager._instance = this;
        game.addPersistRootNode(this.node);

        this.node.parent = null; //把声音父容器置空，否在加载场景后声音会重新播放


        for(var i = 0 ; i < this.bgSoundClips.length ; i++)
        {
            this.bgSoundDic[this.bgSoundClips[i].type] = this.bgSoundClips[i];
        }

        for(var i = 0 ; i < this.otherSoundClips.length ; i++)
        {
            this.otherSoundDic[this.otherSoundClips[i].type] = this.otherSoundClips[i];
        }

    }

    start () {
        // Your initialization goes here.
    }

    public playBGSound(type:BGSound,loop:boolean = true)
    {
        if(this.lastBgSound == BGSound.none)
        {
            this.lastBgSound = type;
        }

        this.getBGSoundClip(type,(clip:AudioClip)=>
        {
            this.bgAS.stop();
            this.bgAS.clip = clip;
            this.bgAS.loop = loop;

            this.bgAS.pause();
            this.bgAS.play();

            //console.log("播放背景音乐 type = ",BGSound[type],"clip",this.bgAS.clip);
        });

    }

    public stopBGSound()
    {
        this.bgAS.stop();
    }

    public playLastBGSound()
    {
        if(this.lastBgSound != BGSound.none)
        {
            this.playBGSound(this.lastBgSound);
        }
    }


    public playOtherSound(type:OtherSound,volume:number = 1)
    {
        var clip:AudioClip = this.getOtherSoundClip(type);

        if(clip)
        {
            this.bgAS.playOneShot(clip,volume);
        }else
        {
            console.log("找不到资源id为 " + type + " PlayOtherSound声音配置");
        }
    }

    public getBGSoundClip(type:BGSound,callback?:Function)
    {
        if(this.bgSoundDic[type] == null)
        {
            console.log("没配置背景音乐数据 type = ",BGSound[type]);
            return ;
        }

        if(this.bgSoundDic[type].clip != null)
        {
            callback(this.bgSoundDic[type].clip);
        }else
        {
            var path:string = "sound/bgm/" + this.bgSoundDic[type].srcName;
            resources.load(path,AudioClip,(error:Error,clip:AudioClip)=>
            {
                if(error != null)
                {
                    console.error(BGSound[type],"背景音乐加载失败 path = " + path, error);
                    return;
                }

                this.bgSoundDic[type].clip = clip;
                callback && callback(clip);
            });
        }
    }

    public getOtherSoundClip(type:OtherSound):AudioClip
    {
        if(this.otherSoundDic[type])
        {
            return this.otherSoundDic[type].clip;
        }else
        {
            log("不存在该种声音源 type = ",OtherSound[type]);
            return null;
        }
    }

}
