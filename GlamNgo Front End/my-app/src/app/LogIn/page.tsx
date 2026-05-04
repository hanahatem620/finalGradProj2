'use client'
import Image from 'next/image'
import logo2 from '../../../public/images/logo2.png'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, useForm } from "react-hook-form"
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { signUpSchema, signUpSchemaType } from '@/schema/signUp.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { FcGoogle } from "react-icons/fc";
import ForgotPassBtn from '../_components/forgotPassBtn/forgotPassBtn'
import { loginSchema, loginSchemaType } from '@/schema/logIn.schema'
import { getSession, signIn } from 'next-auth/react'



export default function LogIn() {

  const router = useRouter()


  const signUpForm = useForm<signUpSchemaType>({
    defaultValues:{
      name:"",
      email:"",
      password:"",
      phone:""
    }, resolver:zodResolver(signUpSchema)
  });

    const logInForm = useForm<loginSchemaType>({
        defaultValues:{
          email:"",
          password:""
        },resolver: zodResolver(loginSchema)
      });

  const { handleSubmit : handleSignUpSubmit } = signUpForm;
    const { handleSubmit:handleLogInSubmit } = logInForm;


  


async function handleLogIn(values: loginSchemaType) {
  const res = await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
  });

  console.log(res)
  console.log(values)

  if (res?.ok) {
    toast.success("You logged in successfully", {
      duration: 3000,
      position: "top-center",
    });

    const session = await getSession();
    const role = session?.user?.role;

    const redirectMap: Record<string, string> = {
      CLIENT: "/client/dashboard",
      artist: "/providers/dashboard",
      ADMIN: "/admin/dashboard",
    };

    const redirectUrl = redirectMap[role ?? ""] ?? "/";
    window.location.href = redirectUrl;
    
  } else {
    toast.error("Invalid email or password", {
      duration: 3000,
      position: "top-center",
    });
  }
}


async function handleSignUp(values : signUpSchemaType){
  console.log(values);
  
axios.post("/api/auth/register" , values).then((res) => {
  console.log(res);
  if(res.data.msg === 'Account created'){
    toast.success("You signed up successfully" ,{
      duration:3000,
      position: "top-center"
    })
     router.push("/LogIn")
  }
  
}).catch((err) => {
  console.log(err.data);

  if(err){
    toast.error("Failed to sign up. Please try again.",{
      duration:3000,
      position: "top-center"
    })

  }
  
})

}

  return (
    <>
<div className='container w-[92%] sm:w-[80%] md:w-[60%] lg:w-[40%] mx-auto mt-5 min-h-screen flex items-center justify-center mb-4'>
  
  <div className="bg-white w-full flex flex-col justify-center items-center text-center p-6 sm:p-8 rounded-2xl shadow">

    <div className='logo flex justify-center'>
      <Image 
        src={logo2} 
        loading="eager" 
        width={400} 
        height={400} 
        className='w-35 sm:w-42.5 md:w-50 object-contain' 
        alt='logo'
      />
    </div>

    <div className="icon-group mt-6 w-full">
      <h1 className="text-3xl font-semibold ">Client Access</h1>
      <h4 className="mb-5 text-gray-500 max-w-95 mx-auto ">
        Access your beauty bookings, manage your profile, and discover new services.
      </h4>

    </div>

 <div className='w-full flex justify-center'>
  <Tabs defaultValue="logIn" className="w-100 ">
      <TabsList className='bg-pink-500 w-full '>
        <TabsTrigger value="logIn">Log In</TabsTrigger>
        <TabsTrigger value="SignUp">Sign Up</TabsTrigger>
      </TabsList>

    <div>
        <Button variant="ghost" className='border border-gray-200 mt-3 w-full'>
            <FcGoogle />
            Sign in with Google
            </Button>    

            <div className="flex items-center gap-3 my-4 w-full">
      
      <div className="flex-1 h-px bg-gray-300"></div>
    
      <p className="text-black text-sm whitespace-nowrap font-bold">
        Or
      </p>
    
      <div className="flex-1 h-px bg-gray-300"></div>
    
    </div>
    </div>

      <TabsContent value="logIn">
        <div className="form-r w-full">
                 <form onSubmit={handleLogInSubmit(handleLogIn)} className='w-full space-y-4'>
                     
       
           
                   <FieldGroup>
                     <Controller
                       name="email"
                       control={logInForm.control}
                       render={({ field, fieldState }) => (
                         <Field data-invalid={fieldState.invalid}>
                           <FieldLabel>Email:</FieldLabel>
                           <Input {...field} autoComplete="on" type="email" placeholder='Email Address'/>
                           {fieldState.error && (
                             <FieldError errors={[fieldState.error]} />
                           )}
                         </Field>
                       )}
                     />
                   </FieldGroup>
           
                   <FieldGroup>
                     <Controller
                       name="password"
                       control={logInForm.control}
                       render={({ field, fieldState }) => (
                         <Field data-invalid={fieldState.invalid}>
                           <FieldLabel>Password:</FieldLabel>
                           <Input {...field} autoComplete="on" type="password" placeholder='Password'/>
                           {fieldState.error && (
                             <FieldError errors={[fieldState.error]} />
                           )}
                         </Field>
                       )}
                     />
                   </FieldGroup>  
       
                   <Button variant="ghost" type='submit' className='bg-pink-500 hover:bg-pink-500 w-full font-bold text-white cursor-pointer'>Log in</Button>    
                   </form>
       
           
                  <div className='mt-3'>
                           <ForgotPassBtn/>
                  </div>
           
           
               </div>
      </TabsContent>
      
      <TabsContent value="SignUp">
           <div className="form-r  w-full">
      <form onSubmit={handleSignUpSubmit(handleSignUp)} className='w-full space-y-4'>
          
        <FieldGroup>
          <Controller
            name="name"
            control={signUpForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Full name:</FieldLabel>
                <Input {...field} autoComplete="on" type="text" placeholder='Full Name'/>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="email"
            control={signUpForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email:</FieldLabel>
                <Input {...field} autoComplete="on" type="email" placeholder='Email Address'/>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="password"
            control={signUpForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Password:</FieldLabel>
                <Input {...field} autoComplete="on" type="password" placeholder='Password'/>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>  

         <FieldGroup>
          <Controller
            name="phone"
            control={signUpForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Phone:</FieldLabel>
                <Input {...field} autoComplete="on" type="tel" placeholder='Phone Number'/>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup> 
      
        <Button  className='bg-pink-500 hover:bg-pink-500 w-full font-bold text-white cursor-pointer'>Create an account</Button>    
        </form>


    </div>
      </TabsContent>

    </Tabs>
 </div>

  </div>
</div>

    
    
    </>
  )
}
