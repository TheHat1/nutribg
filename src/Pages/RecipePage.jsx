import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import supabase from "../Backend/supabase"

export default function RecipePage() {
    const { id } = useParams()
    const [img, setImg] = useState()
    const [isFavorite, setIsFavorite] = useState(false)
    const [recipe, setRecipe] = useState()

    async function fetchPicture() {
        const { data: recipe } = await supabase.from('recipes').select('*').eq('id', id).single()
        setRecipe(recipe)

        const cacheData = localStorage.getItem("img_cache_" + recipe.name + id)

        if (cacheData) {
            const { url, expiry } = JSON.parse(cacheData)
            if (Date.now() < expiry) {
                setImg(url)
                return
            }
        }

        const { data: listData, error: listError } = await supabase.storage.from('nutribg').list("recipePictures/" + recipe.name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id)

        const { data, error } = await supabase.
            storage.
            from('nutribg').
            createSignedUrl("recipePictures/" + recipe.name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id + '/' + listData[0].name, 60 * 60 * 24)

        if (error) {
            console.error(error)
            return
        }

        localStorage.setItem("img_cache_" + recipe.name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id, JSON.stringify({
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
            <div className="w-screen h-screen overflow-y-auto p-7 pt-35 space-y-5">
                <div className="w-full h-70 flex flex-col md:flex-row items-center shadow-2xl bg-green-100 rounded-lg pt-7 md:pt-0">
                    <img loading="lazy" className="rounded-lg border-b md:rounded-none shadow-2xl md:rounded-l-lg md:border-r md:h-full object-cover" src={img} />
                    <div className="w-full h-full bg-green-100 flex flex-col space-y-3 font-display whitespace-pre-line p-7 md:rounded-r-lg md:rounded-none rounded-b-lg">
                        <h1 className="text-3xl">{recipe?.name}</h1>
                        <p className="text-xl">{recipe?.nutrients?.join('\n ● ')}</p>
                    </div>
                </div>
                <div className="w-full h-fit bg-green-100 rounded-lg p-7 font-display flex flex-col space-y-5 whitespace-pre-line shadow-2xl">
                    <h1 className="text-2xl font-bold">Съставки</h1>
                    <p className="pl-5 text-xl">{recipe?.ingredients?.join('\n ● ')}</p>
                    <h1 className="text-2xl font-bold">Начин на приготвяне: </h1>
                    <p className="pl-5 text-xl">{recipe?.instructions?.join('\n')}</p>
                </div>
            </div>
        </>
    )
}