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
import { resetUserPassword } from "@/profileActions/resetPass.action"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner";

export default function ResetPassBtn() {

    const [open, setOpen] = useState(false)
    const router = useRouter()
   const searchParams = useSearchParams();
const token = searchParams.get("token");

const form = useForm({
  defaultValues:{
    password:""
  }
})

 const {register, handleSubmit} = form

async function handleResetPass(data: { password: string }) {

  if (!token) {
    toast.error("Something went wrong", {
      position: "top-center",
      duration: 2000,
    });
    console.log(token);
    return;
  }


  try {

    const res = await resetUserPassword(token, data.password);
    console.log(res);

    if (res.msg == "Password reset successful") {
      toast.success("Password reset successfully", {
        position: "top-center",
        duration: 2000,
      });

    router.push("/logIn")
    } 
    
    else if (res.msg == "Invalid or expired token") {
      toast.error("Invalid or expired token");
    }

  } catch (err) {
    toast.error("Server error");
    console.log(err);
  }
}

useEffect(() => {
  setOpen(true)
}, [])


  return (
    <>
    
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Reset your password</Button>
            </DialogTrigger>
    
            <DialogContent className="sm:max-w-sm">
                
                <form onSubmit={handleSubmit(handleResetPass)}>
                              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
    
                <Field>
                  <Label htmlFor="password-1">password</Label>
                  <Input id="password-1" {...register("password")} type="password" />
                </Field>
    
              </FieldGroup>
              <DialogFooter className="mt-3">
                <Button  type="submit">send</Button>
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
