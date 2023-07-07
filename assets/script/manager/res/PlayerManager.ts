// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, instantiate, Prefab, Vec3, _decorator } from "cc";
import Player from "../../game/unit/actor/player/Player";



const { ccclass, property } = _decorator;

/**
 * 玩家管理器
 */
 @ccclass('PlayerManager')
export default class PlayerManager extends Component {

    @property(Prefab)
    public playerPrefabArr:Prefab[] = [];

    /**
     * 选择角色
     */
    @property
    public selectRoleId:number = 1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    /**
     * 获得玩家
     */
    public getPlayer(roleId:number):Player
    {
        var node:Node = instantiate(this.playerPrefabArr[roleId - 1]);
        var player = node.getComponent(Player);
        player.node.position = new Vec3(0,0,0);
        player.roleId = roleId;
        player.node.active = true;
        return player;
    }
}
