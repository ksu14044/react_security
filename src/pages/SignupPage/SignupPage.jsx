import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/config/axiosConfig';

function SignupPage(props) {
    const navigate = useNavigate();

    const [ signupInput, setSignupInput ] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
    });

    const [ errors, setErrors ] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
    });

    const handleSignUpInputOnChange = (e) => {
        setSignupInput({
            ...signupInput,
            [e.target.name]: e.target.value,
        })
    }

  //  const handleSignupButtonOnClick = async () => {
  //
  //      try {
  //          const response = await api.post("/api/auth/signup", signupInput);
  //          console.log(response.data);
  //      } catch (error) {
  //          console.log(error.response.data.data);
  //          let newError = {};
  //          const responseErrors = error.response.data.data;
  //          for(let e of responseErrors) {
  //              const errorEntry = Object.entries(e)[0]
  //              newError = {
  //                  ...newError,
  //                  [errorEntry[0]]: errorEntry[1],
  //              };
  //          } 
  //          setErrors({ 
  //              username: "", 
  //              password: "",  
  //              name: "", 
  //              email: "",
  //              ...newError
  //          });
  //      }    
  //  }

  //    console.log(errors);
    const handleInputOnBlur = (e) => {
        const { name, value } = e.target;
        let message = "";
        if(name == "username" && !(/^[a-zA-Z][a-zA-Z0-9]{0,14}$/.test(value))) {
            message = "3~15자, 알파벳과 숫자만 사용 가능."
        }

        if(name == "password" && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/.test(value))) {
            message = "최소 8자 이상, 대소문자, 숫자, 특수문자 포함."
        }

        if(name == "name" && !(/^[가-힣]{1,}$/.test(value))) {
            message = "2자 이상, 한글만 사용 가능."
        }

        if(name == "email" && !(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value))) {
            message = "이메일 형식으로 입력해야합니다."
        }

        setErrors({
            ...errors,
            [name]: message,
        })
    }

    const handleSignupButtonOnClick = async () => {
        if(Object.entries(errors).filter(entry => !!entry[1]).length > 0) {
            return;
        }
        try {
            await api.post("/api/auth/signup", signupInput);
            alert("회원가입 완료");
            navigate("/signin");
        } catch (error) {
            setErrors({
                username: error.response.data.data,
                password: "",
                name: "",
                email: "",
            })
        }
    }


    return (
        <Box mt={10}>
            <Container maxWidth={"xs"}>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography variant='h4' textAlign={'center'}>회원가입</Typography>
                        <Box display={"flex"} flexDirection={'column'} gap={2}>
                            <TextField type='text' label="username" name='username'
                            onChange={handleSignUpInputOnChange}
                            onBlur={handleInputOnBlur}
                            value={signupInput.username}
                            error={!!errors.username}
                            helperText={errors.username} />
                            <TextField type='password' label="password" name='password'
                            onChange={handleSignUpInputOnChange}
                            onBlur={handleInputOnBlur}
                            value={signupInput.password}
                            error={!!errors.password}
                            helperText={errors.password} />                             
                            <TextField type='text' label="name" name='name' 
                            onChange={handleSignUpInputOnChange}
                            onBlur={handleInputOnBlur}
                            value={signupInput.name}
                            error={!!errors.name}
                            helperText={errors.name} />
                            <TextField type='text' label="email" name='email' 
                            onChange={handleSignUpInputOnChange}
                            onBlur={handleInputOnBlur}
                            value={signupInput.email}
                            error={!!errors.email}
                            helperText={errors.email} />
                            <Button variant='contained' onClick={handleSignupButtonOnClick}>가입하기</Button>
                        </Box>
                        <Typography variant='h6' textAlign={'center'}>
                            이미 계정이 있나요? <Link to={"/signin"}>로그인</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default SignupPage;