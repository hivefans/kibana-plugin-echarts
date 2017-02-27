import 'plugins/kibana-plugin-echarts/kibana-plugin-echarts.less';
import 'plugins/kibana-plugin-echarts/echarts_map_controller';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import echartsMapTemplate from 'plugins/kibana-plugin-echarts/echarts_map.html';
import echartsMapParamsTemplate from 'plugins/kibana-plugin-echarts/echarts_map_editor.html';


// require('ui/registry/vis_types').register(echartsPieProvider);

function echartsMapProvider(Private) {
    const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
    const Schemas = Private(VisSchemasProvider);
  // we also need to load the controller and used by the template
  // require('plugins/kibana-plugin-echarts/echartsPieController');

    return new TemplateVisType({
      name: 'echarts_map',
      title: 'Echarts Map',
      icon: 'fa-leaf',
      description: '各省份下载速度分部',
      template: echartsMapTemplate,
      params: {
        defaults: {
          shareYAxis: true,
          addTooltip: true,
          addLegend: true,
          isDonut: false
        },
        editor: echartsMapParamsTemplate
      },
      legendPositions: [{
        value: 'left',
        text: 'left',
      }, {
        value: 'right',
        text: 'right',
      }, {
        value: 'top',
        text: 'top',
      }, {
        value: 'bottom',
        text: 'bottom',
      }],
      responseConverter: false,
      hierarchicalData: true,
      schemas: new Schemas([{
        group: 'metrics',
        name: 'metric',
        title: 'Y-Axis',
        min: 1,
        max: 1,
        aggFilter: '!geohash_grid',
        defaults: [{
          schema: 'metric',
          type: 'count'
        }]
      }, {
        group: 'buckets',
        name: 'segment',
        icon: 'fa fa-scissors',
        title: 'X-Axis',
        min: 1,
        max: 2,
        aggFilter: '!geohash_grid'
      }])
    });
};

export default echartsMapProvider;
