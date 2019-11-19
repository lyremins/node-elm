'use strict';

import airplaneDeviceModel from '../../models/wcbz/airplane_device'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class AirplaneDevice extends BaseComponent{
	constructor(){
		super()
		this.addAirplaneDevice = this.addAirplaneDevice.bind(this);
		this.getAirplaneDevice = this.getAirplaneDevice.bind(this);
		this.getAirplaneDeviceCount = this.getAirplaneDeviceCount.bind(this);
		this.getAirplaneDeviceDetail = this.getAirplaneDeviceDetail.bind(this);
		this.updateAirplaneDevice = this.updateAirplaneDevice.bind(this);
		this.deleteAirplaneDevice = this.deleteAirplaneDevice.bind(this);
	}
	//添加人员
	async addAirplaneDevice(req, res, next){
        let airplaneDevice_id;
		try{
            airplaneDevice_id = await this.getId('airplaneDevice_id');
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
			const newAirplaneDevice = {
                airplaneDevice_id, // 飞机ID
                name: fields.name, // 名称
                air_code: fields.air_code,   // 飞机编号
                device_code: fields.device_code, // 有售器件编号
                sm: fields.sm, // 当前寿命
                zsm: fields.zsm, // 总寿命
                ys:fields.ys, // 余寿报警阈值
                model: fields.model
            }
            console.log(newAirplaneDevice.airplaneDevice_id);
			try{
				//保存数据，并增加对应食品种类的数量
				const airplaneDevice = new airplaneDeviceModel(newAirplaneDevice);
                await airplaneDevice.save();
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
	async getAirplaneDevice(req, res, next){
		const {limit = 200, offset = 0} = req.query;
		try{
            const users = await airplaneDeviceModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async getAirplaneDeviceCount(req, res, next){
		try{
            console.log('222');
			const count = await airplaneDeviceModel.count()
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
	async getAirplaneDeviceDetail(req, res, next){
        console.log(req.params);
		const airplaneDevice_id = req.params.airplaneDevice_id;
		if (!airplaneDevice_id || !Number(airplaneDevice_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const airplaneDevice = await airplaneDeviceModel.findOne({airplaneDevice_id});
			res.send(airplaneDevice)
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
    async updateAirplaneDevice(req, res, next){
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
                airplaneDevice_id,
                name,
                air_code,
                device_code,
                sm,
                zsm,
                ys,
                model

            } = fields;
            console.log(fields);
            const create_time = dtime().format('YYYY-MM-DD HH:mm');
			try {
				await airplaneDeviceModel.findOneAndUpdate({airplaneDevice_id}, {$set: fields});
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
    async deleteAirplaneDevice(req, res, next){
        console.log(req.params);
		const airplaneDevice_id = req.params.airplaneDevice_id;
		if (!airplaneDevice_id || !Number(airplaneDevice_id)) {
			console.log('airplaneDevice_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'airplaneDevice_id参数错误',
			})
			return
		}
		try{
			await airplaneDeviceModel.findOneAndRemove({airplaneDevice_id});
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

export default new AirplaneDevice()