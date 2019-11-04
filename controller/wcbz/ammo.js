'use strict';

import ammoModel from '../../models/wcbz/ammo'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class ammo extends BaseComponent{
	constructor(){
		super()
		this.addammo = this.addammo.bind(this);
		this.getammo = this.getammo.bind(this);
		this.getammoCount = this.getammoCount.bind(this);
		this.getammoDetail = this.getammoDetail.bind(this);
		this.updateammo = this.updateammo.bind(this);
		this.deleteammo = this.deleteammo.bind(this);
	}
	//添加人员
	async addammo(req, res, next){
        let ammo_id;
		try{
            ammo_id = await this.getId('ammo_id');
            console.log(ammo_id);
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
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newammo = {
                ammo_id,
				filed1: fields.filed1,
                filed2: fields.filed2,
                filed3: fields.filed3,
                filed4: fields.filed4,
                filed5: fields.filed5,
                filed6: fields.filed6,
                filed7: fields.filed7,
                create_time: dtime().format('YYYY-MM-DD HH:mm')
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const ammo = new ammoModel(newammo);
				await ammo.save();
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
	async getammo(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await ammoModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async getammoCount(req, res, next){
		try{
			const count = await ammoModel.count()
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
	async getammoDetail(req, res, next){
        console.log(req.params);
		const ammo_id = req.params.Ammo_id;
		if (!ammo_id || !Number(ammo_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const ammo = await ammoModel.findOne({ammo_id});
            console.log(ammo);
			res.send(ammo)
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
    async updateammo(req, res, next){
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
			const {filed1,filed2,filed3,filed4,filed5,filed6,filed7} = fields;
			try{
				let newData;
				newData = {filed1,filed2,filed3,filed4,filed5,filed6,filed7}
				await ammoModel.findOneAndUpdate({ammo_id}, {$set: newData});
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
    async deleteammo(req, res, next){
        console.log(req.params);
        const Ammo_id = req.params.Ammo_id;
        console.log(Ammo_id);
		if (!Ammo_id || !Number(Ammo_id)) {
			console.log('ammo_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ammo_id参数错误',
			})
			return
		}
		try{
			await ammoModel.findOneAndRemove({Ammo_id});
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

export default new ammo()