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
            text: 'CDN访问统计地图',
            x: 'center',
            textStyle: {
                fontSize: 14,
                olor:"#a6a6a6"
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
            text: ['最大值','最小值'], 
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


    //state.query
    
    var tableGroups;
    
    
    $scope.$watch('esResponse', function(resp) {
      if (!resp) {
        return;
      }
        var avgArr = new Array();
        option.series[0].data.length=0;
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
                        name:region_name,
                        value:avg_speed.toFixed(2)
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
