'use strict';

import airplaneModel from '../../models/wcbz/airplane'
import airplaneAmmoModel from '../../models/wcbz/airplane_ammo'
import planModel from '../../models/wcbz/plan'
import ensureModel from '../../models/wcbz/ensure'
import vehicleModel from '../../models/wcbz/vehicle'
import personnelModel from '../../models/wcbz/personnel'
import BaseComponent from '../../prototype/baseComponent'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

class Situation extends BaseComponent{
	constructor(){
		super()
		this.getSituation = this.getSituation.bind(this);
		this.getAirplaneToPlan = this.getAirplaneToPlan.bind(this);
		this.getCarToEnsure = this.getCarToEnsure.bind(this);

    }
    distinct(a, b) {
        return Array.from(new Set([...a, ...b]))
    }
    toTimeStamp(time) {
        time = time.replace(/-/g, '/') // 把所有-转化成/
        let timestamp = new Date(time).getTime()
        return timestamp
    }
    // 查询人员条数
    async getSituation(req, res, next){
		try{
            var day2 = new Date();
            day2.setTime(day2.getTime());
            let day = '';
            day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
            let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
            const date = {
                dateTime: dayTime
            }
            let totalUpDown = 0;
            let totalFlight = 0;
            let totalPerson = 0;
            const count = await airplaneModel.count();
            const plan = await planModel.find(date);
            let totalAirplane = 0;
            if (plan.length) {
                plan[0].airData.forEach(element => {
                    totalAirplane = plan[0].airData.length;
                    totalUpDown += parseInt(element.upDownNumber);
                    totalFlight += parseInt(element.flightTime);
                });
            }
            const users = await airplaneModel.find();
            const ensure = await ensureModel.find();
            const vehicle = await vehicleModel.find();
            const personnel = await personnelModel.find();
            let vehicle_enter = 0;
            vehicle.forEach(element => {
                if (this.toTimeStamp(element.create_time) >= this.toTimeStamp(dayTime) && element.enter === '进场') {
                    vehicle_enter +=1;
                }
            });

            let ensure_task = 0;
            let ensure_car = 0;
            const car_enter = [];
            let ensure_ccc = [];
            let ensure_eee = [];
            ensure.forEach(element => {
                if (this.toTimeStamp(element.filed2) >= this.toTimeStamp(dayTime)) {
                    element.filed3.forEach(e => {
                        if (e.content === '飞行计划保障') {
                           e.plan.forEach(p => {
                                console.log("ppppp",p.airData.length);
                                ensure_task += p.airData.length;
                                p.airData.forEach(ppp => {
                                    ensure_ccc.push(ppp.airName);
                                });
                           });
                        }
                        e.car.forEach(ee => {
                            console.log(ee);
                            car_enter[ee.name] || (car_enter[ee.name] = []);
                            car_enter[ee.name].push(ee);
                        });
                        e.airplane.forEach(ss => {
                            ensure_task +=1;
                            console.log('sssssssss',ensure_task);
                            if (e.content !== '飞行计划保障') {
                                ensure_ccc.push(ss.code);
                                ensure_eee.push(ss.code);
                            }
                        })
                    });
                }
             });
             console.log("ensure_ccc",ensure_ccc);
             Object.keys(car_enter).forEach((key) => {
                ensure_car ++;
            });

            //  console.log("222222", car_enter.length);
            // console.log(users);
            // const enter = await this.getAirplaneToPlan();
            let totalN = 0;
            let nnnn = 0;
            let totalAirHour = 0;
            const array = [];
            let carToEnterToAir = 0;
            if (plan.length || ensure.length) {
                if (plan.length) {
                    totalN = plan[0].totalNumber;
                }
                users.forEach(element => {
                    if (!ensure_eee.includes(element.code) && this.toTimeStamp(element.create_time) >= this.toTimeStamp(dayTime) && element.enter === '进场') {
                        array.push(element);
                        console.log("element", element);
                        nnnn += parseInt(element.airUpOrDown);
                        totalAirHour += parseInt(element.airHour);
                    }
                    if (ensure_ccc.includes(element.code) && element.enter === '进场' ) {
                        carToEnterToAir ++;
                    }
                });
            }
            let pEnter = 0;
            personnel.forEach(element => {
                if (this.toTimeStamp(element.create_time) >= this.toTimeStamp(dayTime) && element.state === '进场') {
                    pEnter += 1;
                }
            });
            const data = {
                totalAirplane: totalAirplane,
                enterAirplane: array.length,
                totalUpDown: totalUpDown,
                doneUpdown: nnnn,
                enterPerson: totalN,
                donePerson: pEnter,
                totalCar: ensure_car, // 总保障车辆数
                totalTask: ensure_task,   // 改成总保障飞机数
                enterCar: vehicle_enter,  // 进场车辆数
                doneTask: carToEnterToAir, // 改成已进场飞机数
                totalFlyHour: totalFlight,
                doneFlyHour: totalAirHour
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
            const array = [];
            const plan = await planModel.find(date);
            const ensure = await ensureModel.find();
            console.log("ensure",ensure);
            ensure.forEach(element => {
                if (this.toTimeStamp(element.filed2) >= this.toTimeStamp(dayTime)) {
                    element.filed3.forEach(e => {
                        e.airplane.forEach(ee => {
                            array.push({
                                airplane_id: ee.airplane_id,
                                code: ee.code,
                                upDownNumber: ee.airUpOrDown,
                                approachTime: ee.approachTime,
                                name: `${ee.code}-保障任务`
                            })
                        });
                    });
                }
            });

            const users = await airplaneModel.find({})
            const ammo = await airplaneAmmoModel.find({})

            if (plan.length) {
                plan[0].airData.forEach((elements,index) => {
                    users.forEach(element => {
                        if (elements.airName === element.code) {
                            array.push({
                                airplane_id: element.airplane_id,
                                code: elements.airName,
                                upDownNumber: elements.upDownNumber,
                                approachTime: elements.approachTime,
                                name: `${elements.airName}-飞行计划`,
                                ammoData: elements.xd
                            })
                        }
                    });
                    // plan[0].airData[index].code = element.airName;
                });
            }
            // array.forEach(element => {
            //     let data = [];
            //     ammo.forEach(ammo => {
            //         // console.log(element.code);
            //         // console.log(ammo.air_code);
            //         if (element.code === ammo.air_code) {
            //             console.log(ammo);
            //             data.push(ammo);
            //         }
            //     });
            //     element.ammoData = data;
            // });
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
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
		try{
            const ensure = await ensureModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            const carArray = []
            ensure.forEach(element => {
                if (this.toTimeStamp(element.filed2) >= this.toTimeStamp(dayTime)) {
                    console.log(element);
                    element.filed3.forEach(e => {
                        e.car.forEach(ee => {
                            if(!carArray.includes(ee.name)){ // 如果bArr新数组包含当前循环item
                                carArray.push(ee.name);
                               }
                        });
                    });
                }
             });
             console.log("2222222", carArray);
             const newArray = [];
             const vehicle = await vehicleModel.find();
             vehicle.forEach(element => {
                carArray.forEach(type => {
                    if (element.name === type) {
                        newArray.push(element);
                    }
                });
             });
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
				data: newArray,
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
    async getPlanToToday(req, res, next){
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
			res.send({
				status: 1,
				data: plan,
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