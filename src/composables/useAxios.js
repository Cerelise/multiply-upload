import axios from 'axios'

function useAxios() {
	const instance = axios.create({
		timeout: 1000,
		baseURL: 'http://127.0.0.1:8000',
	})

	instance.interceptors.request.use(async (config) => {
		try {
			const response = await axios.get('/api/your-csrf-url/') // 发送 GET 请求获取 CSRF Token
			const csrfToken = response.data.csrftoken
			console.log('csrfToken :>> ', csrfToken)
			if (!config.headers) {
				config.headers = {} // 创建 headers 对象
			}
			config.headers['X-CSRFToken'] = csrfToken
		} catch (error) {
			console.error('Failed to get CSRF Token:', error)
		}
		return config
	})

	return instance // 返回 instance 对象
}

export default useAxios
