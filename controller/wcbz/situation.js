'use strict';

import airplaneModel from '../../models/wcbz/airplane'
import planModel from '../../models/wcbz/plan'
import BaseComponent from '../../prototype/baseComponent'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

class Situation extends BaseComponent{
	constructor(){
		super()
		this.getSituation = this.getSituation.bind(this);
		this.getAirplaneToPlan = this.getAirplaneToPlan.bind(this);
		this.getCarToEnsure = this.getCarToEnsure.bind(this);

    }
    toTimeStamp(time) {
        time = time.replace(/-/g, '/') // 把所有-转化成/
        let timestamp = new Date(time).getTime()
        return timestamp
    }
    // 查询人员条数
    async getSituation(req, res, next){
		try{
            console.log('222');
            var day2 = new Date();
            day2.setTime(day2.getTime());
            let day = '';
            day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
            let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
            console.log(dayTime);
            const date = {
                dateTime: dayTime
            }
            console.log(date);
            let totalUpDown = 0;
            const count = await airplaneModel.count();
            const plan = await planModel.find(date);
            let totalAirplane = 0;
            console.log('6666666', plan);
            if (plan.length) {
                plan[0].airData.forEach(element => {
                    totalAirplane = plan[0].airData.length;
                    console.log("xxxxxx", element.upDownNumber);
                    totalUpDown += parseInt(element.upDownNumber);
                });
            }
            const users = await airplaneModel.find();
            console.log(users);
            const array = [];
            let nnnn = 0;
            users.forEach(element => {
                if (this.toTimeStamp(element.create_time) > this.toTimeStamp(dayTime)) {
                    array.push(element);
                    nnnn += parseInt(element.airUpOrDown);
                }
            });
            console.log(users);
            // const enter = await this.getAirplaneToPlan();
            const data = {
                totalAirplane: totalAirplane,
                enterAirplane: array.length,
                totalUpDown: totalUpDown,
                doneUpdown: nnnn,
                enterPerson: 0,
                donePerson: 0,
                totalCar: 0,
                totalTask: 0,
                enterCar: 0,
                doneTask: 0
            }
			res.send({
				status: 1,
				data,
			})
		}catch(err){
			console.log('获取态势失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取态势失败'
			})
		}
    }
    async getAirplaneToPlan(req, res, next){
        const {limit = 1000, offset = 0} = req.query;
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
        const date = {
            dateTime: dayTime
        }
		try{
            const users = await airplaneModel.find({})
            console.log(users);
            const array = [];
            users.forEach(element => {
                if (this.toTimeStamp(element.create_time) > this.toTimeStamp(dayTime)) {
                    array.push(element);
                }
            });
            const data =  [{
                "airplane_id": 16,
                "type": "测试11111",
                "model": "运输机",
                "code": "A3",
                "army_id": "03",
                "factory": "某制造厂",
                "date": "2019-10-31",
                "unit": "机务一分队",
                "airUpOrDown": "1",
                "yairUpOrDown": "2",
                "airHour": "6",
                "yairHour": "2",
                "stageUpOrDown": "2",
                "engine_1": "2",
                "engine_2": "1",
                "create_time": "2019-11-01 08:49",
                "stageUpOrDownTime": "2",
                "repairNumber": "3",
                "repairFactory": "某修理厂",
                "state": "完好",
                "task": "飞行后",
                "image_path": "",
                "upDownNumber": 20,
                "__v": 0,
                "enter": "进场"
            },{
                "airplane_id": 17,
                "type": "测试2222",
                "model": "运输机",
                "code": "A4",
                "army_id": "03",
                "factory": "某制造厂",
                "date": "2019-10-31",
                "unit": "机务一分队",
                "airUpOrDown": "1",
                "yairUpOrDown": "2",
                "airHour": "6",
                "yairHour": "2",
                "stageUpOrDown": "2",
                "engine_1": "2",
                "engine_2": "1",
                "create_time": "2019-11-01 08:49",
                "stageUpOrDownTime": "2",
                "repairNumber": "3",
                "repairFactory": "某修理厂",
                "state": "完好",
                "task": "飞行后",
                "image_path": "",
                "upDownNumber": 12,
                "__v": 0,
                "enter": "进场"
            }]
			res.send({
				status: 1,
				data: array,
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
    async getCarToEnsure(req, res, next){
		const {limit = 1000, offset = 0} = req.query;
		try{
            const users = await airplaneModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            console.log(users);
            const data =  [{
                "vehicle_id": 1,
                "model": "冷气车",
                "name": "冷气车A",
                "organiz": "一中队",
                "service": "A1",
                "armyId": "FXYL-01",
                "product": "某制造厂",
                "productTime": "43739",
                "life": "10年",
                "stageCourse": "1万公里",
                "repairNumber": "1",
                "taskState": "进场",
                "state": "测试",
                "mileage": "1万公里",
                "enter": "进场",
                "__v": 0
            }]
			res.send({
				status: 1,
				data: data,
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
}

export default new Situation()