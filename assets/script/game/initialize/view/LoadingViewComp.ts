/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-17 13:46:25
 */
import { _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import SceneManager from "../../../manager/scene/SceneManager";
import { MapLoadModel } from "../../../map/base/MapLoadModel";
import { UIID } from "../../common/config/GameUIConfig";

const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCVMParentComp {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    private progress: number = 0;

    reset(): void {
        // 获取用户信息的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_player");

        // 关闭加载界面
        oops.gui.remove(UIID.Loading);

        // 释放加载界面资源
        oops.res.releaseDir("loading");
       
        SceneManager.instance.loadMap("map1",0,MapLoadModel.slices);

        // 加载地图
        // var map = ecs.getEntity<GameMap>(GameMap);
        // map.load();
        // smc.map = map;
    }

    start() {
        this.loadRes();
    }

    /** 加载资源 */
    private async loadRes() {
        this.data.progress = 0;
        this.loadCustom();
        this.loadGameRes();
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadCustom() {
        // 加载游戏本地JSON数据的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_json");
    }

    /** 加载初始游戏内容资源 */
    private loadGameRes() {
        // 加载初始游戏内容资源的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_game");

        oops.res.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        this.data.finished = finished;
        this.data.total = total;

        var progress = finished / total;
        if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2);
        }
    }

    /** 加载完成事件 */
    private onCompleteCallback() {
        this.ent.remove(LoadingViewComp);
    }
}