module.exports = {
	publicPath: './',
	chainWebpack: config => {
		// 用cdn方式引入
		config.externals({
			"echarts": "echarts",
		})
	},

	configureWebpack: {
		resolve: {
			alias: {
				'assets': '@/assets',
				'common': '@/common',
				'components': '@/components',
				'network': '@/network',
				'views': '@/views',
				'commonfun': '@/commonfun'
			}//设置别名
		}
	},

	devServer: {
		open: true,
		port: 8080
	}//自动打开8080端口
}
