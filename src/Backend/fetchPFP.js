import supabase from "./supabase"

export default async function fetchPFP(id) {
    const { data: listData, error: listError } = await supabase.storage.from('nutribg').list("userPFP/" + id)

    if (listData.length != 0) {
        const { data: PFPdata, error: PFPerror } = await supabase.
            storage.
            from('nutribg').
            createSignedUrl("userPFP/" + id + "/" + listData[0].name, 60 * 60 * 24)

        localStorage.setItem("img_cache_" + id, JSON.stringify({
            url: PFPdata.signedUrl,
            expiry: Date.now() + 60 * 60 * 24 * 1000
        }))

        return PFPdata.signedUrl

    } else {
        return '/images/user.png'
    }
}