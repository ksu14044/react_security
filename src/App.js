import axios from "axios";
import { useQuery } from "react-query";
import { api } from "./api/config/axiosConfig";
import { healthCheckApi } from "./api/apis/healthCheckApi";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage/IndexPage";
import SigninPage from "./pages/SigninPage/SigninPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { Container } from "@mui/material";
import AuthRoute from "./routes/AuthRoute/AuthRoute";
import { userApi } from "./api/apis/userApi";
import { jwtDecode } from "jwt-decode";

function App() {

	const healthCheckQuery = useQuery(
		["healthCheckQuery"],
		healthCheckApi, 
		{
			refetchOnWindowFocus: false,
			enabled: true,
			cacheTime: 1000 * 60 * 10, //캐시 유지 시간(언마운트 이후)
			staleTime: 1000 * 60 * 10, //10분마다 최신의 캐시 상태 유지(refetch)
		}
	);

	if(!healthCheckQuery.isLoading) {
		console.log(healthCheckQuery.data.data.status)
	}

	const userQuery = useQuery(
		["userQuery"],
		async () => {
			const accessToken = localStorage.getItem("AccessToken");
			if( !accessToken ){
				 return;
			}
			const decodedJwt = jwtDecode(localStorage.getItem("AccessToken"));
			console.log(decodedJwt);
			return userApi(decodedJwt.userId);
		},
		{
			retry: 0,
			refetchOnWindowFocus: false,
		}

	);

  	return (
		<Container maxWidth="lg">
			<Routes>
				<Route path="/" element={<IndexPage />} />
				<Route path="/user/profile" element={<ProfilePage />} />
				<Route path="/auth/*" element={<AuthRoute />} />
				
			</Routes>
		</Container>
	);
}

export default App;
	