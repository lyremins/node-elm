'use strict';

import organizModel from '../../models/wcbz/organiz'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Organiz extends BaseComponent{
	constructor(){
		super()
		this.addOrganiz = this.addOrganiz.bind(this);
		this.getOrganiz = this.getOrganiz.bind(this);
		this.getOrganizCount = this.getOrganizCount.bind(this);
		this.getOrganizDetail = this.getOrganizDetail.bind(this);
		this.updateOrganiz = this.updateOrganiz.bind(this);
		this.deleteOrganiz = this.deleteOrganiz.bind(this);
	}
	//添加人员
	async addOrganiz(req, res, next){
        let organiz_id;
		try{
            organiz_id = await this.getId('organiz_id');
            console.log(organiz_id);
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
			const newOrganiz = {
                organiz_id, // 飞机ID
                organizName: fields.organizName,
                parentID: fields.parentID,
                level: fields.level
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const organiz = new organizModel(newOrganiz);
				await organiz.save();
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
	async getOrganiz(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
            const users = await organizModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async getOrganizCount(req, res, next){
		try{
            console.log('222');
			const count = await organizModel.count()
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
	async getOrganizDetail(req, res, next){
        console.log(req.params);
		const organiz_id = req.params.Organiz_id;
		if (!organiz_id || !Number(organiz_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const organiz = await organizModel.findOne({organiz_id});
			res.send(organiz)
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
    async updateOrganiz(req, res, next){
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
                organiz_id,
                organizName,
                parentID,
                level
            } = fields;
			try {
				let newData;
				newData = {
                    organiz_id,
                    organizName,
                    parentID,
                    level
                }
				await organizModel.findOneAndUpdate({organiz_id}, {$set: newData});
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
    async deleteOrganiz(req, res, next){
        console.log(req.params);
		const organiz_id = req.params.Organiz_id;
		if (!organiz_id || !Number(organiz_id)) {
			console.log('organiz_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'organiz_id参数错误',
			})
			return
		}
		try{
			await organizModel.findOneAndRemove({organiz_id});
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

export default new Organiz()