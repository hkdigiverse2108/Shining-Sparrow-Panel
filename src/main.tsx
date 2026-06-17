import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/reset.css'
import App from './App.tsx'
import { App as AntApp } from "antd";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Store from './Store/Store.ts'
import { Provider } from 'react-redux'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
      <Provider store={Store}>
        <AntApp>
          <App />
        </AntApp>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
