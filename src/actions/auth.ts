"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function getUserSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if(error) {
        return null;
    }
    return { status: "success", user: data?.user };
}

export async function signUp(formData: FormData) {
    const supabase = await createClient(); 

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // Get referral code (optional)
    const referralCode = formData.get("referral_code") as string;

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                referral_code: referralCode || null,
            },
        },
    });

    if (error) {
        return {
            status: error?.message,
            user: null
        };
    } else if (data?.user?.identities?.length === 0) {
        return {
            status: "User with this email already exists, please login",
            user: null
        }
    }

    revalidatePath("/", "layout");
    return { status: "success", user: data.user };
}

export async function signIn(formData: FormData) {
    const supabase = await createClient();

    const credentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error, data } = await supabase.auth.signInWithPassword(credentials);

    if(error) {
        return {
            status: error?.message,
            user: null,
        }
    }
    
    revalidatePath("/", "layout");
    return { status: "success", user: data.user };
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) { 
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/signin");
}

export async function signInWithGoogle() {
    const origin = (await headers()).get("origin");
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`, 
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if(error) {
        redirect("/error");
    } else if (data.url) {
        return redirect(data.url)
    }
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.resetPasswordForEmail(
        formData.get("email") as string,
        {
            redirectTo: `${origin}/reset-password`
        }
    );

    if(error) {
        return { status: error?.message };
    }
    return { status: "success" }
}

export async function resetPassword(formData: FormData, code: string) {
    const supabase = await createClient();

    const { error: CodeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if(CodeError) {
        return { status: CodeError?.message };
    }

    const { error } = await supabase.auth.updateUser({
        password: formData.get("password") as string,
    });

    if(error) {
        return { status: error?.message };
    }

    return { status: "success" };
}