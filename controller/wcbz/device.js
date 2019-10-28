'use strict';

import deviceModel from '../../models/wcbz/device'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Device extends BaseComponent{
	constructor(){
		super()
		this.addDevice = this.addDevice.bind(this);
		this.getDevice = this.getDevice.bind(this);
		this.getDeviceCount = this.getDeviceCount.bind(this);
		this.getDeviceDetail = this.getDeviceDetail.bind(this);
		this.updateDevice = this.updateDevice.bind(this);
		this.deleteDevice = this.deleteDevice.bind(this);
	}
	//添加人员
	async addDevice(req, res, next){
        let device_id;
		try{
            device_id = await this.getId('device_id');
            console.log(device_id);
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
            console.log(fields);
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newDevice = {
                device_id,
				filed1: fields.filed1,
                filed2: fields.filed2,
                filed3: fields.filed3,
                filed4: fields.filed4,
                filed5: fields.filed5,
                filed6: fields.filed6,
                filed7: fields.filed7,
                filed8: fields.filed8,
                filed9: fields.filed9,
                filed10: fields.filed10,
                filed11: fields.filed11,
                filed12: fields.filed12,
                sy: fields.sy,
                create_time: dtime().format('YYYY-MM-DD HH:mm')
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const device = new deviceModel(newDevice);
				await device.save();
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
	async getDevice(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await deviceModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取用户列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取用户列表数据失败'
			})
		}
    }
    // 查询人员条数
    async getDeviceCount(req, res, next){
		try{
			const count = await deviceModel.count()
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取管理员数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取管理员数量失败'
			})
		}
    }
    // 获取人员详情
	async getDeviceDetail(req, res, next){
        console.log(req.params);
		const device_id = req.params.Device_id;
		if (!device_id || !Number(device_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const device = await deviceModel.findOne({device_id});
            console.log(device);
			res.send(device)
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
    async updateDevice(req, res, next){
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
			const {device_id,filed1, filed2,filed3,filed4,filed5,filed6,filed7,filed8,filed9,filed10,filed11,filed12,sy} = fields;
			try{
				let newData;
				newData = {filed1,filed2,filed3,filed4,filed5,filed6,filed7,filed8,filed9,filed10,filed11,filed12,sy}
				await deviceModel.findOneAndUpdate({device_id}, {$set: newData});
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
    async deleteDevice(req, res, next){
        console.log(req.params);
        const device_id = req.params.Device_id;
        console.log(device_id);
		if (!device_id || !Number(device_id)) {
			console.log('device_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'device_id参数错误',
			})
			return
		}
		try{
			await deviceModel.findOneAndRemove({device_id});
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

export default new Device()