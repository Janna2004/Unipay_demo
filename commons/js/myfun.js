/* 
	工具函数
		1.时间函数处理
 */

export default {
	// 首页时间处理
	dataTime(d) {
		let old = new Date(d)
		let now = new Date()
		// 获取old时间
		// let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getFullYear()
		let M = old.getMonth()+1
		let D = old.getDate()
		// 获取now时间
		let nd = now.getTime()
		let nh = now.getHours()
		let n = now.getMinutes()
		let nY = now.getFullYear()
		let nM = now.getMonth()+1
		let nD = now.getDate()
		
		// 消息是当天，则显示:小时+分钟
		if (D===nD && M===nM && Y===nY) {
			if(h<10) h='0'+h
			if(m<10) m='0'+m
			return h+':'+m
		}
		// 消息是昨天
		if (D+1===nD && M===nM && Y===nY) {
			if(h<10) h='0'+h
			if(m<10) m='0'+m
			return '昨天 '+h+':'+m
		} else {
			// 消息大于两天
			return Y+'/'+M+'/'+D
		}

	},
	
	// 详细时间
	detialTime(d) {
		let old = new Date(d)
		let now = new Date()
		// 获取old时间
		// let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getFullYear()
		let M = old.getMonth()+1
		let D = old.getDate()
		
		// 处理时间
		if (M<10) M = '0' + M
		if (D<10) D='0' + D
		if(h<10) h='0'+h
		if(m<10) m='0'+m
		
		return Y+'-'+M+'-'+D+' '+h+':'+m
	},

	// 聊天时间
	dataTime1(d) {
		let old = new Date(d)
		let now = new Date()
		// 获取old时间
		// let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getFullYear()
		let M = old.getMonth()+1
		let D = old.getDate()
		// 获取now时间
		let nd = now.getTime()
		let nh = now.getHours()
		let n = now.getMinutes()
		let nY = now.getFullYear()
		let nM = now.getMonth()+1
		let nD = now.getDate()
		
		// 消息是当天，则显示:小时+分钟
		if (D===nD && M===nM && Y===nY) {
			if(h<10) h='0'+h
			if(m<10) m='0'+m
			return h+':'+m
		}
		
		// 消息是昨天
		if (D+1===nD && M===nM && Y===nY) {
			if(h<10) h='0'+h
			if(m<10) m='0'+m
			return '昨天 '+h+':'+m
		} else if(Y===nY) {
			// 今年
			if(h<10) h='0'+h
			if(m<10) m='0'+m 
			return M+'月'+D+'日 '+h+':'+m
		} else {
			// 消息大于今年
			if(h<10) h='0'+h
			if(m<10) m='0'+m
			return Y+'年'+M+'月'+D+'日 '+h+':'+m
		}
	
	},
	
	// 每天建的文件夹名称
	fileName(e) {
		let old = new Date(e)
		// 获取old时间
		let Y = old.getFullYear()
		let M = old.getMonth()+1
		let D = old.getDate()
		
		// 处理时间
		if (M<10) M = '0' + M
		if (D<10) D='0' + D
		
		return Y+M+D
	},
	
	// 间隔时间差
	spacTime(old, now){
		old = new Date(old)
		now = new Date(now)
		var told = old.getTime()
		var tnow = now.getTime()
		if(tnow > (told+1000*60*5)) {
			return now
		} else {
			return ''
		}
		
	},
	
	/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
	debounce(fn, t) {
    let delay = t || 500;
    let timer;
    // console.log(fn)
    // console.log(typeof fn)
    return function () {
        let args = arguments;
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
	},
/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
  Throttle(fn, t){
    let last;
    let timer;
    let interval = t || 500;
    return function () {
        let args = arguments;
        let now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    }
	},
		
	// 数组排序
	mySort(arr, obj, tip){
		var s
		if(tip === 0){
			// 降序排列
			for(let i=1; i<arr.length; i++){
				for(let j=i; j>0; j--){
					if(arr[j][obj] > arr[j-1][obj]){
						s=arr[j]
						arr[j] = arr[j-1]
						arr[j-1] = s
					}
				}
			}
			return arr
		}
		else if(tip === 1){
			// 升序排列
			for(let i=1; i<arr.length; i++){
				for(let j=i; j>0; j--){
					if(arr[j][obj] < arr[j-1][obj]){
						s=arr[j]
						arr[j] = arr[j-1]
						arr[j-1] = s
					}
				}
			}
			return arr
		}
		
		
	}
}



