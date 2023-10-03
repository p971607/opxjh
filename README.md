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
位:Unit)=>void // 对目标单位施放技能
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

