'use strict';

import airtateModel from '../../models/wcbz/airstate'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Airtate extends BaseComponent{
	constructor(){
		super()
		this.addAirtate = this.addAirtate.bind(this);
		this.getAirtate = this.getAirtate.bind(this);
		this.updateAirtate = this.updateAirtate.bind(this);
	}
	//添加人员
	async addAirtate(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newAirtate = {
				wh: fields.wh,
                dx: fields.dx,
                dj: fields.dj,
                pg: fields.pg,
                sf: fields.sf,
                dty: fields.dty,
                create_time: dtime().format('YYYY-MM-DD HH:mm')
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const airtate = new airtateModel(newAirtate);
				await airtate.save();
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
	async getAirtate(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await airtateModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取列表数据失败'
			})
		}
    }
    // 更新人员
    async updateAirtate(req, res, next){
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
            console.log(fields);
			const {wh,dx,dj,pg,sf,dty} = fields;
			try{
				let newData;
				newData = {wh,dx,dj,pg,sf,dty}
				await airtateModel.findOneAndUpdate({$set: newData});
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
}

export default new Airtate()