import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // const user = await supabase.auth.getUser();
    // const protectedRoutes = ["/", "/dashboard", "/protected"];

    // const isProtected = protectedRoutes.some(
    //   (path) =>
    //     request.nextUrl.pathname === path ||
    //     request.nextUrl.pathname.startsWith(`${path}/`)
    // );

    // if (isProtected && user.error) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    const PUBLIC_ROUTES = [
      "/sign-in",
      "/forgot-password",
      "/auth/callback",
      "/protected",
    ];
    const pathname = request.nextUrl.pathname;

    // Allow public routes without auth
    const isPublic = PUBLIC_ROUTES.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData?.user) {
      // Allow unauthenticated users on public routes
      if (isPublic) return response;

      // Redirect to sign-in on protected routes
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const role = userData.user.user_metadata?.role;

    // Role-based access
    if (pathname.startsWith("/dashboard") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/" && role !== "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
