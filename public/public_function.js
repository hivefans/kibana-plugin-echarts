var provinces = [
        { name: "anhui", value: "安徽" },
        { name: "beijing", value: "北京" },
        { name: "fujian", value: "福建" },
        { name: "gansu", value: "甘肃" },
        { name: "guangdong", value: "广东" },
        { name: "guangxi", value: "广西" },
        { name: "guizhou", value: "贵州" },
        { name: "hainan", value: "海南" },
        { name: "hebei", value: "河北" },
        { name: "henan", value: "河南" },
        { name: "hubei", value: "湖北" },
        { name: "hunan", value: "湖南" },
        { name: "jilin", value: "吉林" },
        { name: "jiangsu", value: "江苏" },
        { name: "jiangxi", value: "江西" },
        { name: "liaoning", value: "辽宁" },
        { name: "ningxia", value: "宁夏" },
        { name: "qinghai", value: "青海" },
        { name: "shandong", value: "山东" },
        { name: "sanxi", value: "山西" },
        { name: "shanxi", value: "陕西" },
        { name: "shanghai", value: "上海" },
        { name: "sichuan", value: "四川" },
        { name: "tianjin", value: "天津" },
        { name: "xizang", value: "西藏" },
        { name: "xinjiang", value: "新疆" },
        { name: "yunnan", value: "云南" },
        { name: "zhejiang", value: "浙江" },
        { name: "chongqing", value: "重庆" },
        { name: "aomen", value: "澳门" },
        { name: "xianggang", value: "香港" },
        { name: "taiwan", value: "台湾" },
        { name: "heilongjiang", value: "黑龙江" },
        { name: "neimenggu", value: "内蒙古" }
    ]

    // 转化省份到汉字
    var convertProvince = function (data) {
        for (var i = 0; i < provinces.length; i++) {
            if (provinces[i].name == data) {
                return provinces[i].value;
            }
        }
        // console.log(data)
        return "other";
    }