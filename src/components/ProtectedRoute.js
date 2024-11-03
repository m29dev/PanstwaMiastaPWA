
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    // const navigate = useNavigate()

    const user = null; // Simulate an unauthenticated user
    return user ? <Outlet /> : <Navigate to="/auth" /> // Redirect to login if not authenticated
}

export default ProtectedRoutes
