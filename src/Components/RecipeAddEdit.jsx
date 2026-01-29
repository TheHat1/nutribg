import { useState, useRef, useEffect } from "react"
import supabase from "../Backend/supabase"
import { useNavigate } from "react-router-dom"

export default function AddOrEdit({ r, i, c, n, nut, isInAddMode, id, handleInprogress }) {
    const textareaRef1 = useRef()
    const textareaRef2 = useRef()
    const textareaRef3 = useRef()

    const [recepie, setRecepie] = useState(r)
    const [instructions, setInstructions] = useState(i)
    const [category, setCategory] = useState(c)
    const [name, setName] = useState(n)
    const [nutrients, setNutrients] = useState(nut)
    const [recepieAddMsg, setRecepieAddMsg] = useState('')
    const [showRecepeAddMsg, setShowRecepieAddMsg] = useState(false)
    const [file, setFile] = useState()
    const inputRef1 = useRef()
    const navigate = useNavigate()

    async function AddRecepie() {
        try {
            handleInprogress(true)

            let ing = recepie.split('\n')
            let instr = instructions.split('\n')
            let nutri = nutrients.split('\n')

            if (!isInAddMode) {
                const { error } = await supabase.from('recipes').upsert({
                    id: id,
                    name: name,
                    category: category,
                    ingredients: ing,
                    instructions: instr,
                    nutrients: nutri
                })

                if (error) {
                    console.error(error)
                    inprogress = false
                    setRecepieAddMsg("Грешка при промяна в таблицата.")
                    setShowRecepieAddMsg(true)
                    setTimeout(() => { setShowRecepieAddMsg(false); setRecepieAddMsg('') }, 3000)
                }

                if (file) {

                    const { data: listData } = await supabase.storage.from('nutribg').list('recipePictures/' + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id)

                    if (listData.length != 0) {
                        const { } = await supabase.storage.from('nutribg').remove(['recipePictures/' + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id + '/' + listData[0].name])
                    }

                    const filePath = "recipePictures/" + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id + '/' + file.name.replaceAll(/[^\w.-]/g, "")

                    const { data, error: uploadError } = await supabase
                        .storage
                        .from('nutribg')
                        .upload(filePath, file, {
                            upsert: true,
                            contentType: file.type
                        })

                    if (uploadError) {
                        console.error("There was an error: " + JSON.stringify(uploadError, null, 2))
                        handleInprogress(false)
                        setRecepieAddMsg("Грешка при качване на снимка.")
                        setShowRecepieAddMsg(true)
                        setTimeout(() => { setShowRecepieAddMsg(false); setRecepieAddMsg('') }, 3000)
                        return
                    }

                    handleInprogress(false)
                    alert("Успешно променена рецепта.")
                    return
                }else{
                    handleInprogress(false)
                    alert("Успешно променена рецепта.")
                    return
                }
            }
            if (name === '' || category === '' || recepie === '' || instructions === '' || nutrients === '') {
                handleInprogress(false)
                setRecepieAddMsg("Има празни полета.")
                setShowRecepieAddMsg(true)
                setTimeout(() => { setShowRecepieAddMsg(false); setRecepieAddMsg('') }, 3000)
                return
            }

            const { error } = await supabase.from('recipes').insert({
                name: name,
                category: category,
                ingredients: ing,
                instructions: instr,
                nutrients: nutri
            })

            if (error) {
                handleInprogress(false)
                console.error(error)
                setRecepieAddMsg("Имаше грешка при добавянето.")
                setShowRecepieAddMsg(true)
                setTimeout(() => { setShowRecepieAddMsg(false); setRecepieAddMsg('') }, 3000)
            }

            if (!file) {
                handleInprogress(false)
                alert("Успешно променена рецепта.")
                return
            }

            const { data: count } = await supabase.from('recipes').select('id').order('id', { ascending: false }).limit(1).single()

            const { data: listData } = await supabase.storage.from('nutribg').list('recipePictures/' + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + (count.id))

            if (listData.length != 0) {
                const { } = await supabase.storage.from('nutribg').remove(['recipePictures/' + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + (count.id) + '/' + listData[0].name])
            }

            const filePath = "recipePictures/" + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + (count.id) + '/' + file.name.replaceAll(/[^\w.-]/g, "")

            const { data, error: uploadError } = await supabase
                .storage
                .from('nutribg')
                .upload(filePath, file, {
                    upsert: true,
                    contentType: file.type
                })

            if (uploadError) {
                console.error("There was an error: " + JSON.stringify(uploadError, null, 2))
                return
            }

            handleInprogress(false)
            alert("Успешно добавена рецепта.")
            setRecepie('')
            setName('')
            setCategory('')
            setInstructions('')
            setNutrients('')

        } catch (err) {
            console.error(err)
        }
    }

    async function handleDelete() {
        try {
            handleInprogress(true)
            const { error } = await supabase.from('recipes').delete().eq('id', id)
            if (error) {
                console.error(error)
                handleInprogress(false)
                alert("Грешка при изтриване на рецепта.")
                return
            }

            const { error: error1 } = await supabase.from('user_favorites').delete().eq('recipe_id', id)
            if (error1) {
                console.error(error1)
                handleInprogress(false)
                alert("Грешка при изтриване на рецепта.")
                return
            }

            const { data: listData } = await supabase.storage.from('nutribg').list('recipePictures/' + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id)

            if (listData.length != 0) {
                const { error } = await supabase.storage.from('nutribg').remove(['recipePictures/' + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id + '/' + listData[0].name])
                if (error) {
                    console.error(error)
                }
                const { error: error2 } = await supabase.storage.from('nutribg').remove(['recipePictures/' + name.normalize("NFKD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9._/-]/g, "_") + id])
                if (error2) {
                    handleInprogress(false)
                    alert("Грешка при изтриване на рецепта.")
                    console.error(error2)
                }
            }
            handleInprogress(false)
            alert("Успешно изтрита рецепта.")
            navigate('/recipes')
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        textareaRef1.current.style.height = "auto"
        textareaRef1.current.style.height = `${textareaRef1.current.scrollHeight}px`
        textareaRef2.current.style.height = "auto"
        textareaRef2.current.style.height = `${textareaRef2.current.scrollHeight}px`
        textareaRef3.current.style.height = "auto"
        textareaRef3.current.style.height = `${textareaRef3.current.scrollHeight}px`
    }, [])

    return (
        <>
            <div className="w-full h-fit bg-green-100 rounded-lg mt-10 flex flex-col md:justify-start justify-center p-5 font-display space-y-3">
                <h1 className="text-2xl">Добавяне на рецепта</h1>
                <div className="flex items-center space-x-5 w-full">
                    <h1 className="w-25">Име: </h1>
                    <input
                        className="border border-lime-900 bg-emerald-100 w-full max-w-150 h-12.5 rounded-lg transition-transform ease-out duration-150 hover:scale-105 pl-5"
                        type="text"
                        placeholder="..."
                        onChange={e => { setName(e.target.value) }}
                        value={name}
                        name="name"
                    />
                </div>
                <div className="flex items-center space-x-5 w-full">
                    <h1 className="w-25">Категория: </h1>
                    <input
                        className="border border-lime-900 bg-emerald-100 w-full max-w-150 h-12.5 rounded-lg transition-transform ease-out duration-150 hover:scale-105 pl-5"
                        type="text"
                        placeholder="..."
                        onChange={e => { setCategory(e.target.value) }}
                        value={category}
                        name="category"
                    />
                </div>
                <div className="flex items-center space-x-5 full">
                    <h1 className="w-25">Съставки: </h1>
                    <textarea
                        className="w-full max-w-150 min-h-25 pl-5 py-3 border bg-emerald-100 border-black rounded-md shadow-lg mt-3 overflow-hidden resize-none"
                        ref={textareaRef1}
                        onInput={e => {
                            setRecepie(e.target.value)
                            textareaRef1.current.style.height = "auto"
                            textareaRef1.current.style.height = `${textareaRef1.current.scrollHeight}px`
                        }}
                        value={recepie}
                        placeholder=". . ."
                        name="ingredients"
                    />
                </div>
                <div className="flex items-center space-x-5 full">
                    <h1 className="w-25">Инструкции: </h1>
                    <textarea
                        className="w-full max-w-150 min-h-25 pl-5 py-3 border bg-emerald-100 border-black rounded-md shadow-lg mt-3 overflow-hidden resize-none"
                        ref={textareaRef2}
                        onInput={e => {
                            setInstructions(e.target.value)
                            textareaRef2.current.style.height = "auto"
                            textareaRef2.current.style.height = `${textareaRef2.current.scrollHeight}px`
                        }}
                        value={instructions}
                        placeholder=". . ."
                        name="instructions"
                    />
                </div>
                <div className="flex items-center space-x-5 full">
                    <h1 className="wrap-normal w-25">Хранителни стойности: </h1>
                    <textarea
                        className="w-full max-w-150 min-h-25 pl-5 py-3 border bg-emerald-100 border-black rounded-md shadow-lg mt-3 overflow-hidden resize-none"
                        ref={textareaRef3}
                        onInput={e => {
                            setNutrients(e.target.value)
                            textareaRef3.current.style.height = "auto"
                            textareaRef3.current.style.height = `${textareaRef3.current.scrollHeight}px`
                        }}
                        value={nutrients}
                        placeholder=". . ."
                        name="nutrition"
                    />
                </div>
                <h1 className={`text-xl transition-opacity ${file ? "opacity-100" : "opacity-0"}`}>Прикачен файл: {file?.name}</h1>
                <div onClick={() => { inputRef1.current.click() }} className="w-full lg:max-w-70 h-15 lg:ml-5 rounded-lg bg-lime-700 text-white text-2xl flex items-center justify-center hover:brightness-125 hover:scale-105 transition-all cursor-pointer">
                    Качи снимка
                    <input ref={inputRef1} type="file" className="absolute hidden" onChange={(e) => { setFile(e.target.files[0]) }} />
                </div>
                <h1 className={`w-full lg:max-w-180 shadow-2xl p-1 rounded-lg transition-all
                            ${showRecepeAddMsg ? "border-2 rounded-lg" : "opacity-0 h-0"}`}>{recepieAddMsg}</h1>
                <div className="w-full h-fit flex flex-col sm:flex-row space-x-0 sm:space-x-3 space-y-3 sm:space-y-0">
                    <div onClick={AddRecepie}
                        className="w-full lg:max-w-70 h-15 lg:ml-5 rounded-lg bg-lime-700 text-white text-2xl flex items-center justify-center hover:brightness-125 hover:scale-105 transition-all cursor-pointer">
                        {isInAddMode ? 'Добави рецепта' : 'Промени рецепта'}
                    </div>
                    <div onClick={handleDelete}
                        className={`w-full lg:max-w-70 h-15 lg:ml-5 rounded-lg bg-red-700 text-white text-2xl flex items-center justify-center hover:brightness-125 hover:scale-105 transition-all cursor-pointer
                        ${isInAddMode ? 'hidden' : 'flex'}`}>
                        Изтрий рецепта
                    </div>
                </div>
            </div>
        </>
    )
}