import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request : NextRequest){
    const token = await getToken({req : request })
    const {pathname} = request.nextUrl

    if(!token){
        if(pathname.startsWith('/client') ||
        pathname.startsWith("/providers")||
        pathname.startsWith("/admin")){
            return NextResponse.redirect(new URL ("/LogIn" , request.url))
        }
    }


    if (token){
            const role = token.role

        if (pathname.startsWith("/client") && role !== "client")
      return NextResponse.redirect(new URL("/", request.url));

    if (pathname.startsWith("/providers") && role !== "artist")
      return NextResponse.redirect(new URL("/", request.url));

    if (pathname.startsWith("/admin") && role !== "admin")
      return NextResponse.redirect(new URL("/", request.url));
        }
            return NextResponse.next()

        

     }


export const config = {
  matcher: ['/admin/:path*', '/client/:path*' , '/providers/:path*' ],
}


// '/products/:path*'