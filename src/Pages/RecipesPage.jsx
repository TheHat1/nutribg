import { useEffect, useState } from "react"
import supabase from "../Backend/supabase"
import RecipeCard from "../Components/RecipeCard"

export default function RecepiesPage() {
    const [cards, setCards] = useState([])
    const [search, setSearch] = useState("")
    const [recipes, setRecipes] = useState()

    async function FetchRecipes() {
        try {
            const { data, error } = await supabase.from('recipes').select('*')

            if (error) {
                console.error(error)
                return
            }

            if (data) {
                setRecipes(data)
                setCards([
                    data.map((rec) => {
                        return (
                            <RecipeCard key={rec.id} id={rec.id} name={rec.name} nutrients={rec.nutrients} />
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

    useEffect(() => {
        const timer = setTimeout(() => {
            let searchInput = search.toString().toLowerCase().replaceAll(' ', '')
            let searchResult
            if (search != " ") {
                searchResult = recipes.filter((e) => {
                    return (
                        e.name.toString().toLowerCase().replaceAll(' ', '').includes(searchInput) ||
                        e.category.toString().toLowerCase().replaceAll(' ', '').includes(searchInput)
                    )
                })

                setCards([
                    searchResult.map((rec) => {
                        return (
                            <RecipeCard key={rec.id} id={rec.id} name={rec.name} nutrients={rec.nutrients} />
                        )
                    })
                ])
            } else {
                searchResult = recipes
                setSearch("")
            }
        }, 400)
    }, [search])

    return (
        <>
            <div className="w-screen h-screen overflow-y-auto overflow-x-hidden">
                <div className="w-full h-50 flex flex-col mt-28 items-center justify-center space-y-5 font-display px-5 border-b-2 border-lime-600">
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
                <div className="w-screen h-fit min-h-screen flex p-10 flex-wrap justify-center">
                    {cards}
                </div>
                <footer className="w-screen h-fit min-h-26 bg-stone-950 flex p-1">
                    <div className="w-full h-full flex space-x-15">

                    </div>
                    <div className="min-w-80 text-gray-500 font-display text-sm flex items-end">
                        <h1>©Made by TheHatInc™. All rights reserved.</h1>
                    </div>
                </footer>
            </div>
        </>
    )
}