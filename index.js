export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: ['plugins/kibana-plugin-echarts/echarts_pie']
    }
  });
};
