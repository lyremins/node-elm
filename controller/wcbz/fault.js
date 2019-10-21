'use strict';

import faultModel from '../../models/wcbz/fault'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Fault extends BaseComponent{
	constructor(){
		super()
		this.addFault = this.addFault.bind(this);
	}
	//添加人员
	async addFault(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newFault = {
                user_name: fields.user_name,
                model: fields.model,
                airModel: fields.airModel,
                cj: fields.cj,
                date: fields.date,
                reason: fields.reason,
                pheno: fields.pheno,
                person: fields.person,
                method: fields.method,
                image_path: fields.image_path, // 故障照片
                type: fields.type, // 故障类型
                deviceName: fields.deviceName, // 故障件名称,
                desc: fields.desc, // 故障描述
                factory: fields.factory, // 厂家
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const fault = new faultModel(newFault);
				await fault.save();
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
	async getFault(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await faultModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async updateFault(req, res, next){
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
			const {
                user_name,
                model,
                airModel,
                cj,
                date,
                reason,
                pheno,
                person,
                method
            } = fields;
			try{
				let newData;
				newData = {
                    user_name,
                    model,
                    airModel,
                    cj,
                    date,
                    reason,
                    pheno,
                    person,
                    method
                }
				await faultModel.findOneAndUpdate({$set: newData});
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

export default new Fault()