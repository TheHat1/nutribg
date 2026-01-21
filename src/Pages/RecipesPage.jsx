import { useEffect, useState } from "react"
import supabase from "../Backend/supabase"
import RecipeCard from "../Components/RecipeCard"

export default function RecepiesPage() {
    const [cards, setCards] = useState([])
    const [search, setSearch] = useState()

    async function FetchRecipes() {
        try {
            const { data, error } = await supabase.from('recipes').select('id, name, desc')

            if (error) {
                console.error(error)
                return
            }

            if (data) {
                setCards([
                    data.map((rec) => {
                        return (
                            <RecipeCard key={rec.id} id={rec.id} name={rec.name} desc={rec.desc} />
                        )
                    })
                ])
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        FetchRecipes()
    }, [])

    return (
        <>
            <div className="w-full h-50 flex flex-col mt-28 items-center justify-center space-y-5 font-display">
                <h1 className="text-5xl text-white">Рецепти</h1>
                <input
                    className="border-2 border-lame-900 bg-emerald-100 max-w-180 w-full h-14 text-black rounded-md transition-transform ease-out duration-150 hover:scale-105 pl-5"
                    type="text"
                    value={search}
                    placeholder="Искам да ям..."
                    onChange={(e) => { setSearch(e.target.value) }}
                    name="search_field"
                />
            </div>
            <div className="w-screen h-screen flex p-10">
                {cards}
            </div>
        </>
    )
}