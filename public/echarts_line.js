import 'plugins/kibana-plugin-echarts/kibana-plugin-echarts.less';
import 'plugins/kibana-plugin-echarts/echarts_line_controller';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import echartsLineTemplate from 'plugins/kibana-plugin-echarts/echarts_line.html';
import echartsLineParamsTemplate from 'plugins/kibana-plugin-echarts/echarts_line_editor.html';


// require('ui/registry/vis_types').register(echartsPieProvider);

function echartsLineProvider(Private) {
    const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
    const Schemas = Private(VisSchemasProvider);
  // we also need to load the controller and used by the template
  // require('plugins/kibana-plugin-echarts/echartsPieController');

    return new TemplateVisType({
      name: 'echarts_line',
      title: 'Echarts Line',
      icon: 'fa-calculator',
      description: '测试Echarts Line',
      template: echartsLineTemplate,
      params: {
        defaults: {
          shareYAxis: true,
          addTooltip: true,
          addLegend: true
        },
        editor: echartsLineParamsTemplate
      },
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
        title: 'Split Slices',
        min: 0,
        max: Infinity,
        aggFilter: '!geohash_grid'
      }, {
        group: 'buckets',
        name: 'split',
        icon: 'fa fa-th',
        title: 'Split Chart',
        mustBeFirst: true,
        min: 0,
        max: 1,
        aggFilter: '!geohash_grid'
      }])
    });
};

export default echartsLineProvider;
