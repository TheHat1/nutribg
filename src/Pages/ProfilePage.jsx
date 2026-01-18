import { useEffect } from "react"
import isAuth from "../Backend/isAuth"
import supabase from "../Backend/supabase"
import { useNavigate } from "react-router-dom"


export default function ProfilePage() {
    const navigate = useNavigate()

    async function LogOut() {
        const { } = await supabase.auth.signOut().then(() => { navigate('/') })
    }

    useEffect(() => {
        if (!isAuth()) {
            navigate('/login')
        }
    }, [])

    return (
        <>
            <div className="w-screen h-screen p-10 pt-40">
                <div className="w-screen justify-center md:justify-start items-center flex md:flex-row flex-col space-x-10 space-y-5">
                    <img className="h-65 invert shadow-2xl rounded-full shadow-white bg-gray-500" src="/images/user.png"/>
                    <div className="bg-white w-[90vw] max-w-200 min-h-100 h-fit rounded-lg flex items-center p-10 flex-col space-y-3 shadow-2xl">

                    </div>
                </div>

            </div>
        </>
    )
}