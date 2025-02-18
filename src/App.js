import axios from "axios";
import { useQuery } from "react-query";
import { api } from "./api/config/axiosConfig";
import { healthCheckApi } from "./api/apis/healthCheckApi";
import { Link, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage/IndexPage";
import SigninPage from "./pages/SigninPage/SigninPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import AuthRoute from "./routes/AuthRoute/AuthRoute";
import { userApi } from "./api/apis/userApi";
import { jwtDecode } from "jwt-decode";
import UserRoute from "./routes/UserRoute/UserRoute";

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
			const decodedJwt = jwtDecode(accessToken);
			return await userApi(decodedJwt.userId);

		},
		{
			retry: 0,
			refetchOnWindowFocus: false,
		}

	);

  	return (
		<Container maxWidth="lg">
			
			{
				!userQuery.isLoading &&
				
				<>
				<Box display={'flex'} justifyContent={'space-between'} mt={3}>
					<Typography variant="h6">로고</Typography>
					<ButtonGroup variant="outlined" aria-label="Basic button group">
						{
							!!userQuery.data
							?
							<>
								<Link to={"/user/profile"}><Button>프로필</Button></Link>
								<Link to={"/user/logout"}><Button>로그아웃</Button></Link>
							</>
							:
							<>
								<Link to={"/auth/signin"}><Button>로그인</Button></Link>
								<Link to={"/auth/signup"}><Button>회원가입</Button></Link>
							</>
						}
							
					</ButtonGroup>
				</Box>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/user/*" element={<UserRoute />} />
					<Route path="/auth/*" element={<AuthRoute />} />
				</Routes>
				</>
			}
		</Container>
	);
}

export default App;
	