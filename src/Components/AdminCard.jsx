import { useState } from "react"
import fetchPFP from "../Backend/fetchPFP"

export default function AdminCard({ id, is_owner, name }) {
    const [img, setImg] = useState()

    async function PFP(){
        setImg(await fetchPFP(id))
    }

    PFP()

    return (
        <>
            <div className={`w-full h-fit rounded-lg shadow-2xl flex flex-col space-y-5 sm:space-y-0 sm:flex-row items-center p-3 sm:space-x-5
                ${is_owner ? "bg-yellow-500" : "bg-sky-200"}
                `}>
                <img className="w-10 h-10 rounded-full" src={img}/>
                <h1 className="text-xl">{name}</h1>
                <h1 className="text-center">ID: {id}</h1>
                {is_owner ?
                    <h1 className="font-bold">Собственик</h1>
                    :
                    <h1 className="font-bold">Администратор</h1>
                }
            </div>
        </>
    )
}