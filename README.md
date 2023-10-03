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
其中team_id应该是进入游戏后，如果几名玩家是一样的id，那么他们就是一个队伍，而match_team_id应该是在进入游戏前如果玩家有组队，当时的组队id。
单位类：
declare class Unit implements IEventNotify{
    cache: _OBJ__unit_Unit; // 单位缓存对象
    inventorys?: Array<Inventory> | undefined; // 单位的物品栏数组
    ai: unknown; // 单位的AI
    removed?: boolean | undefined; // 单位是否已被移除
    get_id: () => number // 获取单位的ID
    enable_ai: () => void // 启用单位的AI
    add_skill: (技能名称: IdPreset<"spell_id">, 技能类型: AbilSlotType, 技能格子: number) => void // 为单位添加技能
    blink_ex: (目标点: Point) => boolean // 使单位瞬移到目标点
    disable_ai: () => void // 禁用单位的AI
    set_loot: (掉落列表Id: IdPreset<"loot_id">) => void // 设置单位的掉落列表
    add_ex: (单位数值属性: 单位属性, 变化值: number, 单位数值属性类型: UnitPropertySubType) => void // 增加单位的数值属性
    add_height: (高度: number) => void // 增加单位的高度
    add_restriction: (单位标记: _OBJ__Unit_Restriction) => void // 为单位添加限制
    add_sight: (可见形状: Sight) => void // 为单位增加视野
    get_ex: (单位数值属性: 单位属性, 单位数值属性类型: UnitPropertySubType) => number // 获取单位的数值属性
    get_attribute_max: (单位数值属性: 单位属性) => number // 获取单位数值属性的最大值
    get_attribute_min: (单位数值属性: 单位属性) => number // 获取单位数值属性的最小值
    get_facing: () => number // 获取单位的朝向
    get_height: () => number // 获取单位的高度
    get_name: () => IdPreset<"unit_id"> // 获取单位的名称
    get_owner: () => Player // 获取单位的所有者
    get_scene_point: () => Point // 获取单位所在场景的点
    get_restriction: (单位标记: UnitBehaviorState) => number // 获取单位的限制标记
    get_attackable_radius: () => number // 获取单位可攻击的半径
    get_team_id: () => number // 获取单位的队伍ID
    walk: (目标点: Point) => void // 单位向目标点行走
    has_restriction: (单位标记: UnitBehaviorState) => boolean // 判断单位是否有特定的限制标记
    is_alive_ex: () => boolean // 判断单位是否存活
    is_ally: (目标: Unit | Player) => boolean // 判断目标是否是友方
    is_enemy: (目标: Unit | Player) => boolean // 判断目标是否是敌方
    is_illusion: () => boolean // 判断单位是否是幻象
    is_in_range: (目标: Unit | Point, 范围半径: number) => boolean // 判断目标是否在单位的范围内
    is_visible: (目标: Unit | Player) => boolean // 判断目标对单位是否可见
    is_walking: () => boolean // 判断单位是否在行走
    add_z_speed: (速度: number) => void // 增加单位的z轴速度
    set_z_speed: () => void // 设置单位的z轴速度
    get_z_speed: () => number // 获取单位的z轴速度
    kill: (凶手: Unit) => void // 杀死单位
    learn_skill: (技能: Skill | IdPreset<"spell_id">) => boolean // 单位学习技能
    reborn: (位置: Point) => void // 单位在指定位置重生
    remove: () => void // 移除单位
    remove_buff: (BuffId: IdPreset<"buff_id">) => void // 移除单位的buff
    remove_provide_sight: (队伍编号: number) => void // 移除单位提供的视野
    remove_restriction: (单位标记: _OBJ__Unit_Restriction) => void // 移除单位的限制标记
	 replace_skill:(旧技能Id:IdPreset<"spell_id">, 新技能Id:IdPreset<"spell_id">)=>void // 替换单位的技能
    set_ex:(单位数值属性:单位属性, 值:number, 单位数值属性类型:UnitPropertySubType)=>void // 设置单位的数值属性
    get:(单位属性:单位属性 | 单位字符串属性)=>any // 获取单位的属性值
    set:(单位属性:单位属性 | 单位字符串属性, 值:any)=>void // 设置单位的属性值
    set_attribute_max:(单位数值属性:单位属性, 上限:number)=>void // 设置单位数值属性的最大值
    set_attribute_min:(单位数值属性:单位属性, 下限:number)=>void // 设置单位数值属性的最小值
    set_attribute_sync:(单位属性:单位属性 | 单位字符串属性, 同步方式:SyncType)=>void // 设置单位属性的同步方式
    set_facing:(角度:number)=>void // 设置单位的朝向
    set_height:(高度:number)=>void // 设置单位的高度
    set_asset:(模型:IdPreset<"model_id">)=>void // 设置单位的模型
    set_attackable_radius:(选取半径:number)=>void // 设置单位的可攻击半径
    get_scene_name:()=>Scene // 获取单位所在场景的名称
    jump_scene:(场景:Scene)=>boolean // 使单位跳转到另一个场景
    set_location_async:(位置:Point)=>void // 异步设置单位的位置
    set_facing_async:(朝向:number)=>void // 异步设置单位的朝向
    get_exp:()=>number // 获取单位的经验值
    add_exp:(经验值:number, 是否忽略倍率:boolean)=>void // 为单位添加经验值
    set_exp:(经验值:number)=>void // 设置单位的经验值
    get_level:()=>number // 获取单位的等级
    add_level:(等级:number)=>void // 为单位增加等级
    set_level:(等级:number)=>void // 设置单位的等级
    get_max_level:()=>number // 获取单位的最大等级
    set_max_level:(等级上限:number)=>void // 设置单位的最大等级
    get_exp_fraction:()=>number // 获取单位的经验倍率
    set_exp_fraction:(经验倍率:number)=>void // 设置单位的经验倍率
    set_prohibit_exp_distribute:(是否禁止参与:boolean)=>void // 设置单位是否禁止分配经验
    set_level_profile:(单位升级配置Id:IdPreset<"unit_level_profile_id">)=>undefined // 设置单位的升级配置
    get_single_level_exp:(等级:number)=>number // 获取单位单级所需经验
    get_cumu_level_exp:(等级:number)=>number // 获取单位累计所需经验
    cast:(技能:IdPreset<"spell_id"> | Skill, 目标:undefined | number | Unit | Point | boolean)=>void // 对目标施放技能
    cast_no_target:(技能:IdPreset<"spell_id"> | Skill)=>void // 施放无目标技能
    cast_on_unit:(技能:IdPreset<"spell_id"> | Skill, 目标单位:Unit)=>void // 对目标单位施放技能
    cast_on_point:(技能:IdPreset<"spell_id"> | Skill, 目标点:Point)=>void // 对目标点施放技能
    cast_on_angle:(技能:IdPreset<"spell_id"> | Skill, 目标角度:number)=>void // 沿指定角度施放技能
    clean_command:()=>void // 清除单位的指令
    current_skill:()=>Cast // 获取单位当前正在施放的技能
    add_provide_sight:(队伍Id:number)=>void // 为指定队伍提供视野
    get_snapshot:()=>Snapshot // 获取单位的快照
    create_inventorys:()=>void // 创建单位的物品栏
    create_inventory:(数编id:IdPreset<"item_container_id">)=>Inventory // 创建单位的指定物品栏
    can_hold:(物品:Item)=>boolean // 判断单位是否可以持有物品
    execute_on:(目标:Point | Unit, 效果名:IdPreset<"effect_id">)=>void // 在目标上执行效果
    has_item:(物品id:IdPreset<"item_id">)=>boolean // 判断单位是否拥有指定物品
    all_items:()=>Array<Item> // 获取单位拥有的所有物品
    do_trigger_damage:(目标单位:Unit, 伤害:number, 伤害类型:伤害类型)=>void // 对目标单位触发伤害
    find_buff:(BuffId:IdPreset<"buff_id">)=>Buff | undefined // 查找单位的buff
    has_buff:(id:IdPreset<"buff_id">)=>boolean // 判断单位是否拥有指定buff
    find_skill:(技能Id:IdPreset<"spell_id">)=>Skill | undefined // 查找单位的技能
    heal_ex:(目标:Unit, 治疗量:number)=>void // 治疗目标单位
    remove_animation:(动画名称:string)=>void // 移除单位的动画
    /** @deprecated */
    each_skill:(技能类型:AbilSlotType | undefined)=>void // 遍历单位的技能（已废弃）
    /** @deprecated */
    each_mover:()=>Array<Mover> // 遍历单位的移动器（已废弃）
    /** @deprecated */
    each_buff:(buff_id:IdPreset<"buff_id"> | undefined)=>Array<Buff> // 遍历单位的buff（已废弃）
    get_buff_stack_all:(BuffId:IdPreset<"buff_id">)=>number // 获取单位所有buff的叠加数量
    /** @deprecated */
    each_skill_all:()=>Array<Skill> // 遍历单位的所有技能（已废弃）
    set_model_attribute:(模型属性:string, 值:any)=>void // 设置单位模型的属性	
	execute_ai:()=>void // 执行AI
event_notify:(事件名:string, ...事件参数:Array<any>)=>void // 通知事件
grant_loot:(奖励Id:IdPreset<"loot_id">, 目标单位:Unit)=>void // 授予战利品
change_type:(unitId:IdPreset<"unit_id">)=>boolean // 改变单位类型
refresh_unit_buff_actors:()=>void // 刷新单位buff效果
find_skill_by_slot:(slot:number)=>Skill | undefined // 通过槽位查找技能
set_owner:(player:Player)=>void // 设置所有者
get_attack:()=>Skill | undefined // 获取攻击
has_module:(组件:_OBJ__UnitData_Module)=>boolean // 是否有模块
is_item:()=>boolean // 是否是物品
set_scale:(缩放:number)=>void // 设置缩放
has_label:(filter:单位标签)=>boolean // 是否有标签
has_immunity:(flag:UnitBehaviorState)=>boolean // 是否有免疫
get_inventory_items:(物品栏编号:number)=>Array<Item> // 获取物品栏物品
is_valid:()=>boolean // 是否有效
set_custom:(属性:单位属性, 子属性:单位属性子类型, 值:number)=>void // 设置自定义属性
add_custom:(属性:单位属性, 子属性:单位属性子类型, 值:number)=>void // 增加自定义属性
get_custom:(属性:单位属性, 子属性:单位属性子类型)=>number // 获取自定义属性
get_buffs_by_link:(this: void)=>Array<Buff> // 通过链接获取buffs
add_buff:(link:string)=>(this: void, arg1:any)=>Buff // 添加buff
assign_item_to_slot_by_id:(物品:Item, 格子ID:number | undefined)=>boolean // 将物品分配到指定格子
has_ai:()=>boolean // 是否有AI
set_string:(单位属性:单位字符串属性, 值:string)=>void // 设置字符串属性
get_string:(单位属性:单位字符串属性)=>string // 获取字符串属性
refresh:(新参数:单位属性)=>void // 刷新
anim_play:(动画名:string, 时间因子:number | undefined, 时间因子类型:number, 从动画的第x秒播放:number, 动画优先级:number)=>void // 播放动画
anim_play_bracket:(出生动画:string, 持续动画:string, 结束动画:string)=>void // 播放包围动画
anim_play_once:(动画名:string, 动画优先级:number)=>void // 播放动画一次
anim_play_speed:(动画名:string, 播放速度:number, 动画优先级:number)=>void // 以指定速度播放动画
anim_play_time:(动画名:string, 持续时间:number, 动画优先级:number)=>void // 播放动画一定时间
anim_play_start_time:(动画名:string, 开始时间:number, 速度:number, 动画优先级:number)=>void // 从指定时间开始播放动画
anim_play_bracket_once:(出生动画:string | undefined, 持续动画:string | undefined, 结束动画:string | undefined)=>void // 播放包围动画一次
anim_play_bracket_time:(出生动画:string, 持续动画:string, 结束动画:string, 持续时间:number)=>void // 播放包围动画一定时间
	anim_stop:()=>void // 停止动画
cast_on_switch:(技能:IdPreset<"spell_id"> | Skill, 开关状态:boolean)=>void // 在开关状态下施放技能
remove_inventory:(物品栏:Inventory)=>void // 移除物品栏
cast_request:(skill:Skill | IdPreset<"spell_id">, target?:number | Point | Unit | undefined, data?:LuaTable<string, any> | undefined)=>void // 请求施放技能，可以指定目标和附加数据
stop:()=>void // 停止单位的当前动作
receive_quest:(任务Id:IdPreset<"quest_id">)=>Quest | undefined // 接受任务，返回任务对象，如果任务ID无效则返回undefined
get_quests:()=>Array<Quest> // 获取单位的所有任务
get_quest_conditions:()=>Array<QuestCondition> // 获取单位的所有任务条件
set_attribute_max_user:(属性:单位属性, 最大值:number | undefined)=>void // 设置单位属性的用户定义最大值
get_walking_target:()=>Point | undefined // 获取单位的行走目标，如果没有则返回undefined
find_quest:(quest_link:IdPreset<"quest_id">)=>Quest | undefined // 查找任务，返回任务对象，如果任务链接无效则返回undefined
set_visible:(玩家:Player, 可见性:PVisibilitySetting)=>void // 设置单位对指定玩家的可见性
constructor() // 构造函数，用于创建新的单位对象
}
玩家类：
declare class Player implements IEventNotify {
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
触发器：
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
单位组：
declare class UnitGroup extends Set implements Set{
    get_length:()=>number // 获取单位组的长度
    add_item:(单位:Unit | undefined)=>void // 向单位组添加单位
    forEachEx:(匿名函数:(arg1:Unit)=>boolean | undefined)=>void // 对单位组中的每个单位执行匿名函数
    copy:()=>UnitGroup // 复制单位组
    constructor() // 构造函数，用于创建UnitGroup实例
}
点：
declare class Point {
    distance: (目标点: Point) => number // 计算与目标点的距离
    angle: (目标点: Point) => number // 计算与目标点的角度
    /** @deprecated */
    play_sound: (音效名: string) => void // 播放音效（已废弃）
    polar_to_ex: (方向: number, 距离: number) => Point // 根据极坐标方向和距离获取新的点
    is_block: () => boolean // 判断点是否被阻挡
    is_visible_to: (单位or玩家: Player | Unit) => boolean // 判断点是否对单位或玩家可见
    get_x: () => number // 获取点的x坐标
    get_y: () => number // 获取点的y坐标
    get_z: () => number // 获取点的z坐标
    get_scene: () => string // 获取点所在的场景名称
    group_range: (半径: number, tag: string, 场景: Scene | undefined, 允许死亡单位: boolean) => Array<Unit> // 获取点周围范围内的单位组
    get_scene_point: () => Point // 获取场景点
    set_height: (高度: number) => void // 设置点的高度
    is_block_ex: () => boolean // 扩展的判断点是否被阻挡的方法
    constructor() // 构造函数，用于创建Point实例
}
场景类：
declare class SceneObject{
    get_all_unit:()=>UnitGroup // 获取场景中的所有单位
    add_rect:(中心:Point, 宽:number, 高:number)=>RegionRect // 在场景中添加一个矩形区域
    add_circle:(中心:Point, 范围:number)=>RegionCircle // 在场景中添加一个圆形区域
    get_default_name:()=>string // 获取场景的默认名称
    get_key_name:()=>string // 获取场景的键名
    get_all_area:()=>Array<Region> // 获取场景中的所有区域
    get_all_trigger:()=>Array<Trigger> // 获取场景中的所有触发器
    add_trigger:(触发器:Trigger)=>void // 在场景中添加一个触发器
    close:()=>void // 关闭场景
    scene_point:(X:number, Y:number)=>Point // 根据坐标X,Y获取场景中的点
    add_unit:(玩家:Player, 单位类型:IdPreset<"unit_id">, 中心:Point, 面向角度:number, 有ai:boolean)=>Unit // 在场景中添加一个单位
    player_jump:(玩家:Player, 携带英雄:boolean)=>void // 玩家跳跃
    constructor() // 构造函数
}
区域：
declare class RegionRect extends Region{
    get_width:()=>number // 获取矩形区域的宽度
    get_height:()=>number // 获取矩形区域的高度
    constructor() // 构造函数
}

declare class RegionCircle extends Region{
    get_range:()=>number // 获取圆形区域的半径
    constructor() // 构造函数
}
declare class Region {
    scene_random_point: () => Point // 获取区域内的随机点
    get_scene_point: () => Point // 获取区域内的场景点
    init_region: () => void // 初始化区域
    remove_region: () => void // 移除区域
    constructor() // 构造函数，用于创建Region实例
}
其他：
declare const enum ActorGridState {
    ["Disabled"] = 1, // 禁用：角色在网格中处于禁用状态。
    ["Enabled"] = 2, // 启用：角色在网格中处于启用状态。
    ["Custom"] = 3, // 自定义：角色在网格中的状态为自定义。
}
declare const enum AbilSlotType {
    ["Heroic"] = "英雄", // 英雄：代表英雄级别的技能。
    ["Hidden"] = "隐藏", // 隐藏：代表不显示在界面上的技能。
    ["Attack"] = "攻击", // 攻击：代表普通攻击技能。
    ["Generic"] = "通用", // 通用：代表普通的、非特定类别的技能。
    ["Item"] = "物品", // 物品：代表由物品提供的技能。
}

declare const enum EffectParamUnitLocation {
    ["Caster"] = "Caster", // Caster：效果发起者的位置。
    ["Target"] = "Target", // Target：效果目标的位置。
    ["MainTarget"] = "MainTarget", // MainTarget：主要效果目标的位置。
    ["Missile"] = "Missile", // Missile：导弹的位置。
}

declare const enum CamShakeDirection {
    ["None"] = "", // 无：没有摄像机震动。
    ["Axis-X"] = "x", // X轴：摄像机沿X轴震动。
    ["Axis-Y"] = "y", // Y轴：摄像机沿Y轴震动。
    ["Axis-Z"] = "z", // Z轴：摄像机沿Z轴震动。
    ["Axis-XY"] = "xy", // XY轴：摄像机沿XY轴震动。
    ["Axis-XZ"] = "xz", // XZ轴：摄像机沿XZ轴震动。
    ["Axis-YZ"] = "yz", // YZ轴：摄像机沿YZ轴震动。
    ["Axis-All"] = "xyz", // 所有轴：摄像机沿所有轴震动。
}
declare const enum 单位字符串属性 {
	["CustomString"] = "CustomString", // 单位的自定义字符串属性
}

declare const enum 单位属性 {
	["暴击伤害"] = "暴击伤害",
	["护甲"] = "护甲",
	["暴击"] = "暴击",
	["护盾"] = "护盾",
	["闪避"] = "闪避",
	["急速"] = "急速",
	["最大转身速度"] = "最大转身速度",
	["攻击范围"] = "攻击范围",
	["法术穿透"] = "法术穿透",
	["是否存活"] = "是否存活",
	["转身速度"] = "转身速度",
	["升级所需经验"] = "升级所需经验",
	["等级"] = "等级",
	["魔法上限"] = "魔法上限",
	["破甲"] = "破甲",
	["生命恢复"] = "生命恢复",
	["剩余经验"] = "剩余经验",
	["生命"] = "生命",
	["魔法恢复"] = "魔法恢复",
	["魔抗"] = "魔抗",
	["高度"] = "高度",
	["格挡"] = "格挡",
	["生命上限"] = "生命上限",
	["最小转身速度"] = "最小转身速度",
	["追逐距离"] = "追逐距离",
	["等级上限"] = "等级上限",
	["穿透"] = "穿透",
	["重置距离"] = "重置距离",
	["减耗"] = "减耗",
	["视野范围"] = "视野范围",
	["吸血"] = "吸血",
	["搜敌范围"] = "搜敌范围",
	["移动速度"] = "移动速度",
	["经验"] = "经验",
	["魔法"] = "魔法",
	["死亡经验"] = "死亡经验",
	["冷却缩减"] = "冷却缩减",
	["技能点"] = "技能点",
	["法术破甲"] = "法术破甲",
	["单位标记"] = "单位标记",
	["攻击速度"] = "攻击速度",
	["攻击"] = "攻击",
}
declare const enum 单位标签 {
	["基地"] = "基地",
	["空中"] = "空中",
	["弹道"] = "弹道",
	["英雄"] = "英雄",
	["近战"] = "近战",
	["物品"] = "物品",
	["商店"] = "商店",
	["远程"] = "远程",
	["守卫"] = "守卫",
	["地面"] = "地面",
	["建筑"] = "建筑",
	["箭塔"] = "箭塔",
	["泉水"] = "泉水",
	["单位"] = "单位",
	["兵营"] = "兵营",
	["小兵"] = "小兵",
	["野怪"] = "野怪",
	["机械"] = "机械",
}
declare const enum 伤害类型 {
	["魔法"] = "魔法", // 魔法伤害，通常由技能或法术造成
	["真实"] = "真实", // 真实伤害，通常无视防御或抗性
	["物理"] = "物理", // 物理伤害，通常由普通攻击造成
}
declare const enum 玩家属性 {
    ["金钱"] = "金钱", // 玩家当前拥有的金钱数量
    ["人口上限"] = "人口上限", // 玩家可以控制的单位的最大数量
    ["助攻"] = "助攻", // 玩家助攻次数
    ["死亡"] = "死亡", // 玩家英雄的死亡次数
    ["人口"] = "人口", // 玩家当前控制的单位数量
    ["补刀"] = "补刀", // 玩家击杀非英雄单位的次数
    ["英雄ID"] = "英雄ID", // 玩家所选英雄的唯一标识
    ["击杀"] = "击杀", // 玩家击杀敌方英雄的次数
    ["复活时间上限"] = "复活时间上限", // 玩家英雄的最大复活时间
    ["队伍"] = "队伍", // 玩家所在的队伍
    ["英雄类型"] = "英雄类型", // 玩家英雄的类型
    ["复活时间"] = "复活时间", // 玩家英雄当前的复活时间
    ["镜头目标单位"] = "镜头目标单位", // 玩家当前的镜头目标单位
}
declare const enum 验证器代码 {
    ["NotSupported"] = 1, // 不支持的操作
    ["Error"] = 2, // 出现错误
    ["MustTargetUnit"] = 3, // 必须以单位为目标
    ["NotEnoughTarget"] = 4, // 目标不足
    ["NotEnoughRoomToPlace"] = 5, // 放置空间不足
    ["InvalidUnitType"] = 6, // 无效的单位类型
    ["InvalidPlayer"] = 7, // 无效的玩家
    ["NothingToExecute"] = 8, // 没有要执行的操作
    ["MustTargetCertainUnit"] = 9, // 必须以特定单位为目标
    ["CannotTargetCertainUnit"] = 10, // 不能以特定单位为目标
    ["TargetIsOutOfRange"] = 11, // 目标超出范围
    ["TargetIsTooClose"] = 12, // 目标过于接近
    ["NoIntermediateUnit"] = 13, // 没有中间单位
    ["AlreadyExecuted"] = 14, // 已经执行
    ["CannotTargetThat"] = 15, // 不能以该物体为目标
    ["OK"] = 0, // 操作成功
}

declare const enum 血条类型 {
    ["BLOODBAR_TYPE_HERO"] = "BLOODBAR_TYPE_HERO", // 英雄血条
    ["BLOODBAR_TYPE_NORMAL_MANA"] = "BLOODBAR_TYPE_NORMAL_MANA", // 普通单位法力血条
    ["BLOODBAR_TYPE_HERO_MANA"] = "BLOODBAR_TYPE_HERO_MANA", // 英雄法力血条
    ["BLOODBAR_TYPE_HERO_ANGER"] = "BLOODBAR_TYPE_HERO_ANGER", // 英雄怒气血条
    ["BLOODBAR_TYPE_NORMAL"] = "BLOODBAR_TYPE_NORMAL", // 普通单位血条
    ["BLOODBAR_TYPE_HERO_ENERGY"] = "BLOODBAR_TYPE_HERO_ENERGY", // 英雄能量血条
}

declare const enum 能量类型 {
    ["魔法"] = "魔法", // 法力值，用于施放法术
    ["能量"] = "能量", // 能量值，用于使用特定技能
    ["怒气"] = "怒气", // 怒气值，用于发动强力攻击
}

declare class Actor{
    cache:_OBJ__actor_Actor;
    set_ground_z:(相对高度:number)=>void // 设置单位相对于地面的高度
      set_position:(位置:Point)=>void // 设置单位的位置
    set_facing:(朝向:number)=>void // 设置单位的朝向
    destroy:(强制:boolean)=>void // 销毁单位，强制参数决定是否无视保护机制直接销毁
    set_asset:(资源:IdPreset<"model_id"> | IdPreset<"particle_id"> | IdPreset<"sound_id">)=>void // 设置单位的模型、粒子效果或声音资源
    set_owner:(玩家:Player)=>void // 设置单位的所有者
    set_shadow:(是否显示影子:boolean)=>void // 设置单位是否显示影子
    set_scale:(缩放:number)=>void // 设置单位的缩放比例
    play:()=>void // 播放单位的动画或声音
    stop:()=>void // 停止单位的动画或声音
    pause:()=>void // 暂停单位的动画或声音
    resume:()=>void // 恢复单位的动画或声音
    set_volume:(音量:number)=>void // 设置单位声音的音量
    set_launch_ground_z:(z:number)=>void // 设置发射物的相对高度
    set_launch_scene_point:(坐标:Point)=>void // 设置发射物的发射位置
    set_launch_site:(单位:Unit, 绑点:string)=>void // 设置发射物的发射起点单位和绑点
    set_text:(文字:string)=>void // 为单位设置文本
    constructor() // 构造函数，用于创建Actor实例
}
declare class Snapshot{
	get_point:()=>Point // 获取快照位置
	get_name:()=>IdPreset<"unit_id"> // 获取快照名称
	get_owner:()=>Player // 获取快照所有者
	get_facing:()=>number // 获取快照朝向
	constructor() // 构造函数，用于创建Snapshot实例
}
declare class UnitTable {
    unit_name: string; // 单位名称
    is_main_hero: boolean; // 是否为主英雄
    default_ai: string; // 默认AI
    player_slot: number; // 玩家插槽
    face: number; // 面朝方向
    position: ScreenPos; // 单位位置
    constructor() // 构造函数，用于创建UnitTable实例
}
declare class Mover {
    batch_update: () => void // 批量更新移动器
    remove: () => void // 移除移动器
    constructor() // 构造函数，用于创建Mover实例
}
declare class Buff {
    cache: _OBJ__buff_Buff; // Buff的缓存对象，用于存储buff的实际数据
    link: IdPreset<"buff_id">; // Buff的ID
    unit_buff: UnitBuff; // 与Buff关联的UnitBuff对象
    stack_param: EffectParam; // Buff的叠加参数
    attributes?: Array<UnitPropertyBonus> | undefined; // Buff可能会改变的单位属性
    get_pulse: () => number; // 获取Buff的周期，即多长时间触发一次效果
    set_pulse: (周期: number) => void; // 设置Buff的周期
    get_remaining: () => number; // 获取Buff的剩余时间
    set_remaining: (剩余时长: number) => void; // 设置Buff的剩余时间
    get_time: () => number; // 获取Buff的总时长
    set_time: (总时长: number) => void; // 设置Buff的总时长
    get_stack: () => number; // 获取Buff的叠加层数
    add_stack_: (层数: number) => void; // 增加Buff的叠加层数
    set_stack_: (层数: number) => number; // 设置Buff的叠加层数
    remove: () => void; // 移除Buff
    is_enabled: () => boolean; // 检查Buff是否启用
    filter_categories: (过滤器: base.target_filters) => boolean; // 根据给定的过滤器过滤Buff的分类
    get_tracked_units: () => UnitGroup; // 获取Buff跟踪的单位组
    set_level: (level: number) => void; // 设置Buff的等级
    get_level: () => number; // 获取Buff的等级
    get_remain_time: () => number; // 获取Buff的剩余时间，同get_remaining
    buff_get_tracked_units_v2: () => UnitGroup; // 获取Buff跟踪的单位组的第二个版本
    constructor(); // Buff的构造函数
}

declare class HealInstance{
    get_heal:()=>number // 获取治疗量
    get_current_heal:()=>number // 获取当前治疗量
    constructor() // 构造函数，用于创建HealInstance实例
}
declare class Skill implements IEventNotify {
    owner: Unit; // 技能的拥有者，通常是一个单位
    cache: _OBJ__spell_Spell; // 技能的缓存对象，可能存储了技能的状态或其他信息
    last_target: Unit | Point | number | undefined; // 技能最后一次的目标，可以是单位、点或数字
    target_type: _OBJ__Spell_target_type; // 技能的目标类型，如单体、群体等
    source_item: Item; // 如果技能由物品触发，则存储触发技能的物品
    phase: number; // 多段技能的阶段
    // 方法列表
    active_cd: (冷却上限: number, 无视冷却缩减: boolean) => void; // 激活技能冷却
    active_custom_cd: (冷却上限: number, 当前冷却: number) => void; // 激活自定义冷却时间
    add_level: (等级: number) => void; // 增加技能等级
    add_stack: (层数: number) => void; // 增加技能层数，例如增加被动技能效果的层数
    get_num: (数值属性: 技能属性) => number; // 获取技能数值属性
    set_num: (数值属性: 技能属性, 值: number) => void; // 设置技能数值属性
    get: (技能属性: 技能属性) => any; // 获取技能属性
    set_option: (技能属性: 技能属性, 值: any) => void; // 设置技能选项
    disable: () => void; // 禁用技能
    enable: () => void; // 启用技能
    enable_hidden: () => void; // 启用隐藏技能
    disable_hidden: () => void; // 禁用隐藏技能
    get_cd: () => number; // 获取技能冷却时间
    get_level: () => number; // 获取技能等级
    get_name: () => IdPreset<"spell_id">; // 获取技能名称
    get_slot_id: () => number; // 获取技能槽位ID
    get_owner: () => Unit; // 获取技能的拥有者
    get_type: () => AbilSlotType; // 获取技能类型
    is_cast: () => boolean; // 判断技能是否在施放中
    is_enable: () => boolean; // 判断技能是否可用
    is_hidden: () => boolean; // 判断技能是否处于隐藏状态
    notify_damage: (伤害: DamageInstance) => void; // 通知伤害，可能用于处理技能造成的伤害
    reload: () => void; // 重新加载技能，可能用于重置技能状态
    remove: () => void; // 移除技能
    set_animation: (动画: string) => void; // 设置技能动画
    set_cd: (冷却: number) => void; // 设置技能冷却时间
    set_cd_force: (冷却: number, 强制激活延长: boolean) => void; // 强制设置技能冷却时间
    set_level: (等级: number) => void; // 设置技能等级
    set_upgradable: (可升级: boolean) => void; // @deprecated 设置技能是否可升级，已废弃
    event_notify: (事件名称: string, ...事件参数: Array<any>) => void; // 事件通知，用于处理技能相关事件
    can_cast: (target: undefined | Unit | Point | number, checkRange: boolean) => cast_error_code; // 判断技能是否可以施放
    can_learn: () => boolean; // 判断技能是否可以学习
    learn: () => boolean; // 学习技能
    set_autocast_on: (打开: boolean) => void; // 设置技能是否自动施放
    get_active_item: () => Item; // 获取激活技能的物品，如果有的话
    get_disable_count: () => number; // 获取技能被禁用的次数
    set_phase: (多段技能阶段: number) => void; // 设置多段技能的阶段
    is_toggled_on: () => boolean; // 判断技能是否被切换为开启状态
    constructor(); // 构造函数
}
