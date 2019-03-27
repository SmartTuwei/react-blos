### 搭建一个react-andt项目

##1.创建项目
```js
    yarn add create-react-app -g 
    create-react-app myreact
    cd myreact
```
##2.安装andt组件

```js
    yarn add andt
```

##3.配置react-app-rewired(webpack扩展文件)
- 安装 yarn add react-app-rewired  customize-cra --dev
- 安装css预处理插件 yarn add less loader-less;
- 修改package.json文件下的启动配置
- 在文件根目录创建一个config.overrides.js文件
>config.overrides.js
```js
const {
    override,
    fixBabelImports,
    addLessLoader,
  } = require("customize-cra");
//添加配置插件
  module.exports = override(
    //像原来的插件中加入 按需加载模块(动态导入的插件)
    fixBabelImports("import", {
      libraryName: "antd", libraryDirectory: "es", style: true // change importing css to less
    }),
    //加入less处理loader
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#1DA57A" }
    })
  );
```
```js
"start": "react-app-rewired start",
"build": "react-app-rewired build",
"test": "react-app-rewired test",
"eject": "react-app-rewired eject"
```


