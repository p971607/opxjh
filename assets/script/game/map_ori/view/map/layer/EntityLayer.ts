/*
 * @Author: dgflash
 * @Date: 2022-08-04 15:22:33
 * @LastEditors: dgflash
 * @LastEditTime: 2023-05-12 18:04:45
 */
import { Component, Node, _decorator } from 'cc';
import { Timer } from '../../../../../../../extensions/oops-plugin-framework/assets/core/common/timer/Timer';
import Charactor from '../charactor/Charactor';

const { ccclass, property } = _decorator;

/**
 * 物体层
 * 注：
 * 1、这里的深度排序，如果有性能问题，可考虑修改为非每帧排序
 * 2、如果全3D世界显示角色相关显示对象，则不需要2D深度排序，只引用2D地图上的位置信息
 */
@ccclass('EntityLayer')
export default class EntityLayer extends Component {
    private timer: Timer = new Timer(0.2);

    update(dt: number) {
        if (this.timer.update(dt))
            this.node.children.sort(this.zIndexSort);
    }

    private zIndexSort(a: Node, b: Node) {
        let a_zIndex = a.getComponent(Charactor)!.zIndex;
        let b_zIndex = b.getComponent(Charactor)!.zIndex;
        return a_zIndex - b_zIndex;
    }

    public clear() {
        this.node.children.forEach(n => {

        });
    }
}
