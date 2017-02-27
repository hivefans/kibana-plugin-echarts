import 'plugins/kibana-plugin-echarts/kibana-plugin-echarts.less';
import 'plugins/kibana-plugin-echarts/echarts_bar_controller';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import echartsBarTemplate from 'plugins/kibana-plugin-echarts/echarts_bar.html';
import echartsBarParamsTemplate from 'plugins/kibana-plugin-echarts/echarts_bar_editor.html';


// require('ui/registry/vis_types').register(echartsPieProvider);

function echartsBarProvider(Private) {
    const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
    const Schemas = Private(VisSchemasProvider);
  // we also need to load the controller and used by the template
  // require('plugins/kibana-plugin-echarts/echartsPieController');

    return new TemplateVisType({
      name: 'echarts_bar',
      title: 'Echarts Bar',
      icon: 'fa-bar-chart',
      description: '各省份访问时间占比',
      template: echartsBarTemplate,
      params: {
        defaults: {
          shareYAxis: true,
          addTooltip: true,
          addLegend: true,
          isDonut: false
        },
        editor: echartsBarParamsTemplate
      },
      responseConverter: false,
      hierarchicalData: true,
      implementsRenderComplete: true,
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

export default echartsBarProvider;
