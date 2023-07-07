/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-17 12:38:59
 */
import { Node } from "cc";
import { UICallbacks } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { AsyncQueue, NextFunction } from "../../../../extensions/oops-plugin-framework/assets/libs/collection/AsyncQueue";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../common/config/GameUIConfig";
import { LoadingViewComp } from "./view/LoadingViewComp";

/**
 * 游戏进入初始化模块
 * 1、热更新
 * 2、加载默认资源
 */
@ecs.register(`Initialize`)
export class Initialize extends ecs.Entity {
    LoadingView!: LoadingViewComp;

    protected init() {
        var queue: AsyncQueue = new AsyncQueue();

        // 加载自定义资源
        this.loadCustom(queue);
        // 加载多语言包
        this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 加载游戏内容加载进度提示界面
        this.onComplete(queue);

        queue.play();
    }


    /** 加载自定义内容（可选） */
    private loadCustom(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            // 加载多语言对应字体
            oops.res.load("language/font/" + oops.language.current, next);
        });
    }

    /** 加载化语言包（可选） */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = oops.storage.get("language");
            if (lan == null) {
                lan = "zh";
                oops.storage.set("language", lan!);
            }

            // 设置语言包路径
            oops.language.setAssetsPath(oops.config.game.languagePathJson, oops.config.game.languagePathTexture);

            // 加载语言包资源
            oops.language.setLanguage(lan!, next);
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            oops.res.loadDir("common", next);
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete(queue: AsyncQueue) {
        queue.complete = () => {
            var uic: UICallbacks = {
                onAdded: (node: Node, params: any) => {
                    var comp = node.getComponent(LoadingViewComp) as ecs.Comp;
                    this.add(comp);
                }
            };

            // 界面管理 - 打开游戏内容资源加载进度提示界面
            oops.gui.open(UIID.Loading, null, uic);
        };
    }
}