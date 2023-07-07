// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, instantiate, Prefab, Vec3, _decorator } from "cc";
import NPC from "../../game/unit/actor/npc/NPC";

const { ccclass, property } = _decorator;

/**
 * Npc管理器
 */
 @ccclass('NpcManager')
export default class NpcManager extends Component {


    @property(Prefab)
    public npcPrefab:Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    /**
     * 获得npc
     * @param npcId 
     * @returns 
     */
    public getNPC():NPC
    {
        var npc:NPC = instantiate(this.npcPrefab).getComponent(NPC);
        npc.node.active = true;
        npc.node.position = new Vec3(0,0,0);
        return npc;
    }

}
