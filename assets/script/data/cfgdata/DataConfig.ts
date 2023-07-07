import { BGSound } from "../../manager/sound/SoundManager";

/**
 * 测试用的配置数据，测试用，开发者可以选择第三方配置表，如Excel表配置，更方便
 */
export class DataConfig 
{

    public static BGMData = 
    {
        10000: BGSound.none, //默认数据是没声音
        10001: BGSound.bgm1,
        10002: BGSound.bgm2,
        10003: BGSound.bgm3,
        10004: BGSound.bgm4,
        10005: BGSound.bgm5,

        //home : BGSound.bgm1, //家的背景音乐
    }

    public static getMapBGSound(mapId:string):BGSound
    {
        if(DataConfig.BGMData[mapId])
        {
            return DataConfig.BGMData[mapId];
        }

        return DataConfig.NpcTalkData[10000]; //如果id没有数据，就用默认数据
    }

    public static NpcTalkData = 
    {
        1000: "你好！",
        2001: "我是装备商，要买点什么装备吗？",
        2002: "往西边走，可以去长寿！",
        3001: "天上人间很好玩！，你快去体验一下吧！",
        3002: "我是楼主！你是谁？",
        4001: "私闯民宅，给我滚出去！",
        5001: "大爷，我们这里的姑娘只卖身不卖艺的！",
        5002: "我寂寞，我冷！",
        5003: "什么才一两，当我什么啊，最少也要给十两",
        5004: "大爷，不要这样，你再这样我可要叫了！",
        5005: "禽兽！",
    }

    public static getNpcTalkData(talkId:number)
    {
        if(DataConfig.NpcTalkData[talkId])
        {
            return DataConfig.NpcTalkData[talkId];
        }

        return DataConfig.NpcTalkData[1000]; //如果id没有数据，就用默认数据
    }
}

