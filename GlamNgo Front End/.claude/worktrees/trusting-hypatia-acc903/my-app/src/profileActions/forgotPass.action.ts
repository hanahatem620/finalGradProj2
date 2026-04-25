'use server'

export async function forgotUserPass({ email} : {email :string}) {

       const res = await fetch("http://127.0.0.1:5000/auth/forgot-password" , {
        
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
        },
            body : JSON.stringify({
                email
            })            
        })


        const payload = await res.json()
        
        return payload
    

}