import { useEffect, useState } from "react"
import supabase from "../Backend/supabase"
import RecipeCard from "../Components/RecipeCard"

export default function RecepiesPage(){
    const [cards, setCards] = useState([])

    async function FetchRecipes(){
        try {
            const {data, error} = await supabase.from('recipes').select('*')

            if(data){
                setCards([
                    data.map((rec)=>{
                        return(
                            <RecipeCard key={rec.id} id={rec.id} name={rec.name} desc={rec.desc}/>
                        )
                    })
                ])
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        FetchRecipes()
    },[])

    return(
        <>
        <div className="w-screen h-screen pt-38 flex p-10">
            {cards}
        </div>
        </>
    )
}