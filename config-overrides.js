// const {injectBabelPlugin} =  require("react-app-rewired");
// const rewireLess = require("react-app-rewire-less");
//babel-import-plugin 按需加载
const {
    override,
    fixBabelImports,
    addLessLoader,
  } = require("customize-cra");
  module.exports = override(
    fixBabelImports("import", {
      libraryName: "antd", libraryDirectory: "es", style: true // change importing css to less
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#1DA57A" }
    })
  );
// module.exports = function(config,env){
//     // //像原来的webpack 配置的babel插件列表中增加一个插件，按需导入.babel-plugin-import
//     // injectBabelPlugin(['import',{libraryName:'antd',style:true}],config);
//     // //增加了对less的loader的支持
//     // config = rewireLess.withLoaderOptions({
//     //     modifyVars:{"@primary-color":"#1DA57A"}
//     // })(config,env);
//     return config;
// }