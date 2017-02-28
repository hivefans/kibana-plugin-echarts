var provinces = [
        { name: "Anhui", value: "安徽" },
        { name: "Beijing", value: "北京" },
        { name: "Fujian", value: "福建" },
        { name: "Gansu", value: "甘肃" },
        { name: "Guangdong", value: "广东" },
        { name: "Guangxi Zhuang Autonomous Region", value: "广西" },
        { name: "Guizhou", value: "贵州" },
        { name: "Hainan", value: "海南" },
        { name: "Hebei", value: "河北" },
        { name: "Henan", value: "河南" },
        { name: "Hubei", value: "湖北" },
        { name: "Hunan", value: "湖南" },
        { name: "Jilin", value: "吉林" },
        { name: "Jiangsu", value: "江苏" },
        { name: "Jiangxi", value: "江西" },
        { name: "Liaoning", value: "辽宁" },
        { name: "Ningsia Hui Autonomous Region", value: "宁夏" },
        { name: "Qinghai", value: "青海" },
        { name: "Shandong", value: "山东" },
        { name: "Shanxi", value: "山西" },
        { name: "Shaanxi", value: "陕西" },
        { name: "Shanghai", value: "上海" },
        { name: "Sichuan", value: "四川" },
        { name: "Tianjin", value: "天津" },
        { name: "Tibet Autonomous Region", value: "西藏" },
        { name: "Xinjiang Uyghur Autonomous Region", value: "新疆" },
        { name: "Yunnan", value: "云南" },
        { name: "Zhejiang", value: "浙江" },
        { name: "Chongqing", value: "重庆" },
        { name: "Macao", value: "澳门" },
        { name: "HongKong", value: "香港" },
        { name: "Hong Kong", value: "香港" },
        { name: "Taiwan", value: "台湾" },
        { name: "Heilongjiang", value: "黑龙江" },
        { name: "Inner Mongolia Autonomous Region", value: "内蒙古" }
    ]

    // 转化省份到汉字
    var convertProvince = function (data) {
        for (var i = 0; i < provinces.length; i++) {
            if (provinces[i].name == data) {
                return provinces[i].value;
            }
        }
        // console.log(data)
        return "dropit";
    }