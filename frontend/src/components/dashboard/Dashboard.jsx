import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        name: "Alex",
        level: 5,
        streakDays: 7,
        balance: 1254.78,
        monthlySpendings: 876.32,
        savingGoals: [
            { name: 'Vacation', target: 1000, current: 650, icon: '✈️'},
            { name: 'Emergency fund', target: 5000, current: 2000, icon: '🛡️'}
            
        ]
    })
    return(
        <div>h1</div>
    )
}

export default Dashboard
