// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, instantiate, Prefab, _decorator, Vec3 } from "cc";
import Monster from "../../game/unit/actor/monster/Monster";

const { ccclass, property } = _decorator;

/**
 * 怪物管理器
 */
 @ccclass('MonsterManager')
export default class MonsterManager extends Component {


    @property(Prefab)
    public monsterPrefab:Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    /**
     * 获得怪物
     * @param monsterId 
     * @returns 
     */
    public getMonster():Monster
    {
        var monster:Monster = instantiate(this.monsterPrefab).getComponent(Monster);
        monster.node.active = true;
        monster.node.position = new Vec3(0,0,0);
        
        return monster;
    }
}
