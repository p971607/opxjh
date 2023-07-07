import { _decorator, Component, Node, Label, CCFloat, TERRAIN_HEIGHT_BASE } from 'cc';
const { ccclass, property } = _decorator;

/**
 * NPC对话框
 */
@ccclass('NPCTalkBoard')
export class NPCTalkBoard extends Component {

    /**
     * 对话框
     */
    @property(Node)
    board: Node = null;

    /**
     * 对话内容显示文本
     */
    @property(Label)
    talkContentTxt: Label = null;

    /**
     * 对话结束时的回调
     */
    public talkCompCallback:Function = null;

    private talkMsg:string = "";
    private talkIndex:number = 0;
    private talkTime:number = 0;


    start() {

    }

    update(deltaTime: number) 
    {
        if(this.talkIndex == this.talkMsg.length)
        {
            return;
        }

        this.talkTime -= deltaTime;
        if(this.talkTime <= 0)
        {
            this.talkTime = 0.065; //打字速度 （单位秒）

            if(this.talkIndex < this.talkMsg.length)
            {
                var str:string = this.talkMsg.substring(0,this.talkIndex + 1);
                this.talkContentTxt.string = str;
                this.talkIndex ++;

                if(this.talkIndex == this.talkMsg.length)
                {
                    this.scheduleOnce(()=>
                    {
                        if(this.talkCompCallback != null)
                        {
                            this.talkCompCallback(); //执行回调
                            this.talkCompCallback = null;
                        }

                        this.close();
                    },1.5); //等待一段时间后关闭对话框
                }
            }
        }

    }

    /**
     * 显示对话内容
     */
    public showTalkContent(talkMsg:string, talkCompCallback:Function = null)
    {
        this.talkCompCallback = talkCompCallback;
        this.talkContentTxt.string = "";
        this.talkMsg = talkMsg;
        this.talkIndex = 1;
        this.talkTime = 0.25; //设置延迟打字时间
        this.unscheduleAllCallbacks(); //清除所有计时器
        this.open();
    }


    public open()
    {
        this.node.active = true;
    }

    public close()
    {
        this.node.active = false;
    }
}

