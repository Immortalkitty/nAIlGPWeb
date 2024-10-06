import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import BaseLayout from './pages/BaseLayout';
import ErrorPage from "./pages/Error";
import HomeScreenPage from "./pages/HomeScreen";
import ProfilePage from "./pages/Profile";
import PredictionResultsPage from "./pages/PredictionResults";

const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout className="App"/>,
        errorElement: <ErrorPage/>,
        children: [
            {index: true, element: <HomeScreenPage/>},
            {
                path: 'profile',
                element: <ProfilePage/>,
            },
            {
                path: 'prediction',
                element: <PredictionResultsPage/>,
            },
        ],
    },
]);


function App() {

    return <RouterProvider router={router}/>;
}

export default App;
