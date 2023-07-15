export function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

export function formDate(data, format) {
    let time = {
        "M+": data.getMonth() + 1,
        "D+": data.getDate(),
        "H+": data.getHours(),
        "m+": data.getMinutes(),
        "s+": data.getSeconds(),
    };

    if (/(y+)/i.test(format)) {
        format = format.replace(
          RegExp.$1,
          (data.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }

    for (let k in time) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length === 1
                ? time[k]
                : ("00" + time[k]).substr(("" + time[k]).length)
            );
        }
    }
    return format;
}


/**
 * JavaScript 获取指定日期的前几天或者后几天的日期
 * @param date {string} 日期 如：2021-06-21
 * @param day {number} 天数 如：1 后几天|-1 前几天，默认后1天
 * @param format {string} 时间格式 如：2021-06-22，默认 -
 * @returns {string}
*/
export function getNextDate(date, day = 1, format = "{y}-{m}-{d}") {
    if (date) {
        const nDate = new Date(date);
        nDate.setDate(nDate.getDate() + day);

        const formatObj = {
            y: nDate.getFullYear(),
            m: nDate.getMonth() + 1,
            d: nDate.getDate(),
        };
        return format.replace(/{([ymd])+}/g, (result, key) => {
            const value = formatObj[key];
            return value.toString().padStart(2, "0");
        });
    } else {
        throw new Error("getNextDate:错误的参数");
    }
}
