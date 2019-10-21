'use strict';

import configModel from '../../models/wcbz/config'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Config extends BaseComponent{
	constructor(){
		super()
		this.addConfig = this.addConfig.bind(this);
	}
	//添加人员
	async addConfig(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const newConfig = {
                stateModel: fields.stateModel,
                taskModel: fields.taskModel,
                faultModel: fields.faultModel, // 飞机故障
                subjectModel: fields.subjectModel, // 飞行科目
                sceneModel: fields.sceneModel, // 气象科目
                carStateModel: fields.carStateModel, // 车辆状态
                carTaskModel: fields.carTaskModel, // 车辆任务
                carTypeModel: fields.carTypeModel, // 车辆类型
                carFaultModel: fields.carFaultModel, // 车辆故障
                pTypeModel: fields.pTypeModel, // 人员类别
                pMajorModel: fields.pMajorModel, // 人员专业
                pPostModel: fields.pPostModel, // 人员职务
                ensureModel: fields.ensureModel, // 保障任务
                pStatusModel: fields.pStatusModel, // 人员工作状态
                carWorkModel: fields.carWorkModel  // 车辆工作状态
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const config = new configModel(newConfig);
				await config.save();
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
	async getConfig(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
            const users = await configModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async getConfigCount(req, res, next){
		try{
            console.log('222');
			const count = await configModel.count()
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
	async getConfigDetail(req, res, next){
        console.log(req.params);
		const config_id = req.params.Config_id;
		if (!config_id || !Number(config_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const config = await configModel.findOne({config_id});
			res.send(config)
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
    async updateConfig(req, res, next){
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
                stateModel,
                taskModel,
                faultModel,
                subjectModel,
                sceneModel,
                carStateModel,
                carTaskModel,
                carTypeModel,
                carFaultModel,
                pTypeModel,
                pMajorModel,
                pPostModel,
                ensureModel,
                pStatusModel,
                carWorkModel
            } = fields;
			try {
				let newData;
				newData = {
                    stateModel,
                    taskModel,
                    faultModel,
                    subjectModel,
                    sceneModel,
                    carStateModel,
                    carTaskModel,
                    carTypeModel,
                    carFaultModel,
                    pTypeModel,
                    pMajorModel,
                    pPostModel,
                    ensureModel,
                    pStatusModel,
                    carWorkModel
                }
				await configModel.findOneAndUpdate({$set: newData});
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
    async deleteConfig(req, res, next){
        console.log(req.params);
		const config_id = req.params.Config_id;
		if (!config_id || !Number(config_id)) {
			console.log('config_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'config_id参数错误',
			})
			return
		}
		try{
			await configModel.findOneAndRemove({config_id});
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

export default new Config()