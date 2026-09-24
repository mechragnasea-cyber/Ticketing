import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useMainStore } from './store'
import './assets/tailwind.css'

async function bootstrap() {
	const pinia = createPinia()
	const app = createApp(App)
	app.use(pinia)

	const store = useMainStore(pinia)
	await store.init()

	app.use(router)
	app.mount('#app')
}

bootstrap()
