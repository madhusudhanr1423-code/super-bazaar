import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { PageSkeleton } from './components/PageSkeleton'
import './index.css'

const router = createRouter({
  routeTree,
  defaultPendingComponent: PageSkeleton,
  defaultPendingMs: 150,
  defaultPendingMinMs: 400,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)