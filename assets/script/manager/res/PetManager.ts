// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Node,Component, instantiate, Prefab, Vec3, _decorator } from "cc";
import Pet from "../../game/unit/actor/pet/Pet";

const { ccclass, property } = _decorator;

/**
 * 宠物管理器
 */
 @ccclass('PetManager')
export default class PetManager extends Component {

    @property(Prefab)
    public petPrefab:Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    /**
     * 获得宠物
     * @param petId 
     * @returns 
     */
    public getpet(petId:number):Pet
    {
        var pet:Pet = instantiate(this.petPrefab).getComponent(Pet);
        pet.node.active = true;
        pet.node.position = new Vec3(0,0,0);
        
        return pet;
    }
}
