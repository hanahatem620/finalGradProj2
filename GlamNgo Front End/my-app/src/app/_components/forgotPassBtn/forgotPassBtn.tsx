'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotUserPass } from "@/profileActions/forgotPass.action"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function ForgotPassBtn() {

    const [open, setOpen] = useState(false)
    const [step, setStep] = useState("forgot")
    const router = useRouter()

const form = useForm({
  defaultValues:{
    email:"",
    password:""
  }
})

 const {register, handleSubmit} = form

async function forgotPassword({email}: {email:string} ){

   const res = await forgotUserPass({email})
    console.log(res);
    
   if(res.msg == 'Password reset email sent'){
          toast.success(res.msg, {
              position: "top-center",
              duration:2000,
          })
           setStep("resetPass")
        //   setOpen(false)
       router.push(`/resetPassBtn/reset?token=${res.reset_token}`)
        
        

          console.log(res);
          
      }if(res.msg == 'If email exists, reset link sent'){
             toast.error("An error occurred",{
              position: 'top-center',
              duration:2000,
          })
          console.log(res);
      }
          
      
}




  return (
<>

<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Forgot password</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
           
            <form onSubmit={handleSubmit(forgotPassword)}>
                          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>

            <Field>
              <Label htmlFor="email-1">email</Label>
              <Input id="email-1" {...register("email")} type="email" />
            </Field>

          </FieldGroup>
          <DialogFooter className="mt-3">
            <Button  type="submit">send an email</Button>
             <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
                    </form>

        </DialogContent>
    </Dialog>




</>

)

}