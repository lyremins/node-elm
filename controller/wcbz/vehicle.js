'use strict';

import vehicleModel from '../../models/wcbz/vehicle'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Vehicle extends BaseComponent{
	constructor(){
		super()
		this.addVehicle = this.addVehicle.bind(this);
		this.getVehicle = this.getVehicle.bind(this);
		this.getVehicleCount = this.getVehicleCount.bind(this);
		this.getVehicleDetail = this.getVehicleDetail.bind(this);
		this.updateVehicle = this.updateVehicle.bind(this);
		this.deleteVehicle = this.deleteVehicle.bind(this);
	}
	//添加人员
	async addVehicle(req, res, next){
        let vehicle_id;
		try{
            vehicle_id = await this.getId('vehicle_id');
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
			try{
				if (!fields.model) {
					throw new Error('必须填写型号');
				}
			}catch(err){
				console.log('前台参数出错', err.message);
				res.send({
					status: 0,
					type: 'ERROR_PARAMS',
					message: err.message
				})
				return
			}
			const newVehicle = {
                vehicle_id, // 飞机ID
                model: fields.model,       // 飞机型号
                name: fields.name,
                organiz: fields.organiz, // 单位
                service: fields.service, // 服务机型
                armyId: fields.armyId, // 部队编号
                product: fields.product, // 生产厂
                productTime: fields.productTime, // 生产时间
                life: fields.life, // 总寿命
                stageCourse: fields.stageCourse, // 阶段行驶里程
                repairNumber: fields.repairNumber, // 大修次数
                taskState: fields.taskState, // 车辆任务状态
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const vehicle = new vehicleModel(newVehicle);
				await vehicle.save();
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
	async getVehicle(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
            const users = await vehicleModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async getVehicleCount(req, res, next){
		try{
            console.log('222');
			const count = await vehicleModel.count()
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
	async getVehicleDetail(req, res, next){
        console.log(req.params);
		const vehicle_id = req.params.Vehicle_id;
		if (!vehicle_id || !Number(vehicle_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const vehicle = await vehicleModel.findOne({vehicle_id});
			res.send(vehicle)
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
    async updateVehicle(req, res, next){
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
                vehicle_id,
                model,
                name,
                state,
                organiz,
                service,
                armyId,
                product,
                productTime,
                life,
                stageCourse,
                repairNumber,
                taskState
            } = fields;
			try {
				let newData;
				newData = {
                    model,
                    name,
                    state,
                    organiz,
                    service,
                    armyId,
                    product,
                    productTime,
                    life,
                    stageCourse,
                    repairNumber,
                    taskState
                }
				await vehicleModel.findOneAndUpdate({vehicle_id}, {$set: newData});
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
    async deleteVehicle(req, res, next){
        console.log(req.params);
		const vehicle_id = req.params.Vehicle_id;
		if (!vehicle_id || !Number(vehicle_id)) {
			console.log('vehicle_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'vehicle_id参数错误',
			})
			return
		}
		try{
			await vehicleModel.findOneAndRemove({vehicle_id});
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

export default new Vehicle()