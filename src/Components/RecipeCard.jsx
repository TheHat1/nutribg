import { useState } from "react"
import supabase from "../Backend/supabase"

export default function RecipeCard({ id, name, desc }) {
    const [img, setImg] = useState()

    async function fetchPicture() {
        const cacheData = localStorage.getItem("img_cache_" + name + id)

        if (cacheData) {
            const { url, expiry } = JSON.parse(cacheData)
            if (Date.now() < expiry) {
                setImg(url)
                return
            }
        }

        const { data, error} = await supabase.
            storage.
            from('nutribg').
            createSignedUrl("recipePictures/" + name + id, 60 * 60 * 24)

        if(error){
            console.error(error)
            return
        }

        localStorage.setItem("img_cache_" + name + id, JSON.stringify({
            url: data.signedUrl,
            expiry: Date.now() + 60 * 60 * 24 * 1000
        }))

        setImg(data.signedUrl)
    }

    fetchPicture()

    return (
        <>
            <div className="w-100 font-display h-fit min-h-100 rounded-lg shadow-2xl bg-white hover:brightness-125 transition-all hover:scale-105 cursor-pointer">
                <img className="w-full h-60" src={img}/>
                <h1>{name}</h1>
            </div>
        </>
    )
}