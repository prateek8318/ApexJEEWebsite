import { NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    const cspHeader = `
    base-uri 'self';
    block-all-mixed-content;
    connect-src 'self' blob: data: ${process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9070'};
    default-src 'self' blob: data:;
    font-src 'self' https://fonts.gstatic.com;
    form-action 'self';
    frame-ancestors 'self';
    frame-src 'self' https://www.youtube.com https://youtube.com https://player.vimeo.com;
    img-src 'self' blob: data: https://astrofirst.b-cdn.net https://ui-avatars.com;
    object-src 'none';
    script-src-elem 'self' ${process.env.NODE_ENV === "development" ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}' 'strict-dynamic'`};
    script-src 'self' ${process.env.NODE_ENV === "development" ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}' 'strict-dynamic'`};
    style-src 'self' 'unsafe-inline';
`;

    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, " ")
        .trim();

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("x-nonce", nonce);

    requestHeaders.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue,
    );

    // const pathRoleMap = {
    //     "/dashboard": [
    //         "ROLE_SUPPORT_STAFF",
    //         "ROLE_MAINTAINER",
    //         "ROLE_ORG_ADMIN",
    //         "ROLE_SUPER_ADMIN",
    //         "ROLE_END_USER",
    //         "ROLE_DP_OFFICER",
    //         "ROLE_DEVELOPER",
    //     ],
    //     "/consent-records": ["ROLE_SUPER_ADMIN", "ROLE_ORG_ADMIN"],
    //     "/consent-artifact": ["ROLE_SUPER_ADMIN", "ROLE_ORG_ADMIN", "ROLE_END_USER"],
    //     "/processing-inventory": ["ROLE_SUPER_ADMIN", "ROLE_ORG_ADMIN"],
    //     "/audit-compliance": ["ROLE_SUPER_ADMIN", "ROLE_ORG_ADMIN"],
    //     "/comments": ["ROLE_SUPER_ADMIN"],
    //     "/developers": ["ROLE_SUPER_ADMIN", "ROLE_ORG_ADMIN"],
    //     "/settings": ["ROLE_SUPER_ADMIN", "ROLE_ORG_ADMIN"],
    //     "/profile": [
    //         "ROLE_SUPPORT_STAFF",
    //         "ROLE_MAINTAINER",
    //         "ROLE_ORG_ADMIN",
    //         "ROLE_SUPER_ADMIN",
    //         "ROLE_END_USER",
    //         "ROLE_DP_OFFICER",
    //         "ROLE_DEVELOPER",
    //     ],
    //     "/privacy-notice": ["ROLE_ORG_ADMIN", "ROLE_SUPER_ADMIN"],
    //     "/edit-forms": ["ROLE_ORG_ADMIN", "ROLE_SUPER_ADMIN"],
    //     "/consent-forms": ["ROLE_ORG_ADMIN", "ROLE_SUPER_ADMIN"],
    //     "/grievance": ["ROLE_ORG_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_DP_OFFICER"],
    //     "/support": ["ROLE_ORG_ADMIN", "ROLE_SUPER_ADMIN"],
    // };

    // const privatePages = Object.keys(pathRoleMap);

    // const exceptions: string[] = [];

    // const { searchParams } = new URL(request.url);
    // const authToken = request.cookies.get("AUTH_TOKEN")?.value;
    // const refreshToken = request.cookies.get("REFRESH_TOKEN")?.value;
    // const decodedAuthToken: Token | null = authToken
    //     ? jwtDecode(authToken)
    //     : null;
    // const pathname = request?.nextUrl?.pathname;
    // const userRoles =
    //     typeof decodedAuthToken?.role === "string"
    //         ? [decodedAuthToken.role]
    //         : decodedAuthToken?.role || [];

    // if (!authToken) {
    //     let params = "";
    //     searchParams.forEach((value, key) => (params += `&${key}=${value}`));
    //     if (refreshToken) {
    //         const refreshStatus = await refreshAccessToken();
    //         if (refreshStatus) {
    //             const response = NextResponse.next({
    //                 request: { headers: requestHeaders },
    //             });
    //             response.headers.set(
    //                 "Content-Security-Policy",
    //                 contentSecurityPolicyHeaderValue,
    //             );
    //             return response;
    //         } else {
    //             if (
    //                 privatePages.some((option: string) => pathname.startsWith(option)) &&
    //                 !exceptions.some((option: string) => pathname.startsWith(option))
    //             ) {
    //                 const response = NextResponse.redirect(
    //                     new URL(
    //                         `/auth/login?callbackUrl=${encodeURIComponent(`${process.env.NEXT_PUBLIC_URL}${pathname}${params ? params?.replace("&", "?") : ""}`)}`,
    //                         request.url,
    //                     ),
    //                 );
    //                 response.headers.set(
    //                     "Content-Security-Policy",
    //                     contentSecurityPolicyHeaderValue,
    //                 );
    //                 return response;
    //             }
    //         }
    //     } else {
    //         if (
    //             privatePages.some((option: string) => pathname.startsWith(option)) &&
    //             !exceptions.some((option: string) => pathname.startsWith(option))
    //         ) {
    //             const response = NextResponse.redirect(
    //                 new URL(
    //                     `/auth/login?callbackUrl=${encodeURIComponent(`${process.env.NEXT_PUBLIC_URL}${pathname}${params ? params?.replace("&", "?") : ""}`)}`,
    //                     request.url,
    //                 ),
    //             );
    //             response.headers.set(
    //                 "Content-Security-Policy",
    //                 contentSecurityPolicyHeaderValue,
    //             );
    //             return response;
    //         }
    //     }
    // } else {
    //     if (pathname === "/" || pathname.startsWith("/auth")) {
    //         const response = NextResponse.redirect(
    //             new URL("/dashboard", request.url),
    //         );
    //         response.headers.set(
    //             "Content-Security-Policy",
    //             contentSecurityPolicyHeaderValue,
    //         );
    //         return response;
    //     }
    //     for (const [path, role] of Object.entries(pathRoleMap)) {
    //         if (pathname.startsWith(path)) {
    //             for (const userRole of userRoles) {
    //                 if (role.includes(userRole)) {
    //                     return NextResponse.next({ request: { headers: requestHeaders } });
    //                 }
    //             }
    //             const response = NextResponse.rewrite(
    //                 new URL("/errors/unauthorized", request.url),
    //             );
    //             response.headers.set(
    //                 "Content-Security-Policy",
    //                 contentSecurityPolicyHeaderValue,
    //             );
    //             return response;
    //         }
    //     }
    // }

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue,
    );
    return response;
};

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
