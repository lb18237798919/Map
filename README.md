# Map

## 初始化项目

```javascript
npm install 引入依赖包
npm run serve 开发
npm run build 打包
```
## 页面布局方式：采用rem布局方式

```javascript
在vue中使用rem布局
首先安装amfe-flexible插件，在main.js里引入

1、npm i amfe-flexible

2、import 'amfe-flexible'
然后再，安装postcss-px2rem插件

npm i postcss-px2rem
在package.json中配置

"postcss": {
    "plugins": {
      "autoprefixer": {},
      "postcss-px2rem": {
        "remUnit": 192 //基准值 设计图为1920px，分为10份
      }
    }
  }
说明，我这里用的是vue-cli3.0脚手架。在.vue文件里，样式直接写px单位就可以了。在浏览器查看时会自动转换为rem单位。如果字体还想用px，那就这样将px大写，就不会编译为rem单位了。
```

## 接口

jsonp的接口，在封装一个jsonp的函数

```javascript
//封装一个获取jsonp接口方法
export function jsonp({
	url,
	params = {},
	success
}) {
	// 根据时间戳生成一个callback名
	let callbackName = 'jsonp_callback_' + Date.now() + Math.random().toString().substr(2, 5);
    // 创建script
	let script = document.createElement('script');
	let baseUrl = `${url}?callback=${callbackName}`;

	// 取出params对象属性并得到完整url
	for (let item in params) {
		baseUrl += `&${item}=${params[item]}`;
	}
	// jsonp核心，通过script的跨域特性发出请求
	script.src = baseUrl;
	// 把创建的script挂载到DOM
	document.body.appendChild(script);

	// 给window添加属性，用于获取jsonp结果
	window[callbackName] = (res) => {
		// 执行success回调
		success(res);
		// 删除window下属性
		delete window[callbackName];
		// 得到结果后删除创建的script
		document.body.removeChild(script);
	}

}
```

```javascript
通过腾讯提供的疫情接口获取数据并转换为json格式
https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign 接口返回海外疫情数据
jsonp({
			url: 'https://view.inews.qq.com/g2/getOnsInfo',
			params: {
				name: 'disease_foreign',
			},
			success(res) {
				let foreinData;
				foreinData = JSON.parse(res.data);
				// console.log(foreinData);

            }
})

下列为控制台中返回的数据
Object
continentStatis: (32) […]   //每周生成各个大洲的现存确诊人数
countryAddConfirmRankList: (10) […] //新增确诊人数前10的国家及增加人数
countryConfirmWeekCompareRankList: (10) […] //未使用此数据
foreignList: (161) […] //国家列表及确诊，治愈，死亡，现存人数数据
globalDailyHistory: (229) […] //每日全球总数据
globalStatis: {…} //截止今日的全球数据
importStatis: {TopList: Array(10)} //境外引入各省的前10
__proto__: Object
根据各个列表获取并处理数据传给echarts，为生成图表做准备
```

```java
https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5 接口返回国内疫情数据
Object
areaTree: [{…}]
chinaAdd: {confirm: 39, heal: 12, dead: 0, nowConfirm: 27, suspect: -1, …}
chinaTotal: {confirm: 90879, heal: 85722, dead: 4744, nowConfirm: 413, suspect: 1, …}
isShowAdd: true
lastUpdateTime: "2020-09-21 14:50:42"
showAddSwitch: {all: true, confirm: true, suspect: true, dead: true, heal: true, …}
__proto__: Object
暂时只使用到了累计确诊人数和现存确诊人数，用以绘制世界疫情地图
```

## 异步获取数据并export

对于异步获取到的数据，不能直接export，因为会在数据还没获取的时候，就export出去一个undefined值。

解决方案：export出来一个函数，函数里面返回一个promise值，将要返回的数据通过resolve返回出去。

## 获取和传输数据的流程

1.在charts.js中，通过封装的jsonp函数异步请求到数据，通过调用options.js里面的函数，将请求到的数据进行处理，形成echarts图表要用到的option。

2.charts.js export返回值为promise的函数，该promise在成功后，会把上面形成的option都存到res中，在App.vue中调用chart.js 的函数，获取到所有的图标配置信息，通过props发送给所需要的组件。

3.由于上面获取数据的方式是异步的。在App.vue组件给子组件传递option信息时，值还是空的，所以子组件里面通过watch监听option，当option有值的时候，就可以渲染echart图表了。

通过上述方式，减少了对数据的请求次数。

## vue组件化开发

1.将整个页面分为头部和主体页面  头部页面中含有一个显示当前时间的组件

2.主体页面分为左中右三个部分

左侧放入三个图表组件，右侧放入三个图表组件。

中间部分分为上下两个部分，上面是全球总数据的显示组件，下面的组件完成世界地图的可视化。

3.通过组件化的开发，使整个页面的结构非常清晰，并且便于复用和维护。

