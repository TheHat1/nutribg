import { useEffect, useState } from "react"
import supabase from "../Backend/supabase"
import RecipeCard from "../Components/RecipeCard"
import isAuth from '../Backend/isAuth'
import { useLocation, useNavigate } from "react-router-dom"

export default function FavoritesPage() {
    const [cards, setCards] = useState()
    const [search, setSearch] = useState("")
    const [recipes, setRecipes] = useState()
    const address = useLocation()
    const [isSignedIn, setIsSignedIn] = useState(false)
    const navigate = useNavigate()

    async function fetchRecipes() {
        try {
            const { data: session } = await supabase.auth.getSession()
            const { data, error } = await supabase.from('user_favorites').select('recipe_id').eq('user_id', session.session.user.id)

            if (error) {
                console.error(error)
                return
            }

            if (data) {
                setRecipes(data)
                data.map((r) => { fetchRecipeInfo(r.recipe_id) })
            }

        } catch (error) {
            console.error(error)
        }
    }

    async function fetchRecipeInfo(id) {
        try {
            const { data, error } = await supabase.from('recipes').select('id, name, nutrients').eq('id', id).single()

            if (error) {
                console.error(error)
                return
            }

            if (data) {
                setCards(prev => [prev, <RecipeCard key={data.id} id={data.id} name={data.name} nutrients={data.nutrients} />])
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        async function func() {
            setIsSignedIn(await isAuth())
            if (await isAuth()) {
                fetchRecipes()
            }
        }
        func()
    }, [address])

    useEffect(() => {
        const timer = setTimeout(() => {
            if(!isSignedIn){
                return
            }
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
                    {isSignedIn?  cards:
                    <div className="w-full flex justify-center items-center font-display text-white text-4xl flex-col">
                        <h1>Не сте влезнали във Вашият профил.</h1>
                        <h1>Направете го <a onClick={()=>{navigate('/login')}} className="text-lime-500 cursor-pointer duration-150 hover:brightness-125 transition-all">тук.</a></h1>
                    </div>
                    }
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