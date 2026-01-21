import { useEffect, useState } from "react"
import supabase from "../Backend/supabase"
import RecipeCard from "../Components/RecipeCard"

export default function FavoritesPage() {
    const [cards, setCards] = useState()

    async function fetchRecipes() {
        try {
            const { data: session } = await supabase.auth.getSession()
            const { data, error } = await supabase.from('user_favorites').select('recipe_id').eq('user_id', session.session.user.id)

            if (error) {
                console.error(error)
                return
            }

            if (data) {
                data.map((r)=>{fetchRecipeInfo(r.recipe_id)})
            }

        } catch (error) {
            console.error(error)
        }
    }

    async function fetchRecipeInfo(id) {
        try {
            const { data, error } = await supabase.from('recipes').select('id, name, desc').eq('id', id).single()

            if (error) {
                console.error(error)
                return
            }

            if (data) {
                const old = [cards, <RecipeCard key={data.id} id={data.id} name={data.name} desc={data.desc}/>]
                setCards(old)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [])

    return (
        <>
            <div className="w-screen h-screen pt-38 flex p-10">
                {cards}
            </div>
        </>
    )
}