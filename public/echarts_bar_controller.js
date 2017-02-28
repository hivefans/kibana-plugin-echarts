import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'public_function';

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
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'center',
            feature: {
                dataView: {readOnly: true},
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            left:'right',
            top:'top',
            orient:'vertical',
            data: new Array()
        },
        xAxis: {
            type: "category",
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
        yAxis: [{
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: "#000000"
                }
            },
        }, {
            type: "value",
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

    

    // 根据省份名获取相应的响应时间段
    var getTimesByRegion = function (data,region){
        for(var i = 0;i < data.length; i++){
            if( region == data[i].key ){
                return data[i].buckets.buckets;
            }
        }
    }


    var colors = ['#008000', '#32CD32', '#F0E68C' ,'#e8d106','#F5DEB3','#FF7F50','#e88906','#e80606'];
    
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
                                    show: true,
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
                console.log("key:"+key);
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
  });