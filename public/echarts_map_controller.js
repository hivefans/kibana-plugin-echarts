import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';
import 'echarts/map/js/china';
// import 'public_function';

var module = require('ui/modules').get('kibana-plugin-echarts');

module.controller('EchartsMapController', function ($scope, $element, $rootScope, Private, Notifier) {
  var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));
  var notify = new Notifier({ location: 'kibana-plugin-echarts/EchartsMapController'});
  let mychart = echarts.init($element.get(0));
  let rootElement = $element;
  let margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };
  let width;
  let height;

  var option = {
        title: {
            text: '',
            x: 'center',
            textStyle: {
                fontSize: 14,
                color:"#a6a6a6"
            }
        },
        visualMap: {
            min: 0,
            max: 1024,
            inRange: {
                color: ['#0ba800','#eac736','#d94e5d']
            },
            left: 'left',
            top: 'bottom',
            text: ['高','低'], 
            calculable: true,
            textStyle:{
                color:"#a6a6a6"
            }
        },
        toolbox: {
            show: false,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        tooltip: {
            trigger: 'item'
        },
        series: [{
            name: '数据统计',
            type: 'map',
            mapType: 'china',
            // coordinateSystem: 'geo',
            roam: false,
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            data: new Array()
        }]
    };

    //state.query
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

    
    var tableGroups;   
    $scope.$watch('esResponse', function(resp) {
      if (!resp) {
        return;
      }
        var avgArr = new Array();
        option.series[0].data.length=0;
        tableGroups = tabifyAggResponse($scope.vis, resp);
        tableGroups.tables.forEach(function (table,index) {
            var cols = table.columns;
            table.rows.forEach(function (row,i) {
                var region_name = row[0].toString();
                var avg_speed = row[1];
                avg_speed=avg_speed.toFixed(2);
                avgArr.push(avg_speed);
                if(escape(region_name).indexOf("%u")<0) {
                    region_name = convertProvince(region_name);
                  }
                console.log("======"+region_name);
                option.series[0].data.push(
                    {
                        name:region_name,
                        value:avg_speed
                    }
                )
            });
        });
        mychart.clear();
        option.visualMap.max = Math.max.apply(Math, avgArr);
        mychart.setOption(option,true);
        width = $(rootElement).width() - margin.left - margin.right;
        height = $(rootElement).height() - margin.top - margin.bottom;
        mychart.resize({
            option,
            width,
            height
        });
      return  notify.timed('Echarts Map Controller', resp);
    });

    // Automatic resizing of graphics
	$scope.$watch(
		function () {
			width = $(rootElement).width() - margin.left - margin.right;
            height = $(rootElement).height() - margin.top - margin.bottom;
            mychart.resize({
                width,
                height
            });
		}, 
		true
	);
  });

