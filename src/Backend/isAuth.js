import supabase from "./supabase"

export default async function getSession() {
    const { data, error } = await supabase.auth.getSession()

    if (data?.session) {
        return true
    }
    return false
}