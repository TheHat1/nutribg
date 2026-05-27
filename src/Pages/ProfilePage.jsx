import { useEffect, useState, useRef } from "react"
import isAuth from "../Backend/isAuth"
import fetchPFP from "../Backend/fetchPFP"
import supabase from "../Backend/supabase"
import { useNavigate } from "react-router-dom"
import AdminCard from "../Components/AdminCard"
import RecipeAddOrEdit from '../Components/RecipeAddEdit'

export default function ProfilePage() {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [dateCreated, setDateCreated] = useState()
    const [inprogress, setInprogress] = useState(false)
    const [userid, setUserid] = useState()
    const [img, setImg] = useState("/images/user.png")
    const [file, setFile] = useState()
    const [Refresh, setRefresh] = useState(0)
    const divRef = useRef()
    const inputRef = useRef()
    const [isChange, setIsChange] = useState(false)
    const [errorChange, setErrorChange] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const [msg, setMsg] = useState()
    const [newData, setNewData] = useState(undefined)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [admins, setAdmins] = useState()
    const [copied, setCopied] = useState(false)
    const [addMSG, setAddMSG] = useState()
    const [displayAddMsg, setDisplayAddMsg] = useState(false)
    const navigate = useNavigate()

    async function getUser() {
        try {
            const { data, error } = await supabase.auth.getSession()

            if (data?.session?.user?.id) {

                setUsername(data.session.user.user_metadata.display_name)
                setEmail(data.session.user.email)
                setDateCreated(data.session.user.created_at)
                setUserid(data.session.user.id)

                const { data: data1, error } = await supabase.from("admins").select("is_owner").eq("user_id", data?.session?.user?.id).maybeSingle()
                setIsOwner(data1.is_owner)
                setIsAdmin(!!data1)

                const cacheData = localStorage.getItem("img_cache_" + data?.session?.user?.id)

                if (cacheData) {
                    const { url, expiry } = JSON.parse(cacheData)
                    if (Date.now() < expiry) {
                        setImg(url)
                        return
                    }
                }

                setImg(await fetchPFP(data.session.user.id))

            }
        } catch (err) {
            console.error("There was an error!" + err)
        }
    }

    async function uploadPFP() {
        try {
            setInprogress(true)

            const { data: listData } = await supabase.storage.from('nutribg').list('userPFP/' + userid)

            if (listData.length != 0) {
                const { } = await supabase.storage.from('nutribg').remove(['userPFP/' + userid + '/' + listData[0].name])
            }

            const filePath = "userPFP/" + userid + '/' + file.name.replaceAll(/[^\w.-]/g, "")

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

            const { data: listData1, error: listError } = await supabase.storage.from('nutribg').list("userPFP/" + userid)

            const { data: PFPdata, error: PFPerror } = await supabase.
                storage.
                from('nutribg').
                createSignedUrl("userPFP/" + userid + "/" + listData1[0].name, 60 * 60 * 24)

            localStorage.setItem("img_cache_" + userid, JSON.stringify({
                url: PFPdata.signedUrl,
                expiry: Date.now() + 60 * 60 * 24 * 1000
            }))

            setImg(PFPdata.signedUrl)
            setFile()
            setRefresh(Math.random())
            setInprogress(false)

        } catch (err) {
            console.error("There was an error uploading PFP: " + err)
        }
    }

    async function GetAdmins() {
        try {
            const { data, error } = await supabase.from('admins').select('*')

            if (data.length > 0) {
                setAdmins([
                    data.map((admin) => {
                        return (
                            <AdminCard key={admin.user_id} id={admin.user_id} is_owner={admin.is_owner} name={admin.user_name} />
                        )
                    })
                ])
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function LogOut() {
        setInprogress(true)
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error(error)
        } else {
            navigate('/')
        }
    }

    async function changeUser() {
        setErrorMsg('')

        if (msg == 'Промени потребителско име') {
            if (newData != undefined) {
                const { error } = await supabase.auth.updateUser({
                    data: {
                        display_name: newData
                    }
                })

                if (isAdmin) { const { } = await supabase.from('admins').update({ user_name: newData }).eq('user_id', userid) }

                setRefresh(Math.random())
                setIsChange(false)
                setNewData('')

            } else {
                setErrorChange(true)
                setErrorMsg('Има празни полета!')
            }
        } else {

            if (emailRegex.test(newData)) {
                const { error } = await supabase.auth.updateUser({
                    email: newData
                })

                setRefresh(Math.random())
                setIsChange(false)
                setNewData('')
                alert("Проверете Вашият email.")

            } else {
                setErrorChange(true)
                setErrorMsg('Невалиден e-mail!')
            }

        }

    }

    async function AddAdmin() {
        try {
            if (newData === undefined) {
                setAddMSG("Моля въведете ID на потребител.")
                setNewData()
                setDisplayAddMsg(true)
                setTimeout(() => { setDisplayAddMsg(false); setAddMSG() }, 3000)
                return
            }

            const { data, error } = await supabase.from("admins").select("is_owner").eq("user_id", newData).maybeSingle()

            if (!!data) {
                setAddMSG("Този потребител вече е администратор.")
                setDisplayAddMsg(true)
                setTimeout(() => { setDisplayAddMsg(false); setAddMSG() }, 3000)
                return
            }

            const { error: err } = await supabase.from('admins').insert({ user_id: newData, is_owner: false })

            if (err) {
                console.log(err)
                setAddMSG("Грешка при добавяне на администратор.")
                setNewData()
                setDisplayAddMsg(true)
                setTimeout(() => { setDisplayAddMsg(false); setAddMSG() }, 3000)
                return
            }

            setAddMSG("Потребител добавен като администратор.")
            setNewData()
            setDisplayAddMsg(true)
            setTimeout(() => { setDisplayAddMsg(false); setAddMSG() }, 3000)
            setRefresh(Math.random)

        } catch (error) {
            console.error(error)
        }
    }

    function handleClickOutsideList(e) {
        if (divRef.current && !divRef.current.contains(e.target) && !divRef.current.contains(e.target)) {
            setIsChange(false)
        }
    }

    function handlePFPupload() {
        inputRef.current.click()
    }

    function handleInprogressState(e) {
        setInprogress(e)
        console.log(e)
    }

    async function handleCopyToClipboard() {
        try {
            await navigator.clipboard.writeText(userid)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch (err) {
            console.error(err)
        }
    }

    document.addEventListener('mousedown', handleClickOutsideList)

    useEffect(() => {
        async function func() {
            if (await !isAuth()) {
                navigate('/login')
            }
        }
        func()
    }, [])

    useEffect(() => {
        if (file != undefined) {
            if (file.type.includes("image")) {
                uploadPFP()
            }
        }
    }, [file])

    useEffect(() => {
        getUser()
        GetAdmins()
    }, [Refresh])

    return (
        <>
            <div className={`w-screen h-screen bg-black/25 backdrop-blur-md absolute top-0 transition-all flex justify-center items-center
                ${inprogress || isChange ? "z-50 opacity-100" : "-z-50 opacity-0"}`}>
                <img className={`animate-spin h-15 invert ${inprogress ? "z-50 opacity-100" : "-z-50 opacity-0"}`} src="/images/loading.png" />
            </div>

            <div className={`absolute inset-0 flex justify-center ${isChange ? "z-50" : "-z-10"}`}>
                <div ref={divRef} className={`absolute flex flex-col space-y-5 justify-center items-center overflow-hidden mx-auto p-5 max-w-125 w-[90vw] min-h-63 h-fit bg-green-100 rounded-md z-30 transition-transform duration-300 ease-out 
                    ${isChange ? "translate-y-50 lg:translate-y-75" : "-translate-y-52.5 pointer-events-none"}`}>
                    <h1 className="font-robotoMono text-lg px-5 text-center">
                        {msg}
                    </h1>
                    <div className={`text-lg font-semibold text-red-800 bg-red-200 flex items-center pl-2.5 border rounded-md transition-all duration-300 ease-out 
                        ${errorChange ? "max-w-100 w-[80vw] h-12.5 border-red-950" : "max-w-112.5 w-[80vw] border-lime-900"}`}>
                        {errorMsg}
                    </div>
                    <input
                        className="border border-lime-900 bg-emerald-100 w-[80vw] max-w-100 h-12.5 rounded-lg transition-transform ease-out duration-150 hover:scale-105 pl-5"
                        type="text"
                        placeholder="..."
                        onChange={e => { setNewData(e.target.value) }}
                        value={newData}
                        name="email/username"
                    />
                    <div onClick={changeUser} className="bg-lime-900 w-35 h-10 text-white text-xl rounded-lg text-center flex items-center justify-center hover:brightness-125 cursor-pointer transition-transform ease-out duration-150 hover:scale-105">Промени</div>
                </div>
            </div>

            <div className="w-screen h-screen p-10 pt-40 overflow-y-auto">
                <div className="w-full justify-center md:justify-start items-center flex md:flex-row flex-col md:space-x-10 space-y-5">
                    <div className="relative group transition-all w-fit shrink-0">
                        <img className="h-65 w-65 shadow-2xl rounded-full bg-gray-500 object-cover" src={img} />
                        <div className="h-65 w-65 flex justify-center items-center rounded-full absolute top-0 opacity-0 group-hover:opacity-75 bg-black z-10">
                            <img onClick={handlePFPupload} src="/images/edit.png" className="h-11 w-11 opacity-100 invert transition-transform ease-out duration-150 hover:scale-110 cursor-pointer" />
                            <input ref={inputRef} type="file" className="absolute hidden" onChange={(e) => { setFile(e.target.files[0]) }} />
                        </div>
                    </div>

                    <div className="bg-green-100 w-full max-w-200 h-fit rounded-lg flex items-start p-8 flex-col space-y-3 shadow-2xl">
                        <div className="text-3xl font-display flex justify-between items-center w-full">
                            {username}
                            <img onClick={() => { setIsChange(!isChange); setMsg('Промени потребителско име'); setErrorChange(false); setErrorMsg('') }}
                                className="h-8 cursor-pointer hover:scale-110 transition-all" src="/images/edit.png" />
                        </div>
                        <div className="text-lg font-display flex justify-between items-center w-full">
                            {email}
                            <img
                                className="h-5 cursor-pointer hover:scale-110 transition-all" src="/images/edit.png" />
                        </div>
                        <div onClick={handleCopyToClipboard}
                            className="text-lg cursor-pointer font-display justify-start items-center w-fит relative inline-block group">
                            ID: {copied ? "Копирано" : userid}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Копирай
                            </div>
                        </div>
                        <div className="w-full mt-15 flex sm:items-end-safe space-x-5 flex-col items-center sm:flex-row">
                            <div onClick={LogOut}
                                className="w-50 h-11 bg-lime-900 rounded-lg text-white text-xl font-display flex justify-center items-center hover:scale-110 hover:brightness-125 transition-all cursor-pointer">Излизане</div>
                            <div className="font-display text-center sm:text-right w-full">Създаден на: {dateCreated}</div>
                        </div>
                    </div>
                </div>
                {isAdmin && isOwner ?
                    <div className="w-full h-fit bg-green-100 rounded-lg mt-10 flex flex-col items-center md:items-start space-y-10 font-display p-5 shadow-2xl">
                        <h1 className="text-2xl md:text-3xl">Добавяне на администратори</h1>
                        <div className="space-y-3 w-fit items-center md:items-start justify-center md:space-x-3 flex flex-col md:flex-row">
                            <div className="flex items-center space-x-5 full">
                                <h1>ID: </h1>
                                <input
                                    className="border border-lime-900 bg-emerald-100 w-full max-w-100 h-12.5 rounded-lg transition-transform ease-out duration-150 hover:scale-105 pl-5"
                                    type="text"
                                    placeholder="..."
                                    onChange={e => { setNewData(e.target.value) }}
                                    value={newData}
                                    name="ID"
                                />
                            </div>
                            <div onClick={AddAdmin}
                                className="w-35 h-11 bg-lime-800 flex items-center justify-center rounded-lg text-white hover:scale-110 hover:brightness-125 transition-all cursor-pointer">Добавяне +</div>
                        </div>
                        <h1 className={`w-full shadow-2xl p-1 rounded-lg transition-all
                            ${displayAddMsg ? "border-2 rounded-lg" : "opacity-0 h-0"}`}>{addMSG}</h1>
                    </div>
                    :
                    null
                }
                {isAdmin ?
                    <div className="w-full h-fit bg-green-100 rounded-lg mt-10 flex flex-col space-y-10 font-display p-5 shadow-2xl">
                        <h1 className="text-2xl">Администратори</h1>
                        {admins}
                    </div>
                    :
                    null
                }
                {isAdmin ?
                    <RecipeAddOrEdit r={''} i={''} c={''} n={''} nut={''} isInAddMode={true} id={''} handleInprogress={setInprogress}/>
                    :
                    null
                }
            </div>
        </>
    )
}