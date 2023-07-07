// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node, Component, game, _decorator } from "cc";
import RoadSign from "../../game/map/roadSign/RoadSign";
import MonsterManager from "./MonsterManager";
import NpcManager from "./NpcManager";
import OtherManager from "./OtherManager";
import PetManager from "./PetManager";
import PlayerManager from "./PlayerManager";

const { ccclass, property } = _decorator;

/**
 * 游戏管理器，用来管理各类子管理器
 * @作者 落日故人 QQ 583051842
 */
 @ccclass('GameManager')
export default class GameManager extends Component {

    private static _instance: GameManager;
    public static get instance(): GameManager {

        return GameManager._instance;
    }

    //-----------------------------------------------------------------------------------------------------
    private _playerMgr: PlayerManager = null;
    /**获得玩家管理器 */
    public get playerMgr(): PlayerManager {

        if(this._playerMgr == null)
        {
            this._playerMgr = this.getComponentInChildren(PlayerManager);
        }

        return this._playerMgr;
    }

    //-----------------------------------------------------------------------------------------------------
    private _petMgr: PetManager = null;
    /**获得宠物管理器 */
    public get petMgr(): PetManager {

        if(this._petMgr == null)
        {
            this._petMgr = this.getComponentInChildren(PetManager);
        }

        return this._petMgr;
    }

    //-----------------------------------------------------------------------------------------------------
    private _npcMgr: NpcManager = null;
    /**获得NPC管理器 */
    public get npcMgr(): NpcManager {

        if(this._npcMgr == null)
        {
            this._npcMgr = this.getComponentInChildren(NpcManager);
        }

        return this._npcMgr;
    }

    //-----------------------------------------------------------------------------------------------------
    private _monsterMgr: MonsterManager = null;
    /**获得怪物管理器 */
    public get monsterMgr(): MonsterManager {

        if(this._monsterMgr == null)
        {
            this._monsterMgr = this.getComponentInChildren(MonsterManager);
        }

        return this._monsterMgr;
    }

    //-----------------------------------------------------------------------------------------------------
    private _otherMgr: OtherManager = null;
    /**获得杂货管理器 */
    public get otherMgr(): OtherManager {

        if(this._otherMgr == null)
        {
            this._otherMgr = this.getComponentInChildren(OtherManager);
        }

        return this._otherMgr;
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(!GameManager._instance)
        {
            GameManager._instance = this;
            game.addPersistRootNode(this.node);
            this.init();
        }else
        {
            this.node.destroy(); //场景里只能有一个GameManager,有多余的必须销毁
        }
    }

    public init()
    {

    }

    // update (dt) {}
}
