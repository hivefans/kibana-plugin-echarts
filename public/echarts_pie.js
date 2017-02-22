import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import echartsPieTemplate from 'plugins/kibana-plugin-echarts/echarts_pie.html';
import echartsPieParamsTemplate from 'plugins/kibana-plugin-echarts/echarts_pie_editor.html';
import 'plugins/kibana-plugin-echarts/EchartsPieController';


require('ui/registry/vis_types').register(echartsPieProvider);

function echartsPieProvider(Private) {
    const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
    const Schemas = Private(VisSchemasProvider);
  // we also need to load the controller and used by the template
  // require('plugins/kibana-plugin-echarts/echartsPieController');

    return new TemplateVisType({
      name: 'echarts_pie',
      title: 'Echarts Pie',
      icon: 'fa-pie-chart',
      description: '测试Echarts Pie',
      template: echartsPieTemplate,
      params: {
        defaults: {
          shareYAxis: true,
          addTooltip: true,
          addLegend: true,
          isDonut: false
        },
        editor: echartsPieParamsTemplate
      },
      responseConverter: false,
      hierarchicalData: true,
      schemas: new Schemas([{
        group: 'metrics',
        name: 'metric',
        title: 'Slice Size',
        min: 1,
        max: 1,
        aggFilter: ['sum', 'count', 'cardinality'],
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

export default echartsPieProvider;
