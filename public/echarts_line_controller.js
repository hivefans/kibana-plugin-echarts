import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';

var module = require('ui/modules').get('kibana-plugin-echarts');

module.controller('EchartsLineController', function ($scope, $element, $rootScope, Private, Notifier) {
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
  var notify = new Notifier({ location: 'kibana-plugin-echarts/EchartsLineController'});
  let mychart = echarts.init($element.get(0));
  var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
        },
        legend: {
            left: 'right',
            data:["dm"]
        },
        series: [
            {
                name:'线形图',
                type:'line',
                data:[{name:"dm",value:123}]
            }
        ],
        xAxis: {
            type: 'category',
            splitLine: {show: false},
            data: ['一', '二', '三', '四', '五', '六', '七', '八', '九']
        },
        yAxis: {
            type: 'log'
        }
    };
    var data=[],legendData=[],xdata = [];
    $scope.$watch('esResponse', function(resp) {
      if (!resp) {
        return;
      }
     
      console.log("--------------resp---------------------");
      console.log(resp);
      var tableGroups = tabifyAggResponse($scope.vis, resp);
      console.log(tableGroups)
      console.log("--------------mychart---------------------");
     
      tableGroups.tables.forEach(function (table,index) {
        var cols = table.columns;
        data= [], legendData=[] ,xdata = []; 
        table.rows.forEach(function (row,i) {

          console.log(row[0])
          console.log(row[0].toString())
          console.log(row[1])
            var item = {};
            var name = row[0].toString()
            item.name = name;//cols[i].aggConfig.params.field.displayName;
            item.value = row[1];
            data.push(item);
            legendData.push(name);
        });
        option.series[index].data = data;
      });

      option.legend.data=legendData;

      mychart.setOption(option,true);
      
      width = $(rootElement).width() - margin.left - margin.right;
      height = $(rootElement).height() - margin.top - margin.bottom;
      console.log("width:"+width);
      console.log("height:"+height);
      mychart.resize({
          option,
          width,
          height
      })
      return  notify.timed('Echarts Line Controller', resp);
    });
  });