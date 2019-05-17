
export const  isUrl = (str_url) =>{
    var notRegex = '(localhost'
        + '|'
        +'127.0.0.1)'
    var notre = new RegExp(notRegex);
    if (notre.test(str_url)){
        return false;
    }

    var strRegex = '^((https|http)?://)?'
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
        + '|' // 允许IP和DOMAIN（域名）
        + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
        + '[a-z]{2,6})' // first level domain- .com or .museum

        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/[a-zA-Z0-9\&%_\./-~-]*)?)'
    //        + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
    var re=new RegExp(strRegex);
    if (re.test(str_url)) {
        return true;
    } else {
        return false;
    }
}
/*
        *处理时间格式字符串，得到一个 yyyy-mm-dd HH：mm：ss 
        *param   : str    new Date (param) //UTC系统时间 2018-08-31T08:41:39.809Z
        
*/
Date.prototype.toMyStr = function() {
    // new Date(item.create_time).toMyStr()
    //utc 系统时间转成2018-09-09 21：09：09
    //参数是时间对象
    
    let month,date,hour,minute,second
    month = this.getMonth()+1
    date  = this.getDate()
    hour  = this.getHours()
    minute = this.getMinutes()
    second =this.getSeconds()
    if(this.getMonth()+1 < 10){
        month ='0'+month
    }
    if(this.getDate() < 10){
        date ='0'+date
    }
    if(this.getHours() < 10){
        hour ='0'+hour
    }
    if(this.getMinutes() < 10){
        minute ='0'+minute
    }
    if(this.getSeconds() < 10){
        second ='0'+second
    }
    
    return this.getFullYear()
       + '-' + month
       + '-' + date
       + ' ' + hour
       + ':' + minute
       + ':' + second;
};
/*
        *处理时间格式字符串，得到一个 yyyy-mm-dd 
        *param   : str    new Date (param) // UTC系统时间 2018-08-31T08:41:39.809Z
        
*/
Date.prototype.toMyTime = function() {
    
    let month,date
    month = this.getMonth()+1
    date  = this.getDate()
    
    if(this.getMonth()+1 < 10){
        month ='0'+month
    }
    if(this.getDate() < 10){
        date ='0'+date
    }
    
     
    
    return this.getFullYear()
       + '-' + month
       + '-' + date
       
};
/*
        *处理时间格式字符串，得到一个 yyyy-mm-dd HH:mm:ss
        *param   : str    new Date (param) // 时间戳
        
*/
Date.prototype.timeStamp = function(time){
    //time 是时间戳
    var date = new Date(time); //获取一个时间对象
    let str =''
    /**
     1. 下面是获取时间日期的方法，需要什么样的格式自己拼接起来就好了
    2. 更多好用的方法可以在这查到 -> http://www.w3school.com.cn/jsref/jsref_obj_date.asp
    */
    str+=date.getFullYear()
    + (date.getMonth()+1)
    +date.getDate();  
    +date.getHours();  
    +date.getMinutes();  
    +date.getSeconds(); 
    return str;

}

/*
        *处理时间格式字符串，得到一个Date
        *param   : str    yyyy-mm-dd
        * 结果为 yyyy 第  w 周
       
*/
export function  processStrToGetDate(str){
    str = str + " 00:00:00";
    str = str.replace(/-/g, ':').replace(' ', ':');
    str = str.split(':');
    var finalTime = new Date(str[0], (str[1] - 1), str[2], str[3], str[4], str[5]);
    return finalTime;
}

export function getWeekNumber(str) {
    var d = processStrToGetDate(str);
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    if (Number(weekNo)<10) {
        return d.getFullYear() + "第0" + weekNo + "周";
    } else {
        return d.getFullYear() + "第" + weekNo + "周";
    }
}
      
//utc 时间转成 时间戳  兼容 IE safari 
export function utc2beijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf("T");
    var Z_pos = utc_datetime.indexOf(".");
    var year_month_day = utc_datetime.substr(0, T_pos);
    var hour_minute_second = utc_datetime.substr(
        T_pos + 1,
        Z_pos - T_pos - 1
    );
    var new_datetime = year_month_day + " " + hour_minute_second;

    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp / 1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = (timestamp + 8 * 60 * 60) * 1000;

    
    return timestamp; // 2017-03-31 16:02:06
}
/*
        *处理时间格式字符串，得到一个 yyyy-mm-dd HH:mm:ss
        *param   : str    new Date (param) // 时间戳
        
*/
export function timeStamp1(time) {
    //time 是时间戳
    var date = new Date(time); //获取一个时间对象
    let str = "";
    let year, month, day, hour, minute, second
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()
    hour = date.getHours()
    minute = date.getMinutes()
    second = date.getSeconds()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    if (second < 10) {
        second = '0' + second
    }
    str += year + '-' + month + '-' + day + ' ' + hour + ":" + minute + ":" + second
    return str;
};

/**
 * this function is used to handle precision
 * @param number{Number}  : number is used to handle
 * @param precision {Number} 
*/
export function intercept(number,precision = 2){
    return number.toFixed(precision)
}

/**
 * this function is used to intercept string
 * @param str {String}  : str is used to handle
 * @param num {Number} : intercept length 
*/
export function interceptStr(str,num = 7){
    return str.subString(0,num)
}
/**
 * this function is used to deep clone 
 * return the deep clone object
 * @param obj {Object}
 */
export function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}  