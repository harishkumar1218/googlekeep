import React, { useEffect, useLayoutEffect, useState } from 'react';
import './Authantication.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

function LoginPage() {
    const nav = useNavigate();
    const [populerList, setPopulerList] = useState({});
    // console.log(populerList);

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: ''
    });
    useEffect(()=>{},[])

    


    const login = useGoogleLogin({
          onSuccess: async (tokenResponse) => {
            try {
              const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });
      
              const userProfile = userInfoResponse.data;
              console.log(userProfile);

              localStorage.setItem("user",userProfile.id);
              localStorage.setItem("userData",JSON.stringify(userProfile));
              nav("/home")
              
              
              
            
            } catch (error) {
              console.error('Failed to fetch user profile', error);
            }
          },
          scope: 'profile email',
        });
      


    return (
        <div className='authBody'>
        <div className="containerAuthFluid">

            <div  className="row d-flex justify-content-center align-items-center h-100">
                <div  className="col-12">

                    <div style={{borderRadius:"25px"}} className="card bg-dark text-white my-5 mx-auto customAuthCard">
                        <div className="cardAuthBody p-5 d-flex flex-column align-items-center mx-auto w-100">

                            <h2 className="fwAuthBold mb-2 text-uppercase">Login</h2>
                            <p className="text-white-50 mb-5">Please Login width Google!</p>


                            <div className="d-flex flex-row mt-3 mb-5">
                                <a href="#!" className="btn btn-link m-3" style={{ color: 'white' }}>

                                    <GoogleIcon onClick={()=>login()} />
                                </a>
                            </div>

                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </div>
    );
}

export default LoginPage;
