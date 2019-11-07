'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const personnelSchema = new Schema({
	user_name: String,       // 姓名
	sex: String,             // 性别
	person_id: Number,
    create_time: String,     // 创建时间
    phone: String,           // 联系方式
    type: String,            // 工种
    detachment: String,      // 所属分队
    remark: String,          // 备注
    organiz: String,          // 组织架构
    native: String,           // 籍贯
    company: String,     // 单位
    row: String, // 排
    post: String, // 职务
    major: String, // 专业
    grade: String, // 等级
    bindAir: String, // 绑定飞机
    enlist: String, // 入伍时间
    school: String, // 毕业院校
    greatTask: String, //执行重大任务
    duty: String, // 是否在岗
})

personnelSchema.index({id: 1});

const Personnel = mongoose.model('Personnel', personnelSchema);


export default Personnel
