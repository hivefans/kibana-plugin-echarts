import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';
import 'echarts/map/js/china';
import 'public_function';

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
            calculable: true
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
            data: speeds
        }]
    };

    

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
    var avgArr = new Array();
    // var data=[],legendData=[];
    console.log($scope);
    $scope.state.query = "geoip.country_code2:CN AND -type:cdnlog AND verb:GET AND ( response:206 OR response:200)";
    
    $scope.$watch('esResponse', function(resp) {
      if (!resp) {
        return;
      }
     
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
            speeds.push(
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
  });