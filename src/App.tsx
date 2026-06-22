import { RouterProvider } from 'react-router-dom';
import { Router } from "@/Routers";

function App() {
  return (
    <>
      <RouterProvider router={Router} />
    </>
  )
}

export default App
