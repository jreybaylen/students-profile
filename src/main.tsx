import React from 'react'
import ReactDOM from 'react-dom/client'

import '@config/axios.config'
import '@styles/global.prod.css'

import { AppRoutes } from '@routes/Routes'

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<React.StrictMode>
		<AppRoutes />
	</React.StrictMode>
)
