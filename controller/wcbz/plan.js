'use strict';

import planModel from '../../models/wcbz/plan'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Plan extends BaseComponent{
	constructor(){
		super()
		this.addPlan = this.addPlan.bind(this);
		this.getPlan = this.getPlan.bind(this);
		this.getPlanCount = this.getPlanCount.bind(this);
		this.getPlanDetail = this.getPlanDetail.bind(this);
		this.updatePlan = this.updatePlan.bind(this);
		this.deletePlan = this.deletePlan.bind(this);
	}
	//添加人员
	async addPlan(req, res, next){
        let plan_id;
		try{
            plan_id = await this.getId('plan_id');
		}catch(err){
			console.log('获取id失败');
			res.send({
				type: 'ERROR_DATA',
				message: '获取数据失败'
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const newPlan = {
                plan_id, // 飞机ID
                name: fields.name,
                dateTime: fields.dateTime,
                airName: fields.airName,
                vehicleName: fields.vehicleName,
                subjectName: fields.subjectName,
                dateTime: fields.dateTime, // 选择日期
                airSubject: fields.airSubject, // 飞行科目
                sceneSubject: fields.sceneSubject, // 气象科目
                upDownNumber: fields.upDownNumber, // 起落次数
                flightTime: fields.flightTime, // 飞行时间
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const plan = new planModel(newPlan);
				await plan.save();
				res.send({
					status: 1,
					sussess: '添加成功'
				})
			}catch(err){
				console.log('写入数据库失败');
				res.send({
					status: 0,
					type: 'ERROR_SERVER',
					message: '添加失败',
				})
			}
		})
    }
    // 查询人员
	async getPlan(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
            const users = await planModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            console.log(users);
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取飞机列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取飞机列表数据失败'
			})
		}
    }
    // 查询人员条数
    async getPlanCount(req, res, next){
		try{
            console.log('222');
			const count = await planModel.count()
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取飞机数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取飞机数量失败'
			})
		}
    }
    // 获取人员详情
	async getPlanDetail(req, res, next){
        console.log(req.params);
		const plan_id = req.params.Plan_id;
		if (!plan_id || !Number(plan_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const plan = await planModel.findOne({plan_id});
			res.send(plan)
		}catch(err){
			console.log('获取人员详情失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取人员详情失败'
			})
		}
    }
    // 更新人员
    async updatePlan(req, res, next){
        const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取信息form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return
			}
			const {
                plan_id,
            } = fields;
			try {
				let newData;
				newData = {
                    model,
                    name
                }
				await planModel.findOneAndUpdate({plan_id}, {$set: newData});
				res.send({
					status: 1,
					success: '修改信息成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_RESTAURANT',
					message: '更新信息失败',
				})
			}
		})
    }
    // 删除人员
    async deletePlan(req, res, next){
        console.log(req.params);
		const plan_id = req.params.Plan_id;
		if (!plan_id || !Number(plan_id)) {
			console.log('plan_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'plan_id参数错误',
			})
			return
		}
		try{
			await planModel.findOneAndRemove({plan_id});
			res.send({
				status: 1,
				success: '删除成功',
			})
		}catch(err){
			console.log('删除失败', err);
			res.send({
				status: 0,
				type: 'DELETE_RESTURANT_FAILED',
				message: '删除失败',
			})
		}
	}
}

export default new Plan()