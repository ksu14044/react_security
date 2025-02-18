
import { healthCheckApi } from "./api/apis/healthCheckApi";
import { Link, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage/IndexPage";
import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import AuthRoute from "./routes/AuthRoute/AuthRoute";
import { userApi } from "./api/apis/userApi";
import { jwtDecode } from "jwt-decode";
import UserRoute from "./routes/UserRoute/UserRoute";
import { useQuery } from "@tanstack/react-query";

function App() {

	const healthCheckQuery = useQuery({
		queryKey: ["healthCheckQuery"],
		queryFn: healthCheckApi, 
		cacheTime: 1000 * 60 * 10, //캐시 유지 시간(언마운트 이후)
		staleTime: 1000 * 60 * 10, //10분마다 최신의 캐시 상태 유지(refetch)
	}
	);

	if(!healthCheckQuery.isLoading) {
		console.log(healthCheckQuery.data.data.status)
	}

	const userQuery = useQuery({
		queryKey: ["userQuery"],
		queryFn: async () => {
			const accessToken = localStorage.getItem("AccessToken");
			if( !accessToken ){
				 return;
			}
			const decodedJwt = jwtDecode(accessToken);
			return await userApi(decodedJwt.userId);

		},
	});

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
	