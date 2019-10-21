'use strict';

import subjectModel from '../../models/wcbz/subject'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Subject extends BaseComponent{
	constructor(){
		super()
		this.addSubject = this.addSubject.bind(this);
		this.getSubject = this.getSubject.bind(this);
		this.getSubjectCount = this.getSubjectCount.bind(this);
		this.getSubjectDetail = this.getSubjectDetail.bind(this);
		this.updateSubject = this.updateSubject.bind(this);
		this.deleteSubject = this.deleteSubject.bind(this);
	}
	//添加人员
	async addSubject(req, res, next){
        let subject_id;
		try{
            subject_id = await this.getId('subject_id');
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
			const newSubject = {
                subject_id, // 飞机ID
                name: fields.name
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const subject = new subjectModel(newSubject);
				await subject.save();
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
	async getSubject(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
            const users = await subjectModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async getSubjectCount(req, res, next){
		try{
            console.log('222');
			const count = await subjectModel.count()
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
	async getSubjectDetail(req, res, next){
        console.log(req.params);
		const subject_id = req.params.Subject_id;
		if (!subject_id || !Number(subject_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const subject = await subjectModel.findOne({subject_id});
			res.send(subject)
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
    async updateSubject(req, res, next){
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
                subject_id,
                name
            } = fields;
			try {
				let newData;
				newData = {
                    name
                }
				await subjectModel.findOneAndUpdate({subject_id}, {$set: newData});
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
    async deleteSubject(req, res, next){
        console.log(req.params);
		const subject_id = req.params.Subject_id;
		if (!subject_id || !Number(subject_id)) {
			console.log('subject_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'subject_id参数错误',
			})
			return
		}
		try{
			await subjectModel.findOneAndRemove({subject_id});
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

export default new Subject()