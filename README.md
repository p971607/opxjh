如何使用编辑器，对应的代码和api：
 // 创建新的触发器，可以设置事件、是否禁用、场景和同步
    export let trigger_new: (this: void, func: (this: void, ...args: Array<any>) => void, events: Array<TriggerEvent>, disabled: boolean, scenes: Scene | Array<Scene> | undefined, sync: boolean | undefined) => Trigger;
declare class Trigger{
    disable:()=>void // 禁用触发器
    enable:()=>void // 启用触发器
    is_enable:()=>boolean // 判断触发器是否启用
    remove:()=>void // 移除触发器
    add_event_common:(添加的事件:EventRegister)=>void // 为触发器添加通用事件
    remove_event_common:(删除的事件:EventRegister)=>void // 为触发器移除通用事件
    replicate:(包括事件:boolean)=>Trigger // 复制触发器，参数决定是否包括事件
    constructor() // 构造函数，用于创建Trigger实例
}
declare type EventRegister = {
    event_name?: string, // 事件的名称
    obj?: any, // 相关联的对象
    custom_event?: any, // 自定义事件
    time?: number, // 事件发生的时间
    periodic?: any, // 是否是周期性事件
    delay_init?: boolean, // 是否延迟初始化
}
declare class TriggerEvent{
    obj?:IEventNotify | any | undefined; // 事件触发对象，可能是IEventNotify类型或其他任意类型，也可能是undefined
    event_name?:string | undefined; // 事件名称，可能是字符串或undefined
    periodic?:boolean | undefined; // 是否为周期性事件，可能是布尔值或undefined
    time?:number | undefined; // 事件触发的时间，可能是数字或undefined
    constructor() // 构造函数，用于创建TriggerEvent实例
}
// 用于处理玩家加入的事件类
export class EventPlayerJoin extends TriggerEvent{
    obj: Player | base.PPlayerAny  // 对象类型
    evt_name: string  // 事件名称
    player: Player  // 玩家
    is_reconnect: boolean  // 是否重新连接
    is_connect_after_init: boolean  // 是否在初始化后连接
    user_id: UserID  // 用户ID
    constructor(obj:Player | base.PPlayerAny, evt_name:string, player:Player, is_reconnect:boolean, is_connect_after_init:boolean, user_id:UserID)  // 构造器
    readonly event_name: string  // 事件名称
    readonly autoForward: boolean  // 是否自动转发
}
这是玩家类：declare class Player implements IEventNotify {
    id: number; // 玩家ID
    controller: () => PlayerController; // 获取玩家的控制器
    get_hero: () => Unit; // 获取玩家的英雄单位
    lock_camera_by_mouse_wheel: () => void; // 通过鼠标滚轮锁定摄像头视角
    get_slot_id: () => number; // 获取玩家的槽位ID
    lock_camera: () => void; // 锁定摄像头视角
    is_abort: () => boolean; // 检查玩家是否已放弃游戏
    kick: (服务端记录: string, 客户端记录: string) => void; // 将玩家踢出游戏
    get_team_id: () => number; // 获取玩家的队伍ID
	 set_team_id: (队伍编号: number) => void; // 设置玩家的队伍ID
	get_match_team_id: () => number; // 获取玩家匹配队伍ID
    game_state: () => PlayerOnlineState; // 获取玩家的在线状态
    // 对玩家属性进行操作的方法
    add: (玩家属性: 玩家属性, 数值: number) => void; // 增加玩家属性值
    get_num: (玩家属性: 玩家属性) => number; // 获取玩家数值属性
    set_num: (玩家属性: 玩家属性, 数值: number) => void; // 设置玩家数值属性
    leave_reason: () => string; // 获取玩家离开原因
    set_afk: () => void; // 设置玩家为离开状态
    set_hero: (单位: Unit) => void; // 设置玩家的英雄单位
    unlock_camera: () => void; // 解锁摄像头视角
    user_agent: () => string; // 获取玩家的用户代理信息
    user_id: () => UserID; // 获取玩家的用户ID
    user_info: (类型: string) => any; // 获取玩家的用户信息
    user_level: () => number; // 获取玩家的用户等级
    get_nick_name: () => string; // 获取玩家昵称
    get_user_info: (属性: string) => any; // 获取玩家用户信息
    input_mouse: () => Point; // 获取玩家的鼠标输入
    input_rocker: () => number; // 获取摇杆输入
    camera_focus: (unit: Unit | undefined) => void; // 摄像头聚焦于某单位
    is_online: () => boolean; // 检查玩家是否在线
    alliance_state: (另一个玩家: Player) => AllianceState; // 获取与另一玩家的联盟状态
    is_neutral: () => boolean; // 检查玩家是否为中立状态
    set_is_neutral: (中立状态: boolean) => void; // 设置玩家为中立状态
    // 关于共享视野的方法
    // 强制切换给定玩家的共享视野状态
    toggle_force_share_sight: (另一个玩家: Player, 开关: boolean) => void;   
    // 与另一玩家共享视野
    share_sight_to_player: (other: Player) => void;   
    // 移除与另一玩家的共享视野
    remove_share_sight_to_player: (other: Player) => void;  
    // 发送事件通知，事件名和参数列表是可变的
    event_notify: (事件名: string, ...事件参数: Array<any>) => void; 
    // 设置玩家昵称
    set_nick_name: (新昵称: string) => void;
    // 设置英雄技能同步类型
    set_hero_skill_sync_type: (sync_type: SyncType) => void;
    // 构造函数，用于创建Player类的实例
    constructor();
}
