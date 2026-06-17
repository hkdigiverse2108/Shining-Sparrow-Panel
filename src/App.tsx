import { RouterProvider } from 'react-router-dom';
import { Router } from "@/Routers";
import { FloatingChat } from '@/Components/Common/ChatBox';

function App() {
  return (
    <>
      <RouterProvider router={Router} />
      <FloatingChat />
    </>
  )
}

export default App
