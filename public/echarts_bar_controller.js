import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';

var module = require('ui/modules').get('kibana-plugin-echarts');

module.controller('EchartsBarController', function ($scope, $element, $rootScope, Private, Notifier) {
  let rootElement = $element;
  let margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };
  let width;
  let height;

  var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));
  var notify = new Notifier({ location: 'kibana-plugin-echarts/EchartsBarController'});
  let mychart = echarts.init($element.get(0));
  var fontFamilys = ['微软雅黑'];
  console.log(rootElement);
  var option = {
        title: {
            text: '访问时间占比',
            x: 'center',
            textStyle: {
                fontSize: 14
            }
        },
        tooltip: {
            // trigger: 'item',
            formatter: function(p) {
                // console.log(p)
                return p.value + '%';
            }
        },
        // toolbox: {
        //     show: true,
        //     orient: 'vertical',
        //     left: 'left',
        //     top: 'center',
        //     feature: {
        //         dataView: {readOnly: true},
        //         restore: {},
        //         saveAsImage: {}
        //     }
        // },
        legend: {
            left:'right',
            top:'top',
            orient:'vertical',
            data: new Array(),
            textStyle:{
                color:"#000000"
            }
        },
        xAxis: {
            type: 'category',
            data:["占比"],
            splitLine: {
                show: false
            },
            axisLabel: {
                interval: 0,
                show: true,
                textStyle: {
                    fontSize: 12
                }
            },
            axisLine: {
                lineStyle: {
                    color: "#000000"
                }
            },
            data: new Array()
        },
        yAxis: [
            {
                type: "category",
            },
            {
            type: "value",
            axisLabel:{formatter:'{value}%'},
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
        }],
        series: new Array()
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


    var colors = ['#008000', '#32CD32', '#F0E68C' ,'#F5DEB3','#e8d106','#FF7F50','#e88906','#e80606'];
    
    // var data=[],legendData=[];
    $scope.$watch('esResponse', function(resp) {
      if (!resp) {
        return;
      }
     
     //清理
     option.legend.data = new Array();
     option.series = new Array();
     option.xAxis.data = new Array();
    var tableGroups = tabifyAggResponse($scope.vis, resp);
    //  console.log(tableGroups);
    //  console.log("=====option=====")
    //  console.log(option);
    console.log($scope.vis.aggs);
     tableGroups.tables.forEach(function (table,index) {
        var cols = table.columns;
        if(!cols){
            return;
        }
        var data_length = cols[2].aggConfig.params.ranges.length;
        table.rows.forEach(function (row,i) {
            var region_name = row[0].toString();
            var total_count = row[1];
            // console.log(row[2]);
            var key = row[2]["gte"] + " - " + (row[2]["lt"] == "Infinity"?"":row[2]["lt"]);
            var value = row[3];
            if(i%data_length == 0 ){
                option.xAxis.data.push(convertProvince(region_name));
            }
            if(i < data_length ){
                option.series.push({
                        name: key,
                        type: "bar",
                        stack: "占比",
                        barMaxWidth: 55,
                        barGap: "10%",
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: colors[i%data_length],
                                label: {
                                    show: false,
                                    textStyle: {
                                        color: '#000'
                                    },
                                    position: "insideTop",
                                    formatter: function(p) {
                                        return p.value + '%';
                                    }
                                }
                            }
                        },
                        data:[(value/total_count*100).toFixed(2)]
                        
                    });
                //填充legend
                option.legend.data.push(key);
                // console.log("key:"+key);
            }else{
                option.series[i%data_length].data.push((value/total_count*100).toFixed(2));
            }

        });
      });
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