import React from 'react'
import { useSelector } from 'react-redux'


const Dashboard = () => {

    const { userInfo } = useSelector((state) => state.auth)
    console.log(userInfo)
    


    return (
        <div>
            <h1>Welcome, {userInfo.email} </h1>
        </div>
    )
}

export default Dashboard