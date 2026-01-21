import { useEffect, useState } from "react"
import supabase from "../Backend/supabase"

export default function RecipeCard({ id, name, desc }) {
    const [img, setImg] = useState()
    const [isFavorite, setIsFavorite] = useState(false)

    async function fetchPicture() {
        const cacheData = localStorage.getItem("img_cache_" + name + id)

        if (cacheData) {
            const { url, expiry } = JSON.parse(cacheData)
            if (Date.now() < expiry) {
                setImg(url)
                return
            }
        }

        const { data: listData, error: listError } = await supabase.storage.from('nutribg').list("recipePictures/" + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id)

        const { data, error } = await supabase.
            storage.
            from('nutribg').
            createSignedUrl("recipePictures/" + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id + '/' + listData[0].name, 60 * 60 * 24)

        if (error) {
            console.error(error)
            return
        }

        localStorage.setItem("img_cache_" + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id, JSON.stringify({
            url: data.signedUrl,
            expiry: Date.now() + 60 * 60 * 24 * 1000
        }))

        setImg(data.signedUrl)
    }

    async function CheckFavorite() {
        try {
            const { data: session } = await supabase.auth.getSession()
            const { data, error } = await supabase.from('user_favorites').select('*').eq('user_id', session.session.user.id).eq('recipe_id', id)

            if (data) {
                setIsFavorite(data.length > 0)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleFavorite() {
        try {
            const { data: session } = await supabase.auth.getSession()

            if (!isFavorite) {
                const { } = await supabase.from('user_favorites').insert({
                    user_id: session.session.user.id,
                    recipe_id: id
                })
            } else {
                const { } = await supabase.from('user_favorites').delete().eq('user_id', session.session.user.id).eq('recipe_id', id)
            }

            CheckFavorite()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPicture()
        CheckFavorite()
    }, [])

    return (
        <>
            <div className="w-90 font-display h-115 rounded-lg shadow-2xl bg-lime-100 border transition-all hover:scale-103 cursor-pointer">
                <img loading="lazy" className="w-full h-60 rounded-t-lg shadow-2xl" src={img} />
                <div className="flex border-t w-full justify-between items-center pr-3">
                    <h1 className="p-3 text-xl">{name}</h1>
                    <img onClick={handleFavorite} className="h-10 hover:scale-110 transition-all" src={isFavorite ? "/images/bookmark.png" : "/images/bookmark-empty.png"} />
                </div>
                <p className="px-3 text-md text-wrap h-32 text-ellipsis mask-b-from-10 overflow-clip">{desc}</p>
            </div>
        </>
    )
}