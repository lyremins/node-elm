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
            let totalFlight = 0;
            const count = await airplaneModel.count();
            const plan = await planModel.find(date);
            let totalAirplane = 0;
            console.log('6666666', plan);
            if (plan.length) {
                plan[0].airData.forEach(element => {
                    totalAirplane = plan[0].airData.length;
                    console.log("xxxxxx", element.upDownNumber);
                    totalUpDown += parseInt(element.upDownNumber);
                    totalFlight += parseInt(element.flightTime);
                });
            }
            const users = await airplaneModel.find();
            console.log(users);
            const array = [];
            let nnnn = 0;
            users.forEach(element => {
                if (this.toTimeStamp(element.create_time) > this.toTimeStamp(dayTime) && element.enter === '进场') {
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
                doneTask: 0,
                totalFlyHour: totalFlight,
                doneFlyHour: 0
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
            const plan = await planModel.find(date);

            // const users = await airplaneModel.find({})
            // console.log(users);
            const array = [];
            plan[0].airData.forEach((element,index) => {
                array.push({
                    code: element.airName,
                    upDownNumber: element.upDownNumber
                })
                // plan[0].airData[index].code = element.airName;
            });
            console.log(array);
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