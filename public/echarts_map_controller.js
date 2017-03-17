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
  var speeds = new Array();
  let width;
  let height;

  var option = {
        title: {
            text: 'cdn访问质量',
            x: 'center',
            textStyle: {
                fontSize: 14
            }
        },
        visualMap: {
            min: 0,
            max: 1024,
            inRange: {
                color: ['#0ba800','#eac736','#d94e5d'].reverse()
            },
            left: 'left',
            top: 'bottom',
            text: ['最大速度(KB/s)','最小速度'], 
            calculable: true,
            textStyle:{
                color:"#a6a6a6"
            }
        },
        toolbox: {
            show: true,
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
            name: 'CDN日志',
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

    // 根据省份名获取相应的响应时间段
    var getTimesByRegion = function (data,region){
        for(var i = 0;i < data.length; i++){
            if( region == data[i].key ){
                return data[i].buckets.buckets;
            }
        }
    }



    //state.query
    
    var tableGroups;
    
    
    $scope.$watch('esResponse', function(resp) {
      if (!resp) {
        return;
      }
        var avgArr = new Array();
        // speeds = new Array();
        //  console.log("=========resp=========");
        //  console.log(resp);
        tableGroups = tabifyAggResponse($scope.vis, resp);
        // console.log(tableGroups);
        // console.log("=====option=====")
        //  console.log(option);
        tableGroups.tables.forEach(function (table,index) {
            var cols = table.columns;
            table.rows.forEach(function (row,i) {
                var region_name = row[0].toString();
                var avg_speed = row[1];
                avgArr.push(avg_speed);
                option.series[0].data.push(
                    {
                        name:convertProvince(region_name),
                        value:avg_speed.toFixed(2)
                    }
                )

            });
        });
        option.visualMap.max = Math.max.apply(Math, avgArr);
        mychart.setOption(option,true);
        width = $(rootElement).width() - margin.left - margin.right;
        height = $(rootElement).height() - margin.top - margin.bottom;
        mychart.resize({
            option,
            width,
            height
        });
      return  notify.timed('Echarts Bar Controller', resp);
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